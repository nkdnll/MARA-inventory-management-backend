
import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersRepository.findOne({
      where: { email },
    });

    if (existing) {
      throw new ConflictException(
        'Email address is already registered',
      );
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      12,
    );

    const user = this.usersRepository.create({
      fullName: dto.fullName.trim(),
      email,
      passwordHash,
      role: 'staff',
    });

    try {
      const saved = await this.usersRepository.save(user);

      return {
        userId: saved.userId,
        fullName: saved.fullName,
        email: saved.email,
        role: saved.role,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException(
          'Email address is already registered',
        );
      }

      throw error;
    }
  }

  async findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', {
        email: email.trim().toLowerCase(),
      })
      .getOne();
  }

  async findById(userId: number) {
    return this.usersRepository.findOne({
      where: { userId },
    });
  }
}
