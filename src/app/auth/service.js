import AuthRepository from './repository.js';
import ResponseError from "../../core/utils/response-error.js";
import { generateToken } from "../../core/utils/jwt.js";
import bcrypt from 'bcrypt';

export default class AuthService {

    static async Register(data){
        const find_email = await AuthRepository.find_email(data.email);
        if (find_email) throw new ResponseError(409, "email already exist");

        const hash_password = await bcrypt.hash(data.password, 10);
        data.password = hash_password;

        const response = await AuthRepository.create(data);
        return response;
    }

    static async Login(email, password){
        const data = await AuthRepository.login(email);
        if (!data) throw new ResponseError(401, "wrong email or password");

        const isMatch = await bcrypt.compare(password, data.passwordHash);
        if (!isMatch) throw new ResponseError(401, "wrong email or password");

        const payload = { id: data.id };
        const response = await generateToken(payload);
        return response;
    }

}