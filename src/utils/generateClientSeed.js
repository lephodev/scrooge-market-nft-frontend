export const getClientSeed = () => {
  const rand = () => Math.random(0).toString(36).substr(2);
  const token = (length) =>
    (rand() + rand() + rand() + rand()).substr(0, length);
  return token(32);
};

export const getNext7Days = (date) => {
  try {
    let lastDate = new Date(date);
    lastDate.setDate(date.getDate() + 6);
    if (lastDate >= new Date()) {
      console.log(
        ` if The created date ${date.toISOString()} is less than or equal to the last date ${lastDate.toISOString()}.`
      );
      return true;
    } else {
      console.log(
        `else The created date ${date.toISOString()} is greater than the last date ${lastDate.toISOString()}.`
      );
      return false;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const numFormatter = (num) => {
  if (num > 1 && num < 999) {
    return (num / 1).toFixed(2); // convert to K for number from > 1000 < 1 million
  }
  if (num > 999 && num < 1000000) {
    return `${(num / 1000).toFixed(2)}K`; // convert to K for number from > 1000 < 1 million
  }
  if (num >= 1000000 && num < 1000000000) {
    return `${(num / 1000000).toFixed(2)}M`; // convert to M for number from > 1 million
  }
  if (num >= 100000000 && num < 1000000000000) {
    return `${(num / 100000000).toFixed(2)}B`;
  }
  if (num >= 1000000000000) return `${(num / 1000000000000).toFixed(2)}T`;
  return num; // if value < 1000, nothing to do
};

export default numFormatter;
