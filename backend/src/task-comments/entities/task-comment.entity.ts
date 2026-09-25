import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Task } from '../../tasks/entities/task.entity.js';

@Entity('task_comments')
export class TaskComment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Task, { nullable: false , onDelete : 'CASCADE' }) 
  task: Task | null;

  @ManyToOne(() => User, { nullable: false }) 
  author: User | null;

  @CreateDateColumn()
  createdAt: Date;

}