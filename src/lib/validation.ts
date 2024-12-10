export const validateGratitudeEntry = (text: string): boolean => {
  // Entry should start with a number and end with some form of thanks
  const hasNumber = /^\d+\./.test(text);
  const hasThankYou = /ありがとう[！!]*$/.test(text);
  return hasNumber && hasThankYou;
};

export const formatEntry = (text: string, index: number): string => {
  // Remove existing numbers and add new index
  const withoutNumber = text.replace(/^\d+\.?\s*/, "");
  return `${index}. ${withoutNumber}`;
};