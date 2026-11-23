import { interfaceText } from './i18n/interface-text';
import type { Language } from './i18n/types';
import { toProfileLinkAddress } from './portfolio-content/profile-links';
import type { PortfolioContent } from './portfolio-content/schema';

export const createHomePage = (language: Language, { homePage, latinScriptName, profileLinks }: PortfolioContent, englishRole: string) => {
  const nameLines = homePage.displayName.split(/\s+/u);
  const isEnglish = language === 'en';
  return {
    nameLines,
    nameColumns: Math.max(...nameLines.map((line) => [...line].length)),
    role: homePage.role,
    englishRole: isEnglish ? undefined : englishRole,
    latinScriptName: isEnglish ? undefined : latinScriptName,
    introduction: homePage.introduction,
    profileLinks: profileLinks.map(({ id, name, url }) => ({
      id,
      url,
      accessibleName: interfaceText[language].profileLinkLabel({ profileLink: name }),
      printedAddress: toProfileLinkAddress(url),
    })),
  };
};
