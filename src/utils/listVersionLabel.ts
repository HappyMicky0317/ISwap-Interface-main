import { Version } from '@loveswap7/token-lists';

export default function listVersionLabel(version: Version): string {
  return `v${version.major}.${version.minor}.${version.patch}`;
}
