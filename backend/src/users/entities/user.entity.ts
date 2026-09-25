import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'Product' })
  department: string;

  @Column({ default: 'Full Stack Developer' })
  role: string;

  @Column({ nullable: true })
  bio: string;


  @UpdateDateColumn()
  updatedAt: Date;
}