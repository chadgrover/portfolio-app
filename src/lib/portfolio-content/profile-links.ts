export const profileLinksPath = './src/content/portfolio/profile-links.json';

export const parseProfileLinks = (text: string) => {
  const entries: { id: string }[] = JSON.parse(text);
  entries.forEach(({ id }, index) => {
    if (entries.findIndex((entry) => entry.id === id) < index) {
      throw new Error(`Profile link "${id}" appears twice in ${profileLinksPath}`);
    }
  });
  return entries;
};
