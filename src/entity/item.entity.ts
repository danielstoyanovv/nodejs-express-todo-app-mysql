import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'items' })
export class Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    email: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    phone: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    task: string
}