import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  //TODO: Not implemented
  async validateUser() {}

  //TODO: Not implemented
  async login() {}
}
