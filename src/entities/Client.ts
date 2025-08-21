import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { IsNotEmpty, IsEmail, Length } from "class-validator";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn()
  id_cliente: number = 0;

  @Column({ type: "integer", nullable: true })
  id_vendedor: number = 0;

  @Column({ nullable: true })
  cpf_cnpj: string = "";

  @Column({ nullable: true })
  @IsNotEmpty()
  razao_social: string = "";

  @Column({ nullable: true })
  nome_fantasia: string = "";

  @Column({ nullable: true })
  url_base: string = "";

  @Column({ nullable: true })
  usuario_base: string = "";

  @Column({ nullable: true })
  password_base: string = "";

  @Column({ nullable: true })
  data_base: string = "";

  @Column({ nullable: true })
  cep: string = "";

  @Column({ nullable: true })
  logradouro: string = "";

  @Column({ nullable: true })
  numero: string = "";

  @Column({ nullable: true })
  complemento: string = "";

  @Column({ nullable: true })
  bairro: string = "";

  @Column({ nullable: true })
  municipio: string = "";

  @Column({ length: 2, nullable: true })
  uf: string = "";

  @Column({ nullable: true })
  celular: string = "";

  @Column({ nullable: true })
  comercial: string = "";

  @Column({ nullable: true })
  residencial: string = "";

  @Column({ nullable: true })
  email: string = "";

  @Column({ nullable: true })
  anotacoes: string = "";

  @Column({ type: "numeric", precision: 10, scale: 2, nullable: true })
  valorproposto: number = 0;

  @Column({ nullable: true })
  qtde_usuarios: number = 0;

  @Column({ type: "boolean", nullable: true, default: false })
  is_signed: boolean = false;

  @Column({
    length: 32,
    nullable: true,
    default: "NOVO",
  })
  status:
    | "UPSELL"
    | "NOVO"
    | "CONVERTIDO"
    | "EM NEGOCIACAO"
    | "CANCELADO"
    | "DESTRATADO" = "NOVO";

  @Column({
    length: 16,
    nullable: true,
    default: "LEAD",
  })
  categoria: "CONTRATO" | "UPGRADE" | "LEAD" = "LEAD";

  @CreateDateColumn()
  created_at: Date = new Date();

  @UpdateDateColumn({ nullable: true })
  updated_at: Date = new Date();

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null = null;
}
