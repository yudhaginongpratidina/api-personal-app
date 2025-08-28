import AuthRepository from "@/repository/auth-repository";
import ResponseError from "@/utils/response-error";

export default class AuthService {

    static async register(data: { email: string, password: string }) {
        const find_user_by_email = await AuthRepository.findUser(data.email);

        if (find_user_by_email) throw new ResponseError({
            status: 409,
            code: "USER_ALREADY_EXISTS",
            message: "User with this email already exists",
            details: {
                field: "email",
                value: data.email,
                suggestion: "Try with another email"
            }
        });

        const response = await AuthRepository.createUser(data);
        return response
    }

    static async login(data: { email: string, password: string }) {
        const response = await AuthRepository.getUserWithPasswordByEmail(data.email);

        if (!response) {
            throw new ResponseError({
                status: 401,
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }

        const password_match = data.password === response.passwordHash;

        if (!password_match) {
            throw new ResponseError({
                status: 401,
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }


        return response
    }

}