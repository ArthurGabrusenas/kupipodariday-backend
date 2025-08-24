import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({ username });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.hashService.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: { id: number; username: string }) {
    const payload: { sub: number; username: string } = {
      sub: user.id,
      username: user.username,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
