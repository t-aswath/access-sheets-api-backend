"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parse = (i, keys) => {
    const sd = {};
    keys.data.map((value, index) => {
        sd[value] = !isNaN(i[index]) ? parseInt(i[index]) : i[index];
    });
    return sd;
};
exports.parse = parse;
//# sourceMappingURL=parse.js.map