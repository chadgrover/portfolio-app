export const toProfileLinkAddress = (url: string) => {
  const { host, pathname, search, hash } = new URL(url);
  const path = search || hash ? pathname : pathname.replace(/\/$/u, '');
  return `${host.replace(/^www\./u, '')}${path}${search}${hash}`;
};
