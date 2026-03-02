import { RoleEnum } from "src/constants/enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";



@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password_hash: string;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}