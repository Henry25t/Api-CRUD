import { blob } from 'stream/consumers';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;
}
