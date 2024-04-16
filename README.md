# Changelog 生成工具

@eat-fish/changelog 是一款专用于 npm 包版本升级与 版本变更日志生成的工具, 也可以使用在应用项目中

在发布新版本前使用 @eat-fish/changelog 来生成下一个版本号与 CHANGELOG 变更日志

通过自定义 commit matcher 可以实现基于 commit 提取生成或者 基于 PR 提取生成两种方式的 CHANGELOG 日志

## 示例项目

### 基于 commit 方案

通过 自定义 配置文件 matcher 函数来提取 特定 commit 生成

```js
module.exports = {
  matcher: (rawCommitInfo) => {
    const { message } = rawCommitInfo;

    // 提取 feat、fix 类型 的 commit
    const [, type, scope, description] = message.match(/(feat|fix)(?:\(([^)]*?)\))?:\s?(.+)/) || [];

    if (!type || !description) return false;

    return {
      type,
      scope,
      description,
    };
  },
};
```

[changelog-commit-example](https://github.com/xjq7/changelog-commit-example)

[CHANGELOG 示例查看](https://github.com/xjq7/changelog-commit-example/blob/main/CHANGELOG.md)

### 基于 PR 方案

通过 自定义 配置文件 matcher 函数来提取 特定 PR commit 生成

```js
module.exports = {
  matcher: (rawCommitInfo) => {
    const { message, description: rawDescription } = rawCommitInfo;

    // 先过滤 PR 类型 commit
    const messageMatchRes = message.match(/Merge pull request #\d+ from ([^\\]+)\/(.+)/) || [];

    if (!messageMatchRes) return false;

    const [, author] = messageMatchRes;

    // 再提取 commit 信息
    const [, type, scope, description] = rawDescription.match(/(feat|fix)(?:\(([^)]*?)\))?:\s?(.+)/) || [];

    if (!type || !description) return false;

    return {
      type,
      scope,
      description,
      author,
    };
  },
};
```

[changelog-pr-example](https://github.com/xjq7/changelog-pr-example)

[CHANGELOG 示例查看](https://github.com/xjq7/changelog-pr-example/blob/main/CHANGELOG.md)

## 使用

### 安装

```sh
pnpm add @eat-fish/changelog@latest -D
```

### 手动创建第一个 tag

如果是首次引入 @eat-fish/changelog, 需要先手动创建第一个 tag

使用如下命令, 创建的 tag 名为 v+ 当前 package.json 中的版本号, 例如 v1.0.0

```sh
git tag -a v1.0.0 -m "Version 1.0.0"
```

### 开始

运行前确保 没有 package.json 文件以及 CHANGELOG.md 文件的变更

然后执行升级并生成 CHANGELOG 命令

```sh
# 可以选择你想升级的版本

# fix 版本变更: 1.0.0 -> 1.0.1
pnpm changelog release patch

# feature 版本变更: 1.0.0 -> 1.1.0
pnpm changelog release minor

# feature 版本变更: 1.0.0 -> 2.0.0
pnpm changelog release major
```

### 确认无误后提交升级变更

运行完成后将自动 commit

包含 package.json 版本号变更以及 CHANGELOG.md 日志变更

确认无误后可以提交上去, 如有问题则使用一下命令撤回

```sh
git reset --hard HEAD~1
```

后续如果是 npm 包可以正常走 npm publish 发布

如果是应用项目则结束了

## 开发

## FAQ

### 已存在 tag 如何处理？

如果运行过程中出现报错已存在 tag

说明 下一个版本号将生成的 tag 名被占用, 一般来说下一个版本号是 v+版本号的形式, 例如 v1.0.1

如果这个 tag 是 @eat-fish/changelog 所生成的, 则使用命令依次删除本地和远程的 tag

```sh
# 本地
git tag -d v1.0.1

# 远程
git push origin -d v1.0.1
```
