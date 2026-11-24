
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn({ name: 'employee_id' })
  employeeId: number;

  @Column({ name: 'employee_name', length: 100 })
  employeeName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
    contact: string | null; 

  @Column({ length: 100 })
  position: string;
}
