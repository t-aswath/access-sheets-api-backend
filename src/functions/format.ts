import { parse } from "./parse";
export const format = (
  data: any[],
  type: "LIST" | "KEY_VALUE" | "KEY_PAIR",
  limit: number
) => {
  const lim = limit != undefined ? limit : data.length;
  switch (type) {
    case "KEY_VALUE":
      const keys = data[0];
      return data
        .slice(1)
        .map((i) => {
          const sd = {};
          keys.map((value, index) => {
            sd[value] = parse(i[index]);
          });
          return sd;
        })
        .slice(0, lim);

    case "LIST":
      return data
        .splice(0, lim)
        .map((value) => value.map((parse_value) => parse(parse_value)));
    case "KEY_PAIR":
      const pair = {};
      for (let i = 0; i < data[0].length; i++) {
        pair[data[0][i]] = [];
      }
      for (const i of data.slice(1).slice(0, lim)) {
        for (const [key, value] of Object.entries(i)) {
          pair[data[0][key]].push(parse(value));
        }
      }
      return pair;
    default:
      return data
        .splice(0, lim)
        .map((value) => value.map((parse_value) => parse(parse_value)));
  }
};
