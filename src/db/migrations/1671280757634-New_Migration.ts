import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1671280757634 implements MigrationInterface {
    name = 'NewMigration1671280757634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product-images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`productId\` int NULL, UNIQUE INDEX \`IDX_8c8e254ce9e8b038feacbd785e\` (\`url\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` float NOT NULL DEFAULT '1', \`description\` varchar(255) NULL, \`stock\` decimal NOT NULL DEFAULT '1', \`sizes\` text NOT NULL, \`gender\` varchar(255) NOT NULL, \`tags\` text NOT NULL, \`userUid\` int NULL, UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`auth\` (\`uid\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`mobile\` int NULL, \`roles\` text NOT NULL DEFAULT USER, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_366ebf23d8f3781bb7bb37abbd\` (\`username\`), PRIMARY KEY (\`uid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product-images\` ADD CONSTRAINT \`FK_e1706dd0f5669c2054d9442cace\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_cac4047ef65021da1dafd748501\` FOREIGN KEY (\`userUid\`) REFERENCES \`auth\`(\`uid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_cac4047ef65021da1dafd748501\``);
        await queryRunner.query(`ALTER TABLE \`product-images\` DROP FOREIGN KEY \`FK_e1706dd0f5669c2054d9442cace\``);
        await queryRunner.query(`DROP INDEX \`IDX_366ebf23d8f3781bb7bb37abbd\` ON \`auth\``);
        await queryRunner.query(`DROP TABLE \`auth\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_8c8e254ce9e8b038feacbd785e\` ON \`product-images\``);
        await queryRunner.query(`DROP TABLE \`product-images\``);
    }

}
