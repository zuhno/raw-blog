import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContentViewsService } from "./content-views.service";
import { ContentView } from "./entities/content-view.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContentView])],
  providers: [ContentViewsService],
  exports: [ContentViewsService],
})
export class ContentViewsModule {}
