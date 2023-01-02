import { Inject, Service } from "typedi";
import { AddUserParameter } from "../adapters/data_access/parameters/addUserParameter";
import { UpdateUserParameter } from "../adapters/data_access/parameters/updateUserParameter";
import { UserGateway } from "../adapters/data_access/userGateway";
import { User } from "../entities/user";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError";
import { NotExistError } from "../exceptions/notExistError";
import { PermissionError } from "../exceptions/permissionError";
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

    async editUser ({id, name, email, oldPassword, newPassword, phone}
        : {id: string, name: string, email: string, oldPassword: string, newPassword: string, phone: string}) {
        await this.userGateway.updateUser(new UpdateUserParameter({
            id, name, email, phone
        }));

        if (TypeUtils.isNotNone(oldPassword) && TypeUtils.isNotNone(newPassword)) {
            //hash newPassword 
            const hashPwd = crypto.createHash('sha256').update(newPassword).digest('hex');
    
            //hash oldPassword 
            const hashOldPwd = crypto.createHash('sha256').update(oldPassword).digest('hex');

            if (!(await this.userGateway.isPasswordCorrect(id, hashOldPwd))) {
                throw new PermissionError('password not correct, can\'t, update new password');
            }
            await this.userGateway.updateUser(new UpdateUserParameter({
                id, password: hashPwd
            }));
        } else if (TypeUtils.isNotNone(oldPassword) || TypeUtils.isNotNone(newPassword)) {
            throw new IllegalArgumentError('you didn\'t offer enough information to change your password');
        }
    }

    async searchUsers ({ keyword, role, sortBy }: { keyword: string, role: string, sortBy: string }) {
        return await this.userGateway.find({keyword, role, sortBy});
    }

    async getSelfUser (id: string) {
        return await this.userGateway.findById(id);
    }

    async deleteUser(userId: string, deleteId: string) {
        const user = await this.userGateway.findById(userId);
        if (user.role !== 'admin' && user.role !== 'superAdmin') {
            throw new PermissionError('no permission to delete this user.')
        }
        const deleteUser = await this.userGateway.findById(deleteId);
        if (TypeUtils.isNone(deleteUser)) {
            throw new NotExistError('The user isn\'t exist')
        }
        await this.userGateway.deleteUser(deleteId);
    }
}
