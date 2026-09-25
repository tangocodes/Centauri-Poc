import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { TaskComment } from '../../task-comments/entities/task-comment.entity.js';

@Entity('tasks')
export class Task {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @ManyToOne(() => User, { nullable: true }) // one user can have multiple tasks thats why manytoone
  assignedToId: User | null;

  @ManyToOne(() => User, { nullable: true }) // one user can have multiple tasks thats why manytoone
  createdById: User | null;

  @OneToMany(()=> TaskComment , (comment)=>comment.task)
  comments : TaskComment[]

  @Column()
  priority: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}