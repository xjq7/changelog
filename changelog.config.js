module.exports = {
  matcher: (rawCommitInfo) => {
    const { message } = rawCommitInfo;

    const [, type, scope, description] = message.match(/(feat|fix)(?:\(([^)]*?)\))?:\s?(.+)/) || [];

    if (!type || !description) return false;

    return {
      type,
      scope,
      description,
    };
  },
};
