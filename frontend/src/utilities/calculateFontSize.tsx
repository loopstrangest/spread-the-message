export const calculateFontSize = (words: string[]): string => {
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");
  const maxFontSize = 64;
  const baseSize = 300;
  const calculatedSize = Math.min(
    maxFontSize,
    (baseSize / longestWord.length) * 1.75
  );
  return `${calculatedSize}px`;
};
