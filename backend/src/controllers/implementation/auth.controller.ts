import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../services/interface/IAuthService";
import { IAuthController } from "../interface/IAuthController";
import { HttpStatus } from "@/constants/status.constant";
import signupSchema from "@/schema/signup-schema";
import { createHttpError } from "@/utils/http-error.util";
import { HttpResponse } from "@/constants/response-message.constant";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // console.log(validatedData, "validated");  const validatedData = signupSchema.parse(req.body);

      // if (!validatedData) {
      //   throw createHttpError(
      //     HttpStatus.BAD_REQUEST,
      //     HttpResponse.INVALID_CREDENTIALS
      //   );
      // }
      // const user = await this._authService.signup(validatedData);
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

      const verificationResponse = await this._authService.verifyOtp(
        otp,
        email
      );

      res.status(HttpStatus.CREATED).json(verificationResponse);
    } catch (err) {
      next(err);
    }
  }
}
