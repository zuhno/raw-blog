import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1759209696490 implements MigrationInterface {
  name = "CreateInitialSchema1759209696490";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "visitors" ("id" SERIAL NOT NULL, "visitor_id" character varying(36) NOT NULL, "visited_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "visit_date_kst" date NOT NULL, CONSTRAINT "PK_d0fd6e34a516c2bb3bbec71abde" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2d4f904d8da7c95474482c07a4" ON "visitors" ("visitor_id", "visit_date_kst") `
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "nickname" character varying NOT NULL, "avatar_url" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."content_type_enum" AS ENUM('POST', 'DAILY')`
    );
    await queryRunner.query(
      `CREATE TABLE "content" ("id" SERIAL NOT NULL, "author_id" integer NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "publish" boolean NOT NULL DEFAULT false, "private" boolean NOT NULL DEFAULT false, "type" "public"."content_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6a9775008add570dc3e5a0bab7" ON "tag" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "content_views" ("id" SERIAL NOT NULL, "visitor_id" character varying(36) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content_id" integer NOT NULL, CONSTRAINT "PK_8851f5e5b22acfe5994dcac9e91" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c47d3054ecb6845cabbc9a98b9" ON "content_views" ("content_id", "visitor_id") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."auth_platform_enum" AS ENUM('GOOGLE', 'SLACK', 'META', 'KAKAO')`
    );
    await queryRunner.query(
      `CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_agent" character varying NOT NULL, "used" boolean NOT NULL DEFAULT false, "logout" boolean NOT NULL DEFAULT false, "invalid" boolean NOT NULL DEFAULT false, "platform" "public"."auth_platform_enum" NOT NULL, "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "author_id" integer NOT NULL, "content_id" integer NOT NULL, "parent_id" integer, "text" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "content_tag" ("content_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_53961e337c312fa582bc74f85fa" PRIMARY KEY ("content_id", "tag_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90e602b7868fe4819371f1457a" ON "content_tag" ("content_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a297a0378623147d6caf5e84d" ON "content_tag" ("tag_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "content" ADD CONSTRAINT "FK_d5f8701e03b877f3df88d0af635" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "content_views" ADD CONSTRAINT "FK_20f3b9eb1d8abade45cdde80aff" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD CONSTRAINT "FK_9922406dc7d70e20423aeffadf3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_226527748fefcb014a6d7c3121f" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_8bd8d0985c0d077c8129fb4a209" FOREIGN KEY ("parent_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "content_tag" ADD CONSTRAINT "FK_90e602b7868fe4819371f1457af" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "content_tag" ADD CONSTRAINT "FK_7a297a0378623147d6caf5e84d0" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_tag" DROP CONSTRAINT "FK_7a297a0378623147d6caf5e84d0"`
    );
    await queryRunner.query(
      `ALTER TABLE "content_tag" DROP CONSTRAINT "FK_90e602b7868fe4819371f1457af"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_8bd8d0985c0d077c8129fb4a209"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_226527748fefcb014a6d7c3121f"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"`
    );
    await queryRunner.query(
      `ALTER TABLE "auth" DROP CONSTRAINT "FK_9922406dc7d70e20423aeffadf3"`
    );
    await queryRunner.query(
      `ALTER TABLE "content_views" DROP CONSTRAINT "FK_20f3b9eb1d8abade45cdde80aff"`
    );
    await queryRunner.query(
      `ALTER TABLE "content" DROP CONSTRAINT "FK_d5f8701e03b877f3df88d0af635"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a297a0378623147d6caf5e84d"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_90e602b7868fe4819371f1457a"`
    );
    await queryRunner.query(`DROP TABLE "content_tag"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`DROP TYPE "public"."auth_platform_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c47d3054ecb6845cabbc9a98b9"`
    );
    await queryRunner.query(`DROP TABLE "content_views"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a9775008add570dc3e5a0bab7"`
    );
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "content"`);
    await queryRunner.query(`DROP TYPE "public"."content_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d4f904d8da7c95474482c07a4"`
    );
    await queryRunner.query(`DROP TABLE "visitors"`);
  }
}
