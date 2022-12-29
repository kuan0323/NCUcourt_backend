import { Inject, Service } from "typedi";
import { AddUserParameter } from "../adapters/data_access/parameters/addUserParameter";
import { UserGateway } from "../adapters/data_access/userGateway";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError";
import TypeUtils from "../libs/typeUtils";
const crypto = require('crypto');

@Service()
export class UserManager {

    @Inject('UserService')
    private userGateway: UserGateway;

    constructor (userGateway: UserGateway) {
        this.userGateway = userGateway;
    }

    async register (name: string, studentId: string, email: string, password: string, phone: string) {

        const existUser = await this.userGateway.findByStudentId(studentId);

        if (TypeUtils.isNotNone(existUser)) {
            throw new IllegalArgumentError('user has been registered.');
        }
        
        const hashPwd = crypto.createHash('sha256')
                                .update(password)
                                .digest('hex');

        const user = await this.userGateway.addUser(new AddUserParameter({
            name, studentId, email, password: hashPwd, phone, role: 'regular'
        }));

        return user;
    }
}
