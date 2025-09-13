import { Module } from "@nestjs/common";

import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { R2Module } from "../../config/infra/r2/r2.module";

@Module({
  imports: [R2Module],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
