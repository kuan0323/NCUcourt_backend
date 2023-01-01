import * as jwt from 'jsonwebtoken';
import { Algorithm } from 'jsonwebtoken';
import { Inject, Service } from "typedi";
import { UserGateway } from "../adapters/data_access/userGateway";
import config from '../config';
import { AuthError } from '../exceptions/authError';
import TypeUtils from '../libs/typeUtils';

const crypto = require('crypto');

@Service()
export class AuthManager {

    @Inject('UserService')
    private userService: UserGateway;

    constructor (userService: UserGateway) {
        this.userService = userService;
    }

    async login (studentId: string, password: string): Promise<string> {
        const user = await this.userService.findByStudentId(studentId);

        if (TypeUtils.isNone(user)) {
            throw new AuthError('studentId not exist.')
        }

        const hashPwd = crypto.createHash('sha256').update(password).digest('hex');
        const isPwdCorrect = await this.userService.isPasswordCorrect(user.id, hashPwd);

        if (!isPwdCorrect) {
            throw new AuthError('studentId and password not accepted.');
        }
        
        return this.generateServiceToken(user.id);
    }

    verifyServiceToken (serviceToken: string) {
        try {
            const userTokenData: any = jwt.verify(serviceToken, config.secretKey);
            const userId = userTokenData.userId || null;
            const lastSignTimestamp = userTokenData.signTimestamp || null;
            if (userId === null || lastSignTimestamp === null) {
                throw new AuthError('invalid token')
            }
            return userId;
        } catch (e) {
            if (e.name === 'JsonWebTokenError' && e.message === 'invalid token') {
                throw new AuthError('invalid token');
            } else if (e.name === 'TokenExpiredError' && e.message === 'jwt expired') {
                throw new AuthError('token expired');
            } else {
                throw new AuthError(`${e.name}: ${e.message}`);
            }
        }
    }

    private generateServiceToken (userId: string): string {
        const payload = { userId: userId, signTimestamp: Date.now() };
        const options = { algorithm: 'HS256' as Algorithm };
        const token = jwt.sign(payload, config.secretKey, options);
        return token;
    }
}