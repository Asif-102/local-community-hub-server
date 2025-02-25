import { Body, Controller, Get, ParseIntPipe, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { Profile } from "passport-google-oauth20";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { GoogleGuard } from "./guards/google.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res);
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  login(@CurrentUser("id", ParseIntPipe) userId: number, @Res({ passthrough: true }) res: Response) {
    return this.authService.generateTokens(userId, res);
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  refresh(@CurrentUser("id", ParseIntPipe) userId: number, @Res({ passthrough: true }) res: Response) {
    return this.authService.generateTokens(userId, res);
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie("refreshToken", "");
  }

  // Google auth
  @UseGuards(GoogleGuard)
  @Get("google")
  google() {}

  @UseGuards(GoogleGuard)
  @Get("google/callback")
  googleCallback(@Req() req: Request & { user: Profile }, @Res({ passthrough: true }) res: Response) {
    return this.authService.googleAuth(req.user._json.email, res);
  }
}
