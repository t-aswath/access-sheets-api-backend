export const parse = (i, keys) => {
  const sd = {};
  keys.data.map((value, index) => {
    sd[value] = !isNaN(i[index]) ? parseInt(i[index]) : i[index];
  });
  return sd;
};
