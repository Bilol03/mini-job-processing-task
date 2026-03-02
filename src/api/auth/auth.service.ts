import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { RoleEnum } from 'src/constants/enums';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }
  async register(dto: RegisterDto) {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException("Email already exists");
    }


    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password_hash,
      role: RoleEnum.USER,
      is_active: true,
    });
    await this.userRepository.save(user);

    return this.generateToken(user);
  }
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.is_active) {
      throw new UnauthorizedException("Account is disabled");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.generateToken(user);
  }



  private generateToken(user: User): { access_token: string } {
    const payload = {
      userId: user.id,
      email: user.email,
      is_active: user.is_active,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
