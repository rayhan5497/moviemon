import adultWords from '@data/adultWords.json';

const adultRegex = new RegExp(
  `\\b(${adultWords.adultKeywords.join('|')})(y|e|s|es|ed|ing|tive)?\\b` +
    `|\\b(${adultWords.descriptors.join(
      '|'
    )})\\s+(${adultWords.keywordRequireDescriptors.join(
      '|'
    )})(y|e|s|es|ed|ing|tive)?\\b`,
  'gi'
);

export default function provideRegex() {
  return adultRegex;
}
