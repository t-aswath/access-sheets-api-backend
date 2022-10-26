export const format_range = (data: [string?, string?, string?]) => {
  return data.length === 1
    ? data[0]
    : data.length === 2
    ? `${data[0]}!${data[1]}`
    : data.length === 3
    ? `${data[0]}!${data[1]}:${data[2]}`
    : "";
};
