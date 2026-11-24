
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn({ name: 'supplier_id' })
  supplierId: number;

  @Column({
    name: 'supplier_name',
    type: 'varchar',
    length: 100,
  })
  supplierName: string;

  @Column({
    name: 'contact_number',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  contactNumber: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  address: string | null;
}
