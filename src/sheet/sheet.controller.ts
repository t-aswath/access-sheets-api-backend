import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  Put,
  BadRequestException,
  NotFoundException,
  ConflictException,
  NotImplementedException,
} from "@nestjs/common";
import { sheets_v4 } from "googleapis";
import { format } from "../functions/format";
import { format_range } from "../functions/format-range";
import { SheetService } from "./sheet.service";

@Controller("sheet")
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @Get()
  async getSheet(
    @Query()
    query: {
      id: string;
      type: "LIST" | "KEY_VALUE";
      limit: number;
      data: { range: [string?, string?, string?] };
    },
    @Body()
    body: {
      sheet: sheets_v4.Sheets;
    }
  ) {
    const { range } = query.data;
    if (query.data.range === undefined || !range.length) {
      throw new BadRequestException("MISSING RANGE");
    }
    try {
      const { data } = await body.sheet.spreadsheets.values.get({
        spreadsheetId: query.id,
        range: format_range(range),
      });
      return format(data.values, query.type, query.limit);
    } catch (e) {
      if (e.code === 400) {
        throw new BadRequestException(
          "ENTER IN THE FOLLOWING FORMAT -> ['{sheetName}' , '{cellFrom}' , '{cellTo}'] (or) ENTER VALID ( RANGE / SHEET NAME )"
        );
      }
      throw new NotFoundException("SPREADSHEET / SHEET NOT FOUND");
    }
  }

  @Post()
  async postData(
    @Body() body: { sheet: sheets_v4.Sheets; data: any[] },
    @Query() query: { id: string }
  ) {
    const sheets = body.sheet;
    const input =
      typeof body.data === "string" ? JSON.parse(body.data) : body.data;

    if (!query && !query.id) {
      throw new NotImplementedException("SHEET ID NOT MENTIONED");
    }
    try {
      const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: query.id,
        range: "Sheet1",
      });
      if (data.values[0].length === 0) {
        throw new ConflictException("ADD COLUMS TO UPDATE DATA");
      }
      const inputData: any[][] = [];
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
        throw new ConflictException(
          "ENTER THE CORRECT COLUM NAMES TO UPDATE DATA"
        );
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
      } catch (e) {
        throw new NotFoundException("SPREADSHEET / SHEET NOT FOUND");
      }
    } catch (e) {
      throw new NotFoundException("SPREADSHEET / SHEET NOT FOUND");
    }
  }

  @Put()
  async updateCell(
    @Body()
    body: {
      sheet: sheets_v4.Sheets;
      data: {
        range: [string, string, string];
        values: (string | number)[][];
      };
    },
    @Query() query: { id: string }
  ) {
    const sheets = body.sheet;
    const data =
      typeof body.data === "string" ? JSON.parse(body.data) : body.data;
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: query.id,
        range: "Sheet1",
      });
      if (res.data.values[0].length === 0) {
        throw new ConflictException("ADD COLUMS TO UPDATE DATA");
      }
      const inputData: any[][] = [];
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
        throw new ConflictException(
          "ENTER THE CORRECT COLUM NAMES TO UPDATE DATA"
        );
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
      } catch (e) {
        if (e.response.data.error.code === 400) {
          throw new BadRequestException(
            "ENTER IN THE FOLLOWING FORMAT -> ['{sheetName}' , '{cellFrom}' , '{cellTo}'] (or) ENTER VALID ( RANGE / SHEET NAME )"
          );
        }
        throw new NotFoundException("SPREADSHEET / SHEET NOT FOUND");
      }
    } catch (e) {
      throw new NotFoundException("SPREADSHEET / SHEET NOT FOUND");
    }
  }
}
