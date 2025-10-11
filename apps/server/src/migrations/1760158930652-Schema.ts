import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1760158930652 implements MigrationInterface {
  name = "Schema1760158930652";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visitors" ADD "ip" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "visitors" DROP COLUMN "ip"`);
  }
}
