import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdenItem } from './entities/orden-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OrdenItem])],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule]
})
export class OrdenItemsModule {}
