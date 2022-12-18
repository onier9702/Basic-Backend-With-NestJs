import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../product/entities/product.entity';
import { ListRoles } from "../interfaces/list-roles";


@Entity('auth')
export class Auth {

    @PrimaryGeneratedColumn()
    uid: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    mobile?: number;

    @Column( { type: 'simple-array' , default: [ListRoles.user]} )
    roles?: string[];

    @Column( { type: 'boolean', default: true } )
    isActive?: boolean;

    @OneToMany(
        () => Product,
        product => product.user,
        { onUpdate: 'CASCADE', onDelete: 'CASCADE'}
    )
    product?: Product[];

    

}

//Query Entity User Auth
// CREATE TABLE `basic_nest_backend`.`auth` (
//     `uid` INT NOT NULL AUTO_INCREMENT,
//     `username` VARCHAR(45) NOT NULL,
//     `password` VARCHAR(255) NOT NULL,
//     `email` VARCHAR(45) NULL,
//     `mobile` VARCHAR(45) NULL,
//     `isActive` TINYINT NOT NULL DEFAULT 1,
//     `roles` VARCHAR(45) NOT NULL DEFAULT 'USER',
//     PRIMARY KEY (`uid`),
//     UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);
