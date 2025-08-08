import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const { username, password, name } = createUserDto;
    
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }
    
    // Create new user
    const user = this.usersRepository.create({
      username,
      password,
      name,
    });
    
    await this.usersRepository.save(user);
    
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };
  }
}