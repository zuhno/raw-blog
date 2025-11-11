import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthCheckController {
  constructor() {}

  @Get()
  check() {
    return { status: "ok" };
  }
}
