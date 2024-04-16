interface Repo {
  host: string | null;
  owner: string | null;
  project: string | null;
  protocol: string | null;
  remote: string | null;
  repository: string | null;
}

interface RawCommit {
  /** 短 hash */
  sha: string;
  /** 完整 hash */
  hash: string;
  /** 作者 */
  authorName: string;
  /** 作者邮箱 */
  authorEmail: string;
  /** 变更信息 */
  message: string;
  /** 详细描述 */
  description: string;
}

interface Commit {
  /** 短 hash */
  sha: string;
  /** 完整 hash */
  hash: string;
  /** 作者 */
  authorName: string;
  /** 作者邮箱 */
  authorEmail: string;
  /** 提交类型 */
  type: string;
  /** 提交范围 */
  scope?: string;
  /** 详细描述 */
  description: string;
}

interface CommitInfo {
  /** 提交类型 */
  type: string;
  /** 提交范围 */
  scope?: string;
  /** 详细描述 */
  description: string;
  /** 作者名 */
  author?: string;
}

interface Config {
  type?: ReleaseType;
  matcher: (s: RawCommit) => CommitInfo | boolean;
}

type ReleaseType = 'patch' | 'minor' | 'major';

interface CommitGroup {
  /** 类型 */
  type: string;
  /** 文案 */
  title: string;
  /** commit 列表 */
  list: CommitInfo[];
}
