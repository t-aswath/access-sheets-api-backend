"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const parse_1 = require("./parse");
const format = (data, type, limit) => {
    const lim = limit != undefined ? limit : data.length;
    console.log(lim);
    switch (type) {
        case "KEY_VALUE":
            const keys = data[0];
            return data.slice(1).map((i) => {
                return (0, parse_1.parse)(i, keys);
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
exports.format = format;
//# sourceMappingURL=format.js.map