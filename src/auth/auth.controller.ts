import { Body, Controller, ParseIntPipe, Post, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res);
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@CurrentUser("id", ParseIntPipe) userId: number, @Res({ passthrough: true }) res: Response) {
    return await this.authService.generateTokens(userId, res);
  }
}
