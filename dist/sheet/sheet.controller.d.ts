import { sheets_v4 } from "googleapis";
import { SheetService } from "./sheet.service";
export declare class SheetController {
    private readonly sheetService;
    constructor(sheetService: SheetService);
    getSheet(query: {
        id: string;
        type: "LIST" | "KEY_VALUE";
        limit: number;
        data: {
            range: [string?, string?, string?];
        };
    }, body: {
        sheet: sheets_v4.Sheets;
    }): Promise<{}>;
    postData(body: {
        sheet: sheets_v4.Sheets;
        data: any[];
    }, query: {
        id: string;
    }): Promise<sheets_v4.Schema$UpdateValuesResponse>;
    updateCell(body: {
        sheet: sheets_v4.Sheets;
        data: {
            range: [string, string, string];
            values: (string | number)[][];
        };
    }, query: {
        id: string;
    }): Promise<sheets_v4.Schema$ValueRange>;
}
