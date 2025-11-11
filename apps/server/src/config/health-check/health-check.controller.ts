import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthCheckController {
  constructor() {}
  @Get()
  check() {
    return { status: "ok" };
  }
}
