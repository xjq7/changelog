import gitUrlParse from 'git-url-parse';
import semver from 'semver';

export function parseLogMessage(commit: string) {
  const parts =
    commit.match(
      /shortHash<([^>]+)> hash<([^>]+)> message<(.*)> ref<(.*)> description<((?:.|\n)*)> authorName<(.*)> authorEmail<(.*)> date<([^>]*)>/im,
    ) || [];

  if (!parts || parts.length === 0) {
    return null;
  }

  const [, sha, hash, message, refName, description, authorName, authorEmail, date] = parts;

  return {
    sha,
    hash,
    message: message.trim(),
    refName,
    authorName,
    authorEmail,
    date,
    description,
  };
}

export function groupBy<T extends Record<string, any>>(array: T[], groupField: keyof T): Record<string, T[]> {
  return array.reduce<Record<string, T[]>>((acc, cur) => {
    let type = cur[groupField];
    if (!type) type = 'default' as T[keyof T];
    if (!acc[type]) acc[type] = [];
    acc[type].push(cur);
    return acc;
  }, {});
}

export const parseGitUrl = (remoteUrl: string): Repo => {
  if (!remoteUrl)
    return {
      host: null,
      owner: null,
      project: null,
      protocol: null,
      remote: null,
      repository: null,
    };

  const parsedUrl = gitUrlParse(remoteUrl);

  const { resource: host, name: project, protocol, href: remote } = parsedUrl;
  const { owner } = parsedUrl;
  const repository = `${owner}/${project}`;
  return { host, owner, project, protocol, remote, repository };
};

export interface IDependenciesDiff {
  add: string[];
  delete: string[];
  change: [string, string, number][];
}

export function jsonDiff(from: Record<string, string>, to: Record<string, string>): IDependenciesDiff {
  const ans: IDependenciesDiff = { add: [], delete: [], change: [] };

  Object.entries(from).forEach(([pkg, version]) => {
    const preVersion = semver.coerce(version);
    const curVersion = semver.coerce(to[pkg]);
    const wave = preVersion && curVersion ? (semver.gte(preVersion, curVersion) ? 1 : -1) : 0;

    if (to[pkg]) {
      if (to[pkg] !== version) {
        ans.change.push([`${pkg}@${version}`, `${pkg}@${to[pkg]}`, wave]);
      }
    } else {
      ans.delete.push(`${pkg}@${version}`);
    }
  });

  Object.entries(to).forEach(([pkg, version]) => {
    if (!from[pkg]) {
      ans.add.push(`${pkg}@${version}`);
    }
  });

  return ans;
}

/**
 * 按指定顺序排序数组
 * @param arr
 * @param order
 * @returns
 */
export function sortByOrder<T>(arr: T[], order: string[]) {
  const orderMap = order.reduce((acc, cur, index) => {
    acc.set(cur, index);
    return acc;
  }, new Map());

  return arr.sort((a, b) => {
    const indexA = orderMap.get(a);
    const indexB = orderMap.get(b);
    if (indexA === undefined && indexB === undefined) {
      return 0;
    } else if (indexA === undefined) {
      return 1;
    } else if (indexB === undefined) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });
}
