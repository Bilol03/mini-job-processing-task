import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { TaskPriority, TaskStatus } from "src/constants/enums";



@Entity("tasks")
@Index("IDX_TASK_USER_ID", ["user_id"])
@Index("IDX_TASK_STATUS", ["status"])
@Index("IDX_TASK_TYPE", ["type"])
@Index("IDX_TASK_SCHEDULED_AT", ["scheduled_at"])
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar" })
  type: string;

  @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.NORMAL })
  priority: TaskPriority;

  @Column({ type: "jsonb", nullable: true })
  payload: Record<string, any>;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Index("IDX_TASK_IDEMPOTENCY_KEY", { unique: true })
  @Column({ type: "varchar", unique: true })
  idempotency_key: string;

  @Column({ type: "int", default: 0 })
  attempts: number;

  @Column({ type: "text", nullable: true })
  last_error: string;

  @Column({ type: "timestamp", nullable: true })
  scheduled_at: Date;

  @Column({ type: "timestamp", nullable: true })
  started_at: Date;

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}