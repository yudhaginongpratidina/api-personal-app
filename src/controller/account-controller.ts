import type { Request, Response, NextFunction } from "express";
import ResponseSuccess from "@/utils/response-success";
import Validation from "@/utils/validation";
import cookieOptions from "@/config/cookie";

import { ChangePasswordSchema, DeleteAccountSchema } from '@/schema/account-schema';
import AccountService from "@/service/account-service";

export default class AccountController {

    static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const { data } = Validation(ChangePasswordSchema, req.body);
            const response = await AccountService.changePassword(user.id, data.oldPassword, data.newPassword);
            return new ResponseSuccess({
                status: 200,
                code: "SUCCESS_PASSWORD_CHANGED",
                message: "Password changed successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const token = req.cookies.refresh_token;

            const { data } = Validation(DeleteAccountSchema, req.body);
            const response = await AccountService.deleteAccount(user.id, data.password, token);

            res.clearCookie('refresh_token', cookieOptions);
            res.clearCookie('authenticated', cookieOptions);

            return new ResponseSuccess({
                status: 200,
                code: "SUCCESS_ACCOUNT_DELETED",
                message: "Account deleted successfully",
                data: response
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

}