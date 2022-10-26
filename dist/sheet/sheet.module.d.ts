import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class SheetModule implements NestModule {
    configure(consumer: MiddlewareConsumer): Promise<void>;
}
