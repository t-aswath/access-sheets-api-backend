import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { sheetData } from "./sheet.middleware";
import { SheetController } from "./sheet/sheet.controller";
import { SheetModule } from "./sheet/sheet.module";
import { SpreadsheetController } from "./spreadsheet/spreadsheet.controller";
import { SpreadsheetModule } from "./spreadsheet/spreadsheet.module";

@Module({
  imports: [SheetModule, SpreadsheetModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  public async configure(consumer: MiddlewareConsumer) {
    consumer.apply(sheetData).forRoutes(SheetController, SpreadsheetController);
  }
}
