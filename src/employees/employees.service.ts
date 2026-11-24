
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const existing = await this.employeeRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Employee email already exists');
    }

    const employee = this.employeeRepository.create(dto);

    return this.employeeRepository.save(employee);
  }

  async findAll() {
    return this.employeeRepository.find({
      order: { employeeId: 'ASC' },
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId: id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }

    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    if (dto.email && dto.email !== employee.email) {
      const existing = await this.employeeRepository.findOne({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException('Employee email already exists');
      }
    }

    Object.assign(employee, dto);

    return this.employeeRepository.save(employee);
  }

  async remove(id: number) {
    const employee = await this.findOne(id);

    await this.employeeRepository.remove(employee);

    return {
      message: 'Employee deleted successfully',
    };
  }
}
