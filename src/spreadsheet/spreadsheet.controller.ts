import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from "@nestjs/common";
import { sheets_v4 } from "googleapis";
import { SpreadsheetService } from "./spreadsheet.service";

@Controller("spreadsheet")
export class SpreadsheetController {
  constructor(private readonly spreadsheetService: SpreadsheetService) {}

  @Get()
  async getSpreadSheet(
    @Body() body: { sheet: sheets_v4.Sheets },
    @Query() query: { id: string; sheets: "true" | "false" }
  ) {
    try {
      const { data } = await body.sheet.spreadsheets.get({
        spreadsheetId: query.id,
      });
      if (query.sheets != undefined && query.sheets === "true") {
        return { sheets: data };
      }
      const { sheets, ...rest } = data;
      return { sheets: rest };
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }
  @Get("/sheets")
  async getSheetsName(
    @Body() body: { sheet: sheets_v4.Sheets },
    @Query() query: { id: string; prop: "true" | "false" }
  ) {
    try {
      const { data } = await body.sheet.spreadsheets.get({
        spreadsheetId: query.id,
      });
      if (query.prop != undefined && query.prop === "true") {
        return { sheets: data.sheets };
      }
      return { sheets: data.sheets.map((i) => i.properties.title) };
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }

  @Post()
  async createSheet(
    @Body()
    body: {
      sheet: sheets_v4.Sheets;
      data: { name: string; color: [number, number, number] };
    },
    @Query() query: { id: string }
  ) {
    try {
      console.log(body.data.color);
      const { data } = await body.sheet.spreadsheets.batchUpdate({
        spreadsheetId: query.id,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: body.data.name,
                  tabColor: {
                    red:
                      body.data.color != undefined ? body.data.color[0] : 0.95,
                    green:
                      body.data.color != undefined ? body.data.color[1] : 0.95,
                    blue:
                      body.data.color != undefined ? body.data.color[2] : 0.95,
                  },
                },
              },
            },
          ],
        },
      });
      return data;
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }
}
