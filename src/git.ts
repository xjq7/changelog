import * as helper from './helper';
import execa from 'execa';

/**
 * 获取当前仓库信息
 * @returns
 */
export async function getRepo() {
  const remoteUrl = await execa('git', ['remote', 'get-url', 'origin'])
    .then((res) => res.stdout)
    .catch(() => null);
  if (!remoteUrl) {
    throw new Error('remote url 获取失败');
  }
  const repo = helper.parseGitUrl(remoteUrl);
  return repo;
}

/**
 * 获取当前分支
 * @returns
 */
export function getBranchName() {
  return execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
    .then((res) => res.stdout)
    .catch(() => null);
}

/**
 * 根据 tag 获取 commitID
 * @param tag
 * @returns
 */
export async function getTagCommitId(tag: string) {
  const tagStr = await execa('git', ['ls-remote', '--tags', 'origin', tag]).then((res) => res.stdout);

  const commitId = (tagStr?.match(/\w+/) || [])[0];
  return commitId;
}

export async function generateTag(name: string) {
  return execa('git', ['tag', '-a', name, '-m', 'tubitlog 自动创建']).then((res) => res.stdout);
}

export async function deleteTag(name: string) {
  return execa('git', ['tag', '-d', name]).then((res) => res.stdout);
}

export async function pushTag(name: string) {
  return execa('git', ['push', 'origin', name]).then((res) => res.stdout);
}

export async function deleteRemoteTag(name: string) {
  return execa('git', ['push', 'origin', '--delete', name]).then((res) => res.stdout);
}

export async function getFileContentByCommitId(commitId: string, file: string) {
  return execa('git', ['cat-file', '-p', `${commitId}:${file}`]).then((res) => res.stdout);
}

export async function commit(message: string) {
  return execa('git', ['commit', '-m', message]).then((res) => res.stdout);
}

export async function add(files: string[]) {
  return execa('git', ['add', ...files]).then((res) => res.stdout);
}

export async function resetLastCommit() {
  return Promise.all([
    execa('git', ['stash']),
    execa('git', ['reset', '--hard', 'HEAD~1']),
    execa('git', ['stash', 'pop']),
  ]);
}

export async function status() {
  return execa('git', ['status', '--porcelain']).then((res) => res.stdout);
}
