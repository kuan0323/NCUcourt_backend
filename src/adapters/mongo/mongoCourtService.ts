import { MongoDatabase } from "../../database/mongoDatabase";
import { Court } from "../../entities/court";
import { CourtGateway } from "../data_access/courtGateway";
import TypeUtils from "../../libs/typeUtils";
import { AddCourtParameter } from "../data_access/parameters/addCourtParameters";
import { Service } from "typedi";
import { UpdateUserParameter } from "../data_access/parameters/updateUserParameter";
import { UpdateCourtParameter } from "../data_access/parameters/updateCourtParameter";
import { ObjectID, ObjectId } from "mongodb";
import { IllegalArgumentError } from "../../exceptions/illegalArgumentError";

@Service()
@Service('CourtService')
export class MongoCourtService implements CourtGateway {
    private database: MongoDatabase;
    private collectionName = 'courts';

    constructor (database: MongoDatabase) {
        this.database = database;
    }

    async addCourt(parameter: AddCourtParameter): Promise<Court> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.insertOne({ 
            name: parameter.name,
            price: parameter.price,
            type: parameter.type,
            photo: parameter.photo,
            beReserved: true,
            createdTime: new Date(),
            lastModified: new Date(),
        });
        return this.toCourt(result.ops[0]);
    }

    async findByName (name: string): Promise<Court> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.findOne({ name });
        return TypeUtils.isNone(result) ? result : this.toCourt(result);
    }

    async find(type: string, name: string): Promise<Court[]> {
        const filter: any = {};
        if (TypeUtils.isNotNone(type)) filter.type = type;
        if (TypeUtils.isNotNone(name)) filter.name = { $regex: `.*${name}.*`, $options: 'i' };
        filter.beReserved = true;

        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.find(filter).toArray();
        return result.map(r => this.toCourt(r));
    }

    async deleteCourt (courtId: string): Promise<void> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.updateOne(
            { _id: new ObjectID(courtId) },
            { $set: { beReserved: false } }
        );
        if (result.result.nModified !== 1) {
            throw new IllegalArgumentError('the court is not exist.');
        }
    }

    async updateCourt(parameter: UpdateCourtParameter): Promise<void>{
        const updates: any = {};
        
        if (TypeUtils.isNone(parameter.id)) {
            throw new IllegalArgumentError('court id should be given');
        }
        if (TypeUtils.isNotNone(parameter.name)) updates.name = parameter.name;
        if (TypeUtils.isNotNone(parameter.price)) updates.price = parameter.price;
        if (TypeUtils.isNotNone(parameter.type)) updates.type = parameter.type;
        if (TypeUtils.isNotNone(parameter.photo)) updates.photo = parameter.photo;
        updates.lastModified = new Date();
        const collection = await this.database.getCollection(this.collectionName);
        await collection.updateOne({ _id: new ObjectID(parameter.id) }, {
            $set: updates
        });
    }

    private toCourt (json: any): Court {
        return new Court({
            id: json._id,
            name: json.name,
            price: json.price,
            type: json.type,
            photo: json.photo,
            beReserved: json.beReserved,
            createdTime: json.createdTime,
            lastModified: json.lastModified
        });
    }
}