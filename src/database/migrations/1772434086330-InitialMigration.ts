import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1772434086330 implements MigrationInterface {
    name = 'InitialMigration1772434086330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('high', 'normal', 'low')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" character varying NOT NULL, "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'normal', "payload" jsonb, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'PENDING', "idempotency_key" character varying NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "last_error" text, "scheduled_at" TIMESTAMP, "started_at" TIMESTAMP, "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_06021e86f55c95aa79fc4fc6b6e" UNIQUE ("idempotency_key"), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_TASK_IDEMPOTENCY_KEY" ON "tasks" ("idempotency_key") `);
        await queryRunner.query(`CREATE INDEX "IDX_TASK_SCHEDULED_AT" ON "tasks" ("scheduled_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_TASK_TYPE" ON "tasks" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_TASK_STATUS" ON "tasks" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_TASK_USER_ID" ON "tasks" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_TASK_USER_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_TASK_STATUS"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_TASK_TYPE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_TASK_SCHEDULED_AT"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_TASK_IDEMPOTENCY_KEY"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
