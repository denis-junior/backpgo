import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ length: 100 })
  @IsNotEmpty()
  name: string = "";

  @Column({ unique: true, length: 100 })
  @IsEmail()
  email: string = "";

  @Column()
  @MinLength(6)
  password: string = "";

  @CreateDateColumn()
  created_at: Date = new Date();

  @UpdateDateColumn()
  updated_at: Date = new Date();
}