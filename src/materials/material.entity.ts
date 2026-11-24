
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '../categories/category.entity';
import { Supplier } from '../suppliers/supplier.entity';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn({ name: 'material_id' })
  materialId: number;

  @Column({
    name: 'material_name',
    type: 'varchar',
    length: 150,
  })
  materialName: string;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'supplier_id', type: 'int' })
  supplierId: number;

  @ManyToOne(() => Supplier, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'varchar', length: 30 })
  unit: string;

  @Column({ type: 'varchar', length: 30, default: 'Available' })
  status: string;
}
