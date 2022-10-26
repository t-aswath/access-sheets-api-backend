export const parse = (value) => {
  return !isNaN(value) ? parseInt(value) : value;
};
