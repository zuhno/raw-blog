import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ContentView } from "./entities/content-view.entity";

@Injectable()
export class ContentViewsService {
  constructor(
    @InjectRepository(ContentView)
    private readonly repo: Repository<ContentView>
  ) {}

  getViewStats(contentId: number) {
    return this.repo.count({ where: { content: { id: contentId } } });
  }

  async logContentView(contentId: number, visitorId: string) {
    try {
      const newView = this.repo.create({
        visitorId,
        content: { id: contentId },
      });
      await this.repo.save(newView);
    } catch (error) {
      if (
        error.code !== "ER_DUP_ENTRY" &&
        error.driverError?.code !== "23505"
      ) {
        console.error("Failed to log content view:", error);
      }
    }
  }
}
