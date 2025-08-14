import { Global, Module } from "@nestjs/common";

import { parseAllowedOriginsFromEnv } from "../../shared/utils/env";
import { ALLOWED_ORIGINS } from "../tokens";

@Global()
@Module({
  providers: [
    {
      provide: ALLOWED_ORIGINS,
      useFactory: () => parseAllowedOriginsFromEnv(process.env.ALLOW_ACCESS_ORIGIN),
    },
  ],
  exports: [ALLOWED_ORIGINS],
})
export class SecurityConfigModule {}
