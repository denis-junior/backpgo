import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity("functions")
export class Function {
  @PrimaryGeneratedColumn()
  id_function: number = 0;

  @Column()
  @IsNotEmpty()
  query: string = "";

  @Column({ nullable: true })
  descricao: string = "";

  @Column({ type: "boolean", nullable: true, default: true })
  is_active: boolean = true;

  @CreateDateColumn()
  created_at: Date = new Date();

  @UpdateDateColumn({ nullable: true })
  updated_at: Date = new Date();

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null = null;
}
