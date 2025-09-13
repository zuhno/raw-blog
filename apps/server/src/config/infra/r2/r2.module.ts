import { Module } from "@nestjs/common";

import { R2_CLIENT, r2ClientFactory } from "./r2.client";

@Module({
  providers: [{ provide: R2_CLIENT, useFactory: r2ClientFactory }],
  exports: [R2_CLIENT],
})
export class R2Module {}
