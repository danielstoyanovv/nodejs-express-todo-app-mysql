import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import {
    Length,
    IsEmail
} from "class-validator"

@Entity({ name: 'items' })
export class Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', nullable: false, unique: true })
    @IsEmail()
    email: string

    @Column({ type: 'varchar', nullable: false })
    @Length(10, 20)
    phone: string

    @Column({ type: 'varchar', nullable: false })
    @Length(5, 30)
    task: string
}