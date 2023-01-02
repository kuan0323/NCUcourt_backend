import { ObjectID } from "mongodb";
import { Service } from "typedi";
import { MongoDatabase } from "../../database/mongoDatabase";
import { User } from "../../entities/user";
import { IllegalArgumentError } from "../../exceptions/illegalArgumentError";
import TypeUtils from "../../libs/typeUtils";
import { AddUserParameter } from "../data_access/parameters/addUserParameter";
import { SearchUserParameter } from "../data_access/parameters/searchUserParameter";
import { UpdateUserParameter } from "../data_access/parameters/updateUserParameter";
import { UserGateway } from "../data_access/userGateway";

@Service()
@Service('UserService')
export class MongoUserService implements UserGateway {

    private database: MongoDatabase;

    private collectionName = 'users';

    constructor (database: MongoDatabase) {
        this.database = database;
    }

    async isPasswordCorrect (id: string, password: string): Promise<boolean> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.findOne({ _id: new ObjectID(id) });
        return TypeUtils.isNotNone(result) && result.password === password;
    }

    async findById (id: string): Promise<User> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.findOne({ _id: new ObjectID(id) });
        return TypeUtils.isNone(result) ? result : this.toUser(result);
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
            lastModified: new Date(),
            role: parameter.role
        });
        return this.toUser(result.ops[0]);
    }

    async updateUser (parameter: UpdateUserParameter): Promise<void> {
        const updates: any = {};
        
        if (TypeUtils.isNone(parameter.id)) {
            throw new IllegalArgumentError('user id should be given');
        }
        if (TypeUtils.isNotNone(parameter.email)) updates.email = parameter.email;
        if (TypeUtils.isNotNone(parameter.password)) updates.password = parameter.password;
        if (TypeUtils.isNotNone(parameter.name)) updates.name = parameter.name;
        if (TypeUtils.isNotNone(parameter.phone)) updates.phone = parameter.phone;
        updates.lastModified = new Date();
        const collection = await this.database.getCollection(this.collectionName);
        await collection.updateOne({ _id: new ObjectID(parameter.id) }, {
            $set: updates
        });
    }

    async find (parameter: SearchUserParameter): Promise<User[]> {
        const filter: any = {};
        if (TypeUtils.isNotNone(parameter.keyword)) filter.name = { $regex: `.*${parameter.keyword}.*`, $options: 'i' };
        if (TypeUtils.isNotNone(parameter.role)) filter.role = parameter.role;
        const sort = TypeUtils.isNotNone(parameter.sortBy)
                        ? { [parameter.sortBy]: -1 }
                        : { lastModified: -1 }
        const collection = await this.database.getCollection(this.collectionName);
        const results = await collection
                                .find(filter)
                                .sort(sort)
                                .toArray()
        return results.map(r => this.toUser(r));
    }

    async deleteUser(deleteId: string): Promise<void> {
        const collection = await this.database.getCollection(this.collectionName);
        await collection.updateOne({ _id: deleteId }, {
            $set: 
                {'collection.role': 'deleted'}
        });
    }

    private toUser (json: any): User {
        return new User({
            id: json._id,
            name: json.name,
            studentId: json.studentId,
            email: json.email,
            phone: json.phone,
            role: json.role,
            createdTime: json.createdTime,
            lastModified: json.lastModified
        });
    }
}
