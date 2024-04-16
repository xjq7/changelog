'use strict';

var commander = require('commander');
var execa = require('execa');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var gitUrlParse = require('git-url-parse');
var Handlebars = require('handlebars');
var prettier = require('prettier');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var name = "@x/changelog";
var version = "1.0.0";
var main = "dist/index.js";
var module$1 = "dist/index.es.js";
var types = "dist/index.es.d.ts";
var files = [
	"bin",
	"lib",
	"es"
];
var bin = {
	changelog: "bin/index.js"
};
var scripts = {
	build: "rollup -c --bundleConfigAsC@js",
	"build:watch": "rollup -c --bundleConfigAsCjs --watch"
};
var repository = {
	type: "git",
	url: "git+https://github.com/xjq7/changelog.git"
};
var keywords = [
];
var author = "";
var license = "ISC";
var bugs = {
	url: "https://github.com/xjq7/changelog/issues"
};
var homepage = "https://github.com/xjq7/changelog#readme";
var devDependencies = {
	"@babel/core": "^7.21.0",
	"@babel/plugin-transform-runtime": "^7.21.0",
	"@babel/preset-env": "^7.20.2",
	"@babel/preset-typescript": "^7.21.0",
	"@rollup/plugin-babel": "^6.0.3",
	"@rollup/plugin-commonjs": "^24.0.1",
	"@rollup/plugin-json": "^6.0.0",
	"@rollup/plugin-node-resolve": "^15.0.1",
	"@rollup/plugin-terser": "^0.4.0",
	"@rollup/plugin-typescript": "^11.0.0",
	"@types/git-url-parse": "^9.0.3",
	"@types/node": "^18.14.2",
	"@types/semver": "^7.5.8",
	"cross-env": "^7.0.3",
	jest: "^29.4.3",
	rimraf: "^4.1.2",
	rollup: "^3.17.3",
	"rollup-plugin-clear": "^2.0.7",
	"rollup-plugin-ts": "^3.2.0",
	tslib: "^2.5.0",
	typescript: "^4.9.5"
};
var dependencies = {
	commander: "^12.0.0",
	execa: "5.1.1",
	"git-url-parse": "^14.0.0",
	handlebars: "^4.7.8",
	prettier: "^2.8.4",
	semver: "^7.6.0"
};
var directories = {
	example: "example"
};
var publishConfig = {
	access: "public"
};
var pkg = {
	name: name,
	version: version,
	main: main,
	module: module$1,
	types: types,
	files: files,
	bin: bin,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	dependencies: dependencies,
	directories: directories,
	publishConfig: publishConfig
};

var RELEASE_TYPES = ['patch', 'minor', 'major'];
var PRERELEASE_TYPES = ['prepatch', 'preminor', 'premajor'];
var CONTINUATION_TYPES = ['prerelease', 'pre'];
var ALL_RELEASE_TYPES = __spreadArray(__spreadArray(__spreadArray([], RELEASE_TYPES, true), PRERELEASE_TYPES, true), CONTINUATION_TYPES, true);
function upgrade(version, releaseTypes) {
    return semver.inc(version, releaseTypes) || '';
}

function parseLogMessage(commit) {
    var parts = commit.match(/shortHash<([^>]+)> hash<([^>]+)> message<(.*)> ref<(.*)> description<((?:.|\n)*)> authorName<(.*)> authorEmail<(.*)> date<([^>]*)>/im) || [];
    if (!parts || parts.length === 0) {
        return null;
    }
    var sha = parts[1], hash = parts[2], message = parts[3], refName = parts[4], description = parts[5], authorName = parts[6], authorEmail = parts[7], date = parts[8];
    return {
        sha: sha,
        hash: hash,
        message: message.trim(),
        refName: refName,
        authorName: authorName,
        authorEmail: authorEmail,
        date: date,
        description: description,
    };
}
function groupBy(array, groupField) {
    return array.reduce(function (acc, cur) {
        var type = cur[groupField];
        if (!type)
            type = 'default';
        if (!acc[type])
            acc[type] = [];
        acc[type].push(cur);
        return acc;
    }, {});
}
var parseGitUrl = function (remoteUrl) {
    if (!remoteUrl)
        return {
            host: null,
            owner: null,
            project: null,
            protocol: null,
            remote: null,
            repository: null,
        };
    var parsedUrl = gitUrlParse(remoteUrl);
    var host = parsedUrl.resource, project = parsedUrl.name, protocol = parsedUrl.protocol, remote = parsedUrl.href;
    var owner = parsedUrl.owner;
    var repository = "".concat(owner, "/").concat(project);
    return { host: host, owner: owner, project: project, protocol: protocol, remote: remote, repository: repository };
};
function jsonDiff(from, to) {
    var ans = { add: [], delete: [], change: [] };
    Object.entries(from).forEach(function (_a) {
        var pkg = _a[0], version = _a[1];
        var preVersion = semver.coerce(version);
        var curVersion = semver.coerce(to[pkg]);
        var wave = preVersion && curVersion ? (semver.gte(preVersion, curVersion) ? 1 : -1) : 0;
        if (to[pkg]) {
            if (to[pkg] !== version) {
                ans.change.push(["".concat(pkg, "@").concat(version), "".concat(pkg, "@").concat(to[pkg]), wave]);
            }
        }
        else {
            ans.delete.push("".concat(pkg, "@").concat(version));
        }
    });
    Object.entries(to).forEach(function (_a) {
        var pkg = _a[0], version = _a[1];
        if (!from[pkg]) {
            ans.add.push("".concat(pkg, "@").concat(version));
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
function sortByOrder(arr, order) {
    var orderMap = order.reduce(function (acc, cur, index) {
        acc.set(cur, index);
        return acc;
    }, new Map());
    return arr.sort(function (a, b) {
        var indexA = orderMap.get(a);
        var indexB = orderMap.get(b);
        if (indexA === undefined && indexB === undefined) {
            return 0;
        }
        else if (indexA === undefined) {
            return 1;
        }
        else if (indexB === undefined) {
            return -1;
        }
        else {
            return indexA - indexB;
        }
    });
}

/**
 * 获取当前仓库信息
 * @returns
 */
function getRepo() {
    return __awaiter(this, void 0, void 0, function () {
        var remoteUrl, repo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execa('git', ['remote', 'get-url', 'origin'])
                        .then(function (res) { return res.stdout; })
                        .catch(function () { return null; })];
                case 1:
                    remoteUrl = _a.sent();
                    if (!remoteUrl) {
                        throw new Error('remote url 获取失败');
                    }
                    repo = parseGitUrl(remoteUrl);
                    return [2 /*return*/, repo];
            }
        });
    });
}
/**
 * 根据 tag 获取 commitID
 * @param tag
 * @returns
 */
function getTagCommitId(tag) {
    return __awaiter(this, void 0, void 0, function () {
        var tagStr, commitId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execa('git', [
                        'ls-remote',
                        '--tags',
                        'origin',
                        tag,
                    ]).then(function (res) { return res.stdout; })];
                case 1:
                    tagStr = _a.sent();
                    commitId = ((tagStr === null || tagStr === void 0 ? void 0 : tagStr.match(/\w+/)) || [])[0];
                    return [2 /*return*/, commitId];
            }
        });
    });
}
function generateTag(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execa('git', ['tag', '-a', name, '-m', 'tubitlog 自动创建']).then(function (res) { return res.stdout; })];
        });
    });
}
function deleteTag(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execa('git', ['tag', '-d', name]).then(function (res) { return res.stdout; })];
        });
    });
}
function pushTag(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execa('git', ['push', 'origin', name]).then(function (res) { return res.stdout; })];
        });
    });
}
function deleteRemoteTag(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execa('git', ['push', 'origin', '--delete', name]).then(function (res) { return res.stdout; })];
        });
    });
}
function getFileContentByCommitId(commitId, file) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execa('git', ['cat-file', '-p', "".concat(commitId, ":").concat(file)]).then(function (res) { return res.stdout; })];
        });
    });
}
function commit(message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execa('git', ['commit', '-m', message]).then(function (res) { return res.stdout; })];
        });
    });
}
function add(files) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execa('git', __spreadArray(['add'], files, true)).then(function (res) { return res.stdout; })];
        });
    });
}

var defaultMatcher = function (rawCommitInfo) {
    var message = rawCommitInfo.message;
    var messageMatchRes = message.match(/^Merge branch 'feature-(\w{6})-(.+?)' into 'feature-\1'/);
    if (!messageMatchRes)
        return false;
    var author = messageMatchRes[2];
    var _a = message.match(/(feat|fix)(?:\((.*?)\))?:\s?(.+)/) || [], type = _a[1], scope = _a[2], description = _a[3];
    if (!type || !description)
        return false;
    return {
        type: type,
        scope: scope,
        description: description,
        author: author,
    };
};
var CommitTypeLabel = {
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

Handlebars.registerHelper('ifEvenIndex', function (index) {
    if (index % 2 === 0) {
        return '|';
    }
    else {
        return '';
    }
});
Handlebars.registerHelper('insertLineBreak', function (index) {
    if (index % 2 === 0 && index !== 0) {
        return new Handlebars.SafeString('\n');
    }
    return '';
});
var root = process.cwd();
var pkgPath = path.resolve(root, 'package.json');
var pkgStr = fs.readFileSync(pkgPath, 'utf8');
var pkgJson = JSON.parse(pkgStr);
var configPath = path.resolve(process.cwd(), 'tubitlog.config.js');
var prettierConfig = prettier.resolveConfig.sync(process.cwd());
var Changelog = /** @class */ (function () {
    function Changelog() {
        this.config = {};
        this.rollingBackQueue = [];
    }
    /**
     * 阻塞式初始化
     */
    Changelog.prototype.init = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var type, userConfig, _a, matcher, _b, version;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        type = (config || {}).type;
                        userConfig = {};
                        if (fs.existsSync(configPath)) {
                            userConfig = require(configPath);
                        }
                        _a = userConfig.matcher, matcher = _a === void 0 ? defaultMatcher : _a;
                        this.config = { type: type, matcher: matcher };
                        return [4 /*yield*/, this.configCheck(this.config)];
                    case 1:
                        _c.sent();
                        _b = this;
                        return [4 /*yield*/, getRepo()];
                    case 2:
                        _b.repo = _c.sent();
                        if (!this.repo) {
                            throw new Error('git repo 信息获取失败');
                        }
                        version = pkgJson.version;
                        this.from = version;
                        console.log("\u5F53\u524D\u7248\u672C\u53F7: ".concat(this.from));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 配置校验
     */
    Changelog.prototype.configCheck = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var type;
            return __generator(this, function (_a) {
                type = config.type;
                if (type && !ALL_RELEASE_TYPES.includes(type)) {
                    throw new Error('release type 非法');
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * 生成 md 格式的 changelog
     * @param commits
     * @returns
     */
    Changelog.prototype.renderMarkdown = function (changelogStr) {
        var content = "# Changelog\n\n".concat(changelogStr);
        if (!fs.existsSync('CHANGELOG.md')) {
            fs.writeFileSync('CHANGELOG.md', '# Changelog\n\n');
        }
        var originContent = fs.readFileSync('CHANGELOG.md', 'utf8');
        this.rollingBackQueue.push(function () {
            fs.writeFileSync('CHANGELOG.md', originContent, 'utf8');
            console.log('CHANGELOG.md 文件变更已回滚');
        });
        originContent = originContent.replace('# Changelog\n', '');
        content += originContent;
        prettier.format(content, __assign(__assign({}, prettierConfig), { parser: 'markdown' }));
        fs.writeFileSync('CHANGELOG.md', content, 'utf8');
        console.log('CHANGELOG 文件已更新');
    };
    /**
     * 生成 changelog string
     * @param commits
     * @param dependenciesDiff
     * @returns
     */
    Changelog.prototype.generateChangelog = function (commits, dependenciesDiff) {
        return __awaiter(this, void 0, void 0, function () {
            var formatDependenciesDiff, idx_1, _a, host, repository, groupCommits, repoUrl, commitGroups, standardTemplate, template, changelog;
            return __generator(this, function (_b) {
                formatDependenciesDiff = [];
                if (dependenciesDiff) {
                    idx_1 = [0, 1];
                    dependenciesDiff.forEach(function (diff, index) {
                        diff.add.forEach(function (pkg) {
                            formatDependenciesDiff[idx_1[index]] = "<span style=\"color: green;\">+".concat(pkg, "</span>");
                            idx_1[index] += 2;
                        });
                        diff.delete.forEach(function (pkg) {
                            formatDependenciesDiff[idx_1[index]] = "<span style=\"color: red;\">-".concat(pkg, "</span>");
                            idx_1[index] += 2;
                        });
                        diff.change.forEach(function (_a) {
                            var prevPkg = _a[0], pkg = _a[1], wave = _a[2];
                            var _b = prevPkg.match(/^(.+)@(.+)$/) || [], prevName = _b[1], prevVersion = _b[2];
                            var _c = pkg.match(/^(.+)@(.+)$/) || [], name = _c[1], version = _c[2];
                            if (wave === 1) {
                                formatDependenciesDiff[idx_1[index]] = "".concat(prevName, "@<span style=\"color: green;\">").concat(prevVersion, "</span> -> ").concat(name, "@<span style=\"color: red;\">").concat(version, "</span>");
                            }
                            else if (wave === -1) {
                                formatDependenciesDiff[idx_1[index]] = "".concat(prevName, "@<span style=\"color: red;\">").concat(prevVersion, "</span> -> ").concat(name, "@<span style=\"color: green;\">").concat(version, "</span>");
                            }
                            else {
                                formatDependenciesDiff[idx_1[index]] = "".concat(prevName, "@").concat(prevVersion, " -> ").concat(name, "@").concat(version);
                            }
                            idx_1[index] += 2;
                        });
                    });
                }
                if (!commits.length && !formatDependenciesDiff.length)
                    return [2 /*return*/, ''];
                _a = this.repo || {}, host = _a.host, repository = _a.repository;
                groupCommits = groupBy(commits, 'type');
                repoUrl = "https://".concat(host, "/").concat(repository);
                commitGroups = sortByOrder(Object.keys(groupCommits), [
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
                    .reduce(function (acc, type) {
                    var commits = groupCommits[type];
                    var rcommits = commits.map(function (commit) {
                        var type = commit.type, sha = commit.sha, hash = commit.hash, authorName = commit.authorName, description = commit.description, scope = commit.scope;
                        var commitLink = "".concat(repoUrl, "/-/commit/").concat(hash);
                        return {
                            type: type,
                            sha: sha,
                            authorName: authorName,
                            description: description,
                            hash: hash,
                            scope: scope,
                            commitLink: commitLink,
                        };
                    }, []);
                    acc.push({
                        type: type,
                        list: rcommits,
                        title: CommitTypeLabel[type],
                    });
                    return acc;
                }, []);
                standardTemplate = fs.readFileSync(path.resolve(__dirname + '/standard.hbs'), 'utf8');
                template = Handlebars.compile(standardTemplate);
                changelog = template({
                    version: this.to,
                    compareLink: "https://".concat(host, "/").concat(repository, "/-/compare/v").concat(this.from, "...v").concat(this.to),
                    commits: commitGroups,
                    dependenciesDiff: formatDependenciesDiff,
                });
                return [2 /*return*/, changelog];
            });
        });
    };
    /**
     * 生成并推送 tag
     */
    Changelog.prototype.generateTag = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tagName;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tagName = "v".concat(this.to);
                        return [4 /*yield*/, generateTag("v".concat(this.to))];
                    case 1:
                        _a.sent();
                        console.log("\u6807\u7B7E ".concat(tagName, " \u5DF2\u751F\u6210"));
                        this.rollingBackQueue.push(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, deleteTag(tagName)];
                                    case 1:
                                        _a.sent();
                                        console.log('本地 tag 已回滚');
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, pushTag(tagName)];
                    case 2:
                        _a.sent();
                        console.log("\u6807\u7B7E ".concat(tagName, " \u5DF2\u63A8\u9001"));
                        this.rollingBackQueue.push(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, deleteRemoteTag(tagName)];
                                    case 1:
                                        _a.sent();
                                        console.log('远端 tag 已回滚');
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 发布更新
     */
    Changelog.prototype.release = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dependenciesDiff, from, commits, changelogStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('开始执行...');
                        return [4 /*yield*/, this.dependenciesAnalyze()];
                    case 1:
                        dependenciesDiff = _a.sent();
                        from = "v".concat(this.from);
                        return [4 /*yield*/, this.listCommits(from)];
                    case 2:
                        commits = _a.sent();
                        this.generateNextVersion(commits);
                        return [4 /*yield*/, this.generateChangelog(commits, dependenciesDiff)];
                    case 3:
                        changelogStr = _a.sent();
                        if (!changelogStr) {
                            console.log('暂无变更, 终止更新');
                            return [2 /*return*/];
                        }
                        this.renderMarkdown(changelogStr);
                        return [4 /*yield*/, this.updateVersion()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 提交变更
     */
    Changelog.prototype.releaseCommit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, add(['CHANGELOG.md', 'package.json'])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, commit("Release v".concat(this.to))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 回滚
     */
    Changelog.prototype.rollingBack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, fn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('开始回滚');
                        _i = 0, _a = this.rollingBackQueue;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        fn = _a[_i];
                        return [4 /*yield*/, fn()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log('回滚结束');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 更新 package 版本
     */
    Changelog.prototype.updateVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newPkgJson;
            return __generator(this, function (_a) {
                newPkgJson = __assign({}, pkgJson);
                newPkgJson.version = this.to;
                fs.writeFileSync(pkgPath, JSON.stringify(newPkgJson, null, 2) + '\n', 'utf8');
                this.rollingBackQueue.push(function () {
                    fs.writeFileSync(pkgPath, pkgStr, 'utf8');
                    console.log('package.json 版本变更已回滚');
                });
                console.log('本地 package.json 版本已更新: ', this.to);
                return [2 /*return*/];
            });
        });
    };
    /**
     * 获取变更 commit 列表
     * @param fromCommitId
     * @returns
     */
    Changelog.prototype.listCommits = function (from) {
        return __awaiter(this, void 0, void 0, function () {
            var matcher, commits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matcher = this.config.matcher;
                        return [4 /*yield*/, execa
                                .sync('git', [
                                'log',
                                '--pretty=--split--flag--shortHash<%h> hash<%H> message<%s> ref<%D> description<%b> authorName<%an> authorEmail<%ae> date<%cd>',
                                '--date=short',
                                "".concat(from, ".."),
                            ])
                                .stdout.split('--split--flag--')
                                .filter(Boolean)
                                .map(parseLogMessage)
                                .filter(Boolean)];
                    case 1:
                        commits = (_a.sent())
                            .map(function (rawCommitInfo) {
                            var sha = rawCommitInfo.sha, hash = rawCommitInfo.hash, authorEmail = rawCommitInfo.authorEmail, authorName = rawCommitInfo.authorName;
                            var matcherRes = matcher(rawCommitInfo);
                            if (typeof matcherRes === 'boolean')
                                return false;
                            var _a = matcherRes, type = _a.type, scope = _a.scope, description = _a.description, author = _a.author;
                            return {
                                sha: sha,
                                type: type,
                                scope: scope,
                                description: description,
                                hash: hash,
                                authorEmail: authorEmail,
                                authorName: author || authorName,
                            };
                        })
                            .filter(Boolean);
                        return [2 /*return*/, commits];
                }
            });
        });
    };
    /**
     * 分析依赖变更
     * @returns
     */
    Changelog.prototype.dependenciesAnalyze = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastTag, lastTagCommit, lastPackageJsonContent, packageJsonContent, lastPackageJson, packageJson, lastDevDependencies, devDependencies, lastDependencies, dependencies, devDiff, prodDiff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastTag = "v".concat(this.from);
                        return [4 /*yield*/, getTagCommitId(lastTag)];
                    case 1:
                        lastTagCommit = _a.sent();
                        if (!lastTagCommit)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, getFileContentByCommitId(lastTagCommit, 'package.json')];
                    case 2:
                        lastPackageJsonContent = _a.sent();
                        return [4 /*yield*/, getFileContentByCommitId('head', 'package.json')];
                    case 3:
                        packageJsonContent = _a.sent();
                        lastPackageJson = JSON.parse(lastPackageJsonContent);
                        packageJson = JSON.parse(packageJsonContent);
                        lastDevDependencies = lastPackageJson.devDependencies || {};
                        devDependencies = packageJson.devDependencies || {};
                        lastDependencies = lastPackageJson.dependencies || {};
                        dependencies = packageJson.dependencies || {};
                        devDiff = jsonDiff(lastDevDependencies, devDependencies);
                        prodDiff = jsonDiff(lastDependencies, dependencies);
                        return [2 /*return*/, [devDiff, prodDiff]];
                }
            });
        });
    };
    /**
     * 生成下一个版本号
     * @param releaseType
     */
    Changelog.prototype.generateNextVersion = function (commits) {
        var releaseType = 'patch';
        commits.forEach(function (commit) {
            var type = commit.type;
            if (type === 'feat') {
                releaseType = 'minor';
            }
        });
        this.to = upgrade(this.from, (this.config.type || releaseType));
        if (!this.to) {
            throw new Error('版本号生成失败');
        }
        console.log("\u5373\u5C06\u5347\u7EA7\u7248\u672C\u53F7: ".concat(this.to));
    };
    return Changelog;
}());

var program = new commander.Command();
program.version(pkg.version);
program
    .command('release')
    .argument('[type]', 'upgrade type')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var type, changelog, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    type = (args || [])[0];
                    changelog = new Changelog();
                    return [4 /*yield*/, changelog.init({ type: type })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, changelog.release()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.log(error_1.message);
                    return [4 /*yield*/, changelog.rollingBack()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
program.parse(process.argv);
