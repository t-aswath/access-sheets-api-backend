"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format_range = void 0;
const format_range = (data) => {
    return data.length === 1
        ? data[0]
        : data.length === 2
            ? `${data[0]}!${data[1]}`
            : data.length === 3
                ? `${data[0]}!${data[1]}:${data[2]}`
                : "";
};
exports.format_range = format_range;
//# sourceMappingURL=format-range.js.map