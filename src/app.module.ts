import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductsModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
