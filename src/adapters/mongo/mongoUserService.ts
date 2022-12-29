import { Service } from "typedi";
import { MongoDatabase } from "../../database/mongoDatabase";
import { User } from "../../entities/user";
import TypeUtils from "../../libs/typeUtils";
import { AddUserParameter } from "../data_access/parameters/addUserParameter";
import { UserGateway } from "../data_access/userGateway";

@Service()
@Service('UserService')
export class MongoUserService implements UserGateway {

    private database: MongoDatabase;

    private collectionName = 'users';

    constructor (database: MongoDatabase) {
        this.database = database;
    }
    
    async findByStudentId (studentId: string): Promise<User> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.findOne({ studentId });
        return TypeUtils.isNone(result) ? result : this.toUser(result);
    }
    
    async addUser (parameter: AddUserParameter): Promise<User> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.insertOne({ 
            name: parameter.name,
            studentId: parameter.studentId,
            email: parameter.email,
            password: parameter.password,
            phone: parameter.phone,
            createdTime: new Date(),
            role: parameter.role
        });
        return this.toUser(result.ops[0]);
    }

    private toUser (json: any): User {
        return new User({
            _id: json._id,
            name: json.name,
            studentId: json.studentId,
            email: json.email,
            phone: json.phone,
            role: json.role,
            createdTime: json.createdTime
        });
    }
}
