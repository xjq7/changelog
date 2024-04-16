export const defaultMatcher = (rawCommitInfo: RawCommit) => {
  const { message } = rawCommitInfo;

  const [, type, scope, description] = message.match(/(feat|fix)(?:\((.*?)\))?:\s?(.+)/) || [];

  if (!type || !description) return false;

  return {
    type,
    scope,
    description,
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
