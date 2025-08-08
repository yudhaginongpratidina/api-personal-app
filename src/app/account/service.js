import AccountRepository from "./repository.js";
import ResponseError from "../../core/utils/response-error.js";
import bcrypt from 'bcrypt';

export default class AuthService {

    static async GetAccount(id){
        const response = await AccountRepository.get_account(id);
        return response;
    }

    static async ChangePassword(id, data){
        const  find_user = await AccountRepository.find_user(id);
        if (!find_user) throw new ResponseError(404, "user not found");

        const isMatch = await bcrypt.compare(data.old_password, find_user.passwordHash);
        if (!isMatch) throw new ResponseError(401, "wrong password");

        const hash_password = await bcrypt.hash(data.new_password, 10);
        data.password = hash_password;

        const response = await AccountRepository.update_password(id, data);
        return response;
    }
    
    static async DeleteAccount(id, data){
        const  find_user = await AccountRepository.find_user(id);
        if (!find_user) throw new ResponseError(404, "user not found");

        const isMatch = await bcrypt.compare(data.password, find_user.passwordHash);
        if (!isMatch) throw new ResponseError(401, "wrong password");

        return await AccountRepository.delete_account(id);
    }
}