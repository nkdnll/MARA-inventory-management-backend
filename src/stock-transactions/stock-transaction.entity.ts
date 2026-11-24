
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Material } from '../materials/material.entity';
import { Employee } from '../employees/employee.entity';

export enum StockTransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('stock_transactions')
export class StockTransaction {
  @PrimaryGeneratedColumn({ name: 'transaction_id' })
  transactionId: number;

  @Column({ name: 'material_id', type: 'int' })
  materialId: number;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @ManyToOne(() => Employee, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    name: 'transaction_type',
    type: 'varchar',
    length: 10,
  })
  transactionType: StockTransactionType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'quantity_before', type: 'int' })
  quantityBefore: number;

  @Column({ name: 'quantity_after', type: 'int' })
  quantityAfter: number;

  @CreateDateColumn({
    name: 'transaction_date',
    type: 'datetime',
  })
  transactionDate: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  remarks: string | null;
}
