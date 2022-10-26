"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetController = void 0;
const common_1 = require("@nestjs/common");
const format_1 = require("../functions/format");
const format_range_1 = require("../functions/format-range");
const sheet_service_1 = require("./sheet.service");
let SheetController = class SheetController {
    constructor(sheetService) {
        this.sheetService = sheetService;
    }
    async getSheet(query, body) {
        const { range } = query.data;
        if (query.data.range === undefined || !range.length) {
            throw new common_1.BadRequestException("MISSING RANGE");
        }
        try {
            const { data } = await body.sheet.spreadsheets.values.get({
                spreadsheetId: query.id,
                range: (0, format_range_1.format_range)(range),
            });
            return (0, format_1.format)(data.values, query.type, query.limit);
        }
        catch (e) {
            if (e.code === 400) {
                throw new common_1.BadRequestException("ENTER IN THE FOLLOWING FORMAT -> ['{sheetName}' , '{cellFrom}' , '{cellTo}'] (or) ENTER VALID ( RANGE / SHEET NAME )");
            }
            throw new common_1.NotFoundException("SPREADSHEET / SHEET NOT FOUND");
        }
    }
    async postData(body, query) {
        const sheets = body.sheet;
        const input = typeof body.data === "string" ? JSON.parse(body.data) : body.data;
        if (!query && !query.id) {
            throw new common_1.NotImplementedException("SHEET ID NOT MENTIONED");
        }
        try {
            const { data } = await sheets.spreadsheets.values.get({
                spreadsheetId: query.id,
                range: "Sheet1",
            });
            if (data.values[0].length === 0) {
                throw new common_1.ConflictException("ADD COLUMS TO UPDATE DATA");
            }
            const inputData = [];
            let isColumn = false;
            for (let i = 0; i < input.length; i++) {
                inputData.push([]);
                for (let j = 0; j < data.values[0].length; j++) {
                    let append = false;
                    for (const [key, value] of Object.entries(input[i])) {
                        if (key === data.values[0][j]) {
                            inputData[i].push(value);
                            append = true;
                            isColumn = true;
                            break;
                        }
                    }
                    if (!append) {
                        inputData[i].push("");
                    }
                }
            }
            if (!isColumn) {
                throw new common_1.ConflictException("ENTER THE CORRECT COLUM NAMES TO UPDATE DATA");
            }
            try {
                const { data } = await sheets.spreadsheets.values.append({
                    spreadsheetId: query.id,
                    range: "Sheet1",
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        values: inputData,
                    },
                    includeValuesInResponse: true,
                });
                return data.updates;
            }
            catch (e) {
                throw new common_1.NotFoundException("SPREADSHEET / SHEET NOT FOUND");
            }
        }
        catch (e) {
            throw new common_1.NotFoundException("SPREADSHEET / SHEET NOT FOUND");
        }
    }
    async updateCell(body, query) {
        const sheets = body.sheet;
        const data = typeof body.data === "string" ? JSON.parse(body.data) : body.data;
        try {
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId: query.id,
                range: "Sheet1",
            });
            if (res.data.values[0].length === 0) {
                throw new common_1.ConflictException("ADD COLUMS TO UPDATE DATA");
            }
            const inputData = [];
            let isColumn = false;
            for (let i = 0; i < data.values.length; i++) {
                inputData.push([]);
                for (let j = 0; j < res.data.values[0].length; j++) {
                    let append = false;
                    for (const [key, value] of Object.entries(data.values[i])) {
                        if (key === res.data.values[0][j]) {
                            inputData[i].push(value);
                            append = true;
                            isColumn = true;
                            break;
                        }
                    }
                    if (!append) {
                        inputData[i].push("");
                    }
                }
            }
            if (!isColumn) {
                throw new common_1.ConflictException("ENTER THE CORRECT COLUM NAMES TO UPDATE DATA");
            }
            try {
                const res = await sheets.spreadsheets.values.update({
                    spreadsheetId: query.id,
                    includeValuesInResponse: true,
                    range: `${data.range[0]}!${data.range[1]}:${data.range[2]}`,
                    valueInputOption: "RAW",
                    requestBody: {
                        values: inputData,
                    },
                });
                return res.data.updatedData;
            }
            catch (e) {
                if (e.response.data.error.code === 400) {
                    throw new common_1.BadRequestException("ENTER IN THE FOLLOWING FORMAT -> ['{sheetName}' , '{cellFrom}' , '{cellTo}'] (or) ENTER VALID ( RANGE / SHEET NAME )");
                }
                throw new common_1.NotFoundException("SPREADSHEET / SHEET NOT FOUND");
            }
        }
        catch (e) {
            throw new common_1.NotFoundException("SPREADSHEET / SHEET NOT FOUND");
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "getSheet", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "postData", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "updateCell", null);
SheetController = __decorate([
    (0, common_1.Controller)("sheet"),
    __metadata("design:paramtypes", [sheet_service_1.SheetService])
], SheetController);
exports.SheetController = SheetController;
//# sourceMappingURL=sheet.controller.js.map