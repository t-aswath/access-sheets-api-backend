import { parse } from "./parse";
export const format = (
  data: any[],
  type: "LIST" | "KEY_VALUE" | "KEY_PAIR",
  limit: number
) => {
  const lim = limit != undefined ? limit : data.length;
  console.log(lim);
  switch (type) {
    case "KEY_VALUE":
      const keys = data[0];
      return data.slice(1).map((i) => {
        return parse(i, keys);
      });
    case "LIST":
      return data;
    case "KEY_PAIR":
      const pair = {};
      for (let i = 0; i < data[0].length; i++) {
        pair[data[0][i]] = [];
      }
      for (const i of data.slice(1)) {
        for (const [key, value] of Object.entries(i)) {
          pair[data[0][key]].push(value);
        }
      }
      return pair;
    default:
      return data.values;
  }
};
