import execa from 'execa';
import fs from 'fs';
import path from 'path';
import * as version from './version';
import * as helper from './helper';
import * as git from './git';
import Handlebars from 'handlebars';
import { CommitTypeLabel, defaultMatcher } from './constant';
import { IDependenciesDiff } from './helper';
import prettier from 'prettier';

Handlebars.registerHelper('ifEvenIndex', (index) => {
  if (index % 2 === 0) {
    return '|';
  } else {
    return '';
  }
});

Handlebars.registerHelper('insertLineBreak', (index) => {
  if (index % 2 === 0 && index !== 0) {
    return new Handlebars.SafeString('\n');
  }
  return '';
});

const root = process.cwd();
const pkgPath = path.resolve(root, 'package.json');

const pkgStr = fs.readFileSync(pkgPath, 'utf8');
const pkgJson = JSON.parse(pkgStr);

const configPath = path.resolve(process.cwd(), 'changelog.config.js');

const prettierConfig = prettier.resolveConfig.sync(process.cwd());

export default class Changelog {
  repo?: Repo;

  from!: string;

  to?: string;

  config: Config = {} as Config;

  rollingBackQueue: (() => Promise<void> | void)[] = [];

  /**
   * 阻塞式初始化
   */
  async init(config: { type: ReleaseType }) {
    const { type } = config || {};

    let userConfig: Config = {} as Config;

    if (fs.existsSync(configPath)) {
      userConfig = require(configPath);
    }

    const { matcher = defaultMatcher } = userConfig;

    this.config = { type, matcher };
    await this.configCheck(this.config);

    await this.check();

    this.repo = await git.getRepo();
    if (!this.repo) {
      throw new Error('git repo 信息获取失败');
    }

    const { version } = pkgJson;
    this.from = version;
    console.log(`当前版本号: ${this.from}`);
  }

  /**
   * 当前运行环境检测
   */
  async check() {
    const gitStatusStdout = await git.status();

    const modifiedFiles = gitStatusStdout.split(/\r?\n/).map((content) => content.replace(/ M /, ''));
    if (modifiedFiles.includes('package.json')) {
      throw new Error('请先撤销或提交 package.json 文件的变更');
    }

    if (modifiedFiles.includes('CHANGELOG.md')) {
      throw new Error('请先撤销或提交 CHANGELOG.md 文件的变更');
    }
  }

  /**
   * 配置校验
   */
  async configCheck(config: Config) {
    const { type } = config;

    if (type && !version.ALL_RELEASE_TYPES.includes(type as string)) {
      throw new Error('release type 非法');
    }
  }

  /**
   * 生成 md 格式的 changelog
   * @param commits
   * @returns
   */
  renderMarkdown(changelogStr: string) {
    let content = `# Changelog\n\n${changelogStr}`;

    if (!fs.existsSync('CHANGELOG.md')) {
      fs.writeFileSync('CHANGELOG.md', '# Changelog\n\n');
    }

    let originContent = fs.readFileSync('CHANGELOG.md', 'utf8');

    this.rollingBackQueue.push(() => {
      fs.writeFileSync('CHANGELOG.md', originContent, 'utf8');
      console.log('CHANGELOG.md 文件变更已回滚');
    });

    originContent = originContent.replace('# Changelog\n', '');

    content += originContent;
    prettier.format(content, { ...prettierConfig, parser: 'markdown' });

    fs.writeFileSync('CHANGELOG.md', content, 'utf8');
    console.log('CHANGELOG 文件已更新');
  }

  /**
   * 生成 changelog string
   * @param commits
   * @param dependenciesDiff
   * @returns
   */
  async generateChangelog(commits: Commit[], dependenciesDiff: [IDependenciesDiff, IDependenciesDiff] | null) {
    const formatDependenciesDiff: string[] = [];

    if (dependenciesDiff) {
      const idx = [0, 1];

      dependenciesDiff.forEach((diff, index) => {
        diff.add.forEach((pkg) => {
          formatDependenciesDiff[idx[index]] = `<span style="color: green;">+${pkg}</span>`;
          idx[index] += 2;
        });
        diff.delete.forEach((pkg) => {
          formatDependenciesDiff[idx[index]] = `<span style="color: red;">-${pkg}</span>`;
          idx[index] += 2;
        });
        diff.change.forEach(([prevPkg, pkg, wave]) => {
          const [, prevName, prevVersion] = prevPkg.match(/^(.+)@(.+)$/) || [];

          const [, name, version] = pkg.match(/^(.+)@(.+)$/) || [];

          if (wave === 1) {
            formatDependenciesDiff[
              idx[index]
            ] = `${prevName}@<span style="color: green;">${prevVersion}</span> -> ${name}@<span style="color: red;">${version}</span>`;
          } else if (wave === -1) {
            formatDependenciesDiff[
              idx[index]
            ] = `${prevName}@<span style="color: red;">${prevVersion}</span> -> ${name}@<span style="color: green;">${version}</span>`;
          } else {
            formatDependenciesDiff[idx[index]] = `${prevName}@${prevVersion} -> ${name}@${version}`;
          }
          idx[index] += 2;
        });
      });
    }

    if (!commits.length && !formatDependenciesDiff.length) return '';

    const { host, repository } = this.repo || {};

    const groupCommits = helper.groupBy(commits, 'type');
    const repoUrl = `https://${host}/${repository}`;

    const commitGroups = helper
      .sortByOrder(Object.keys(groupCommits), [
        'feat',
        'fix',
        'chore',
        'refactor',
        'style',
        'perf',
        'docs',
        'test',
        'ci',
        'revert',
      ])
      .reduce<CommitGroup[]>((acc, type) => {
        const commits = groupCommits[type];
        const rcommits = commits.map((commit) => {
          const { type, sha, hash, authorName, description, scope } = commit;
          const commitLink = `${repoUrl}/commit/${hash}`;
          return {
            type,
            sha,
            authorName,
            description,
            hash,
            scope,
            commitLink,
          };
        }, []);

        acc.push({
          type,
          list: rcommits,
          title: CommitTypeLabel[type],
        } as CommitGroup);
        return acc;
      }, []);

    const standardTemplate = fs.readFileSync(path.resolve(__dirname + '/standard.hbs'), 'utf8');

    const template = Handlebars.compile(standardTemplate);

    const changelog = template({
      version: this.to,
      compareLink: `https://${host}/${repository}/compare/v${this.from}...v${this.to}`,
      commits: commitGroups,
      dependenciesDiff: formatDependenciesDiff,
    });

    return changelog;
  }

  /**
   * 生成并推送 tag
   */
  async generateTag() {
    const tagName = `v${this.to}`;
    await git.generateTag(`v${this.to}`);
    console.log(`标签 ${tagName} 已生成`);

    this.rollingBackQueue.push(async () => {
      await git.deleteTag(tagName);
      console.log('本地 tag 已回滚');
    });

    await git.pushTag(tagName);
    console.log(`标签 ${tagName} 已推送`);

    this.rollingBackQueue.push(async () => {
      await git.deleteRemoteTag(tagName);
      console.log('远端 tag 已回滚');
    });
  }

  /**
   * 发布更新
   */
  async release() {
    console.log('开始执行...');
    const dependenciesDiff = await this.dependenciesAnalyze();

    const from = `v${this.from}`;
    const commits = await this.listCommits(from);

    this.generateNextVersion(commits);

    const changelogStr = await this.generateChangelog(commits, dependenciesDiff);

    if (!changelogStr) {
      console.log('暂无变更, 终止更新');
      return;
    }

    this.renderMarkdown(changelogStr);

    await this.updateVersion();

    await this.releaseCommit();

    await this.generateTag();
  }

  /**
   * 提交变更
   */
  async releaseCommit() {
    await git.add(['CHANGELOG.md', 'package.json']);
    await git.commit(`Release v${this.to}`);
    this.rollingBackQueue.push(async () => {
      await git.resetLastCommit();
    });
  }

  /**
   * 回滚
   */
  async rollingBack() {
    console.log('开始回滚');
    for (const fn of this.rollingBackQueue) {
      await fn();
    }
    console.log('回滚结束');
  }

  /**
   * 更新 package 版本
   */
  async updateVersion() {
    const newPkgJson = { ...pkgJson };
    newPkgJson.version = this.to;
    fs.writeFileSync(pkgPath, JSON.stringify(newPkgJson, null, 2) + '\n', 'utf8');

    this.rollingBackQueue.push(() => {
      fs.writeFileSync(pkgPath, pkgStr, 'utf8');
      console.log('package.json 版本变更已回滚');
    });

    console.log('本地 package.json 版本已更新: ', this.to);
  }

  /**
   * 获取变更 commit 列表
   * @param fromCommitId
   * @returns
   */
  async listCommits(from: string): Promise<Commit[]> {
    const { matcher } = this.config;

    const commits = (
      (await execa
        .sync('git', [
          'log',
          '--pretty=--split--flag--shortHash<%h> hash<%H> message<%s> ref<%D> description<%b> authorName<%an> authorEmail<%ae> date<%cd>',
          '--date=short',
          `${from}..`,
        ])
        .stdout.split('--split--flag--')
        .filter(Boolean)
        .map(helper.parseLogMessage)
        .filter(Boolean)) as RawCommit[]
    )
      .map((rawCommitInfo) => {
        const { sha, hash, authorEmail, authorName } = rawCommitInfo;
        const matcherRes = matcher(rawCommitInfo);

        if (typeof matcherRes === 'boolean') return false;

        const { type, scope, description, author } = matcherRes as CommitInfo;
        return {
          sha,
          type,
          scope,
          description,
          hash,
          authorEmail,
          authorName: author || authorName,
        };
      })
      .filter(Boolean) as Commit[];

    return commits;
  }

  /**
   * 分析依赖变更
   * @returns
   */
  async dependenciesAnalyze(): Promise<[helper.IDependenciesDiff, helper.IDependenciesDiff] | null> {
    const lastTag = `v${this.from}`;
    const lastTagCommit = await git.getTagCommitId(lastTag);

    if (!lastTagCommit) return null;

    const lastPackageJsonContent = await git.getFileContentByCommitId(lastTagCommit, 'package.json');

    const packageJsonContent = await git.getFileContentByCommitId('head', 'package.json');
    const lastPackageJson = JSON.parse(lastPackageJsonContent);
    const packageJson = JSON.parse(packageJsonContent);

    const lastDevDependencies = lastPackageJson.devDependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    const lastDependencies = lastPackageJson.dependencies || {};
    const dependencies = packageJson.dependencies || {};

    const devDiff = helper.jsonDiff(lastDevDependencies, devDependencies);
    const prodDiff = helper.jsonDiff(lastDependencies, dependencies);
    return [devDiff, prodDiff];
  }

  /**
   * 生成下一个版本号
   * @param releaseType
   */
  generateNextVersion(commits: Commit[]) {
    let releaseType: ReleaseType = 'patch';

    commits.forEach((commit) => {
      const { type } = commit;

      if (type === 'feat') {
        releaseType = 'minor';
      }
    });

    this.to = version.upgrade(this.from, (this.config.type || releaseType) as ReleaseType);
    if (!this.to) {
      throw new Error('版本号生成失败');
    }
    console.log(`即将升级版本号: ${this.to}`);
  }
}
