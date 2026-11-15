import dormantFieldSource from '../../components/DormantField.astro?raw';

const fieldCharacters = [...dormantFieldSource.replace(/\s+/g, '')];

export const fieldCharacterAt = (index: number) => fieldCharacters[index % fieldCharacters.length];
