
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { IS_PUBLIC_KEY } from './public.decorator';

type AuthenticatedRequest = Request & {
  user?: User;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    // Allow endpoints marked with @Public()
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (isPublic) {
      return true;
    }

    // Get the incoming HTTP request
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    // Extract the Bearer token
    const authorization =
      request.headers.authorization;

    const [type, token] =
      authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Authentication token is required',
      );
    }

    try {
      // Verify the JWT token
      const payload =
        await this.jwtService.verifyAsync<{
          sub: number;
        }>(token);

      if (
        !Number.isSafeInteger(payload.sub) ||
        payload.sub < 1
      ) {
        throw new UnauthorizedException(
          'Invalid authentication token',
        );
      }

      // Check if the user still exists
      const user =
        await this.usersService.findById(
          payload.sub,
        );

      if (!user) {
        throw new UnauthorizedException(
          'User account not found',
        );
      }

      // Attach the authenticated user
      request.user = user;

      return true;

    } catch {
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }
}
