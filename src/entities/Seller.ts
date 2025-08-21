import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@Entity("sellers")
export class Seller {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ length: 100 })
  @IsNotEmpty()
  name: string = "";

  @CreateDateColumn()
  created_at: Date = new Date();

  @UpdateDateColumn()
  updated_at: Date = new Date();

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null = null;
}
