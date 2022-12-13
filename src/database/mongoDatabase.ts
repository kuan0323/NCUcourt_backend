import * as mongodb from 'mongodb';
import { Db, MongoClient } from "mongodb";
import config from '../config';
const mongo = mongodb.MongoClient;

export class MongoDatabase {

    private _dbName: string
    private _client: MongoClient
    private _db: Db

    constructor (dbName: string) {
        this.databaseName = dbName;
    }

    set databaseName (value: string) {
        this._dbName = value;
        this._client = undefined;
        this._db = undefined;
    }

    async getClient (): Promise<MongoClient> {
        if (this._client === undefined) {
            try {
                this._client = await mongo.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
                return this._client;
            } catch (error) {
                console.log(`[DB] connnected ${config.mongoUrl} error`);
                console.log(`[DB] error: ${error}`);
            }            
        }
        return this._client;
    }

    async getDB(): Promise<Db> {
        if (this._client === undefined || this._db === undefined) {
            const hidePwdMongoUrl = config.mongoUrl.replace(/(:\/\/).*:.*@/, '://user:pwd@');
            //console.log(config.mongoUrl);

            //console.log("test: "+hidePwdMongoUrl);
            //const hidePwdMongoUrl = 'mongodb+srv://zeroan:O8aru2I0wdG6KO7K@cluster0.x0k1d8g.mongodb.net/?retryWrites=true&w=majority';
            try {
                console.log(`[DB] try to connect to mongoDB: ${hidePwdMongoUrl}`);
                this._client = await mongo.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
                this._db = await this._client.db(this._dbName);
                console.log(`[DB] mongo connnected created: ${hidePwdMongoUrl}`);
                return this._db;
            } catch (error) {
                console.log(`[DB] connnected ${hidePwdMongoUrl} error`);
                console.log(`[DB] error: ${error}`);
            }
        }
        return this._db;
    }
    
    async getCollection (mongoCollection: string): Promise<mongodb.Collection> {
        if (this._client === undefined || this._db === undefined) {
            await this.getDB();
        }
        const collection = this._db.collection(mongoCollection);
        return collection;
    }

    async closeDB (): Promise<void> {
        await this._client.close();
        this._client = undefined;
        this._db = undefined;
    }
}

const database = new MongoDatabase(config.mongoDatabaseName);
export default database;
