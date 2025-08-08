import Validation from "../../core/utils/validation.js";
import ResponseError from "../../core/utils/response-error.js";
import { RegisterSchema, LoginSchema } from "./model.js";
import AuthService from "./service.js";


const validate = Validation.validate;


export default class AuthController {

    static async Register(req, res, next) {
        try {
            const data = await validate(RegisterSchema, req.body);
            const response = await AuthService.Register(data);
            res.status(201).json({
                message: "register success",
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async Login(req, res, next) {
        try {
            const data = await validate(LoginSchema, req.body);
            const response = await AuthService.Login(data.email, data.password);

            const access_token = response.access_token;
            const refresh_token = response.refresh_token;

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            };

            if (process.env.NODE_ENV === 'production' && process.env.DOMAIN) {
                cookieOptions.domain = process.env.DOMAIN;
            }

            res.cookie('refresh_token', refresh_token, cookieOptions);
            res.cookie('authenticated', true, cookieOptions);
            res.status(200).json({
                message: "login success",
                token: access_token
            })
        } catch (error) {
            next(error);
        }
    }

    static async Token(req, res, next) {
        try {
            const authenticated = req.cookies.authenticated;
            const refresh_token = req.cookies.refresh_token;

            if (!authenticated) { throw new ResponseError(401, 'authentication required') }
            if (!refresh_token) { throw new ResponseError(401, 'refresh token missing') }

            const response = await AuthService.Token(refresh_token);
            return res.json({
                message: 'token refreshed',
                token: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async Logout(req, res, next) {
        try {
            const authenticated = req.cookies.authenticated;
            if (!authenticated) { throw new ResponseError(401, 'unauthenticated') }

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            };

            if (process.env.NODE_ENV === 'production' && process.env.DOMAIN) {
                cookieOptions.domain = process.env.DOMAIN;
            }

            res.clearCookie('refresh_token', cookieOptions);
            res.clearCookie('authenticated', cookieOptions);

            res.json({ message: 'logout success' });
        } catch (error) {
            next(error);
        }
    }

}