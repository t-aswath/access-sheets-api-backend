import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  home(): string {
    return "For more info visit -> www.access.io/g-sheets";
  }
}
