export const defaultMatcher = (rawCommitInfo: RawCommit) => {
  const { message } = rawCommitInfo;

  const messageMatchRes = message.match(/^Merge branch 'feature-(\w{6})-(.+?)' into 'feature-\1'/);

  if (!messageMatchRes) return false;
  const [, , author] = messageMatchRes;

  const [, type, scope, description] = message.match(/(feat|fix)(?:\((.*?)\))?:\s?(.+)/) || [];

  if (!type || !description) return false;

  return {
    type,
    scope,
    description,
    author,
  };
};

export const CommitTypeLabel: Record<string, string> = {
  feat: '🚀 Feature',
  fix: '🐛 Bug Fix',
  chore: '🔧 Chore',
  perf: '⚡ Performance',
  docs: '📝 Documentation',
  style: '💅 Code Style',
  refactor: '🔨 Refactor',
  test: '✅ Test',
  ci: '🔁 Continuous Integration',
};
