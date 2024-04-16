import semver from 'semver';

export const RELEASE_TYPES = ['patch', 'minor', 'major'];
export const PRERELEASE_TYPES = ['prepatch', 'preminor', 'premajor'];
export const CONTINUATION_TYPES = ['prerelease', 'pre'];
export const ALL_RELEASE_TYPES = [...RELEASE_TYPES, ...PRERELEASE_TYPES, ...CONTINUATION_TYPES];

export function upgrade(version: string, releaseTypes: ReleaseType) {
  return semver.inc(version, releaseTypes) || '';
}
