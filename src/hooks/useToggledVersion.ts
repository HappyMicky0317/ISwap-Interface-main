import useParsedQueryString from './useParsedQueryString';

export enum Version {
  v = 'v',
  v1 = 'v1',
}

export const DEFAULT_VERSION: Version = Version.v1;

export default function useToggledVersion(): Version {
  const { use } = useParsedQueryString();
  if (!use || typeof use !== 'string') return Version.v1;
  if (use.toLowerCase() === 'v') return Version.v;
  return DEFAULT_VERSION;
}
