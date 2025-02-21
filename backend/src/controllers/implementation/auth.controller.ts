import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../services/interface/IAuthService";
import { IAuthController } from "../interface/IAuthController";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this._authService.signup(req.body);

      res.status(200).json({
        email: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const tokens = await this._authService.signin(email, password);

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (err) {
      next(err);
    }
  }
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { otp, email } = req.body;

      const isVerified = await this._authService.verifyOtp(otp, email);

      res.status(200).json({ isVerified });
    } catch (err) {
      next(err);
    }
  }
}
