import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Req, Res, UseGuards } from "@nestjs/common";
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
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res);
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@CurrentUser("id", ParseIntPipe) userId: number, @Res({ passthrough: true }) res: Response) {
    return this.authService.generateTokens(userId, res);
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser("id", ParseIntPipe) userId: number, @Res({ passthrough: true }) res: Response) {
    return this.authService.generateTokens(userId, res);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: true,
    });

    return null;
  }

  // Google auth
  @UseGuards(GoogleGuard)
  @Get("google")
  google() {}

  @UseGuards(GoogleGuard)
  @Get("google/callback")
  googleCallback(@Req() req: Request & { user: Profile }, @Res({ passthrough: true }) res: Response) {
    return this.authService.googleAuth(
      {
        email: req.user._json.email,
        firstName: req.user._json.given_name,
        lastName: req.user._json.family_name || "",
        avatar: req.user._json.picture,
      },
      res,
    );
  }
}
