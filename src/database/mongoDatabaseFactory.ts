import { Service } from "typedi";
import config from "../config";
import { MongoDatabase } from "./mongoDatabase";

@Service()
export class MongoDatabaseFactory {

    create (): MongoDatabase {
        return new MongoDatabase(config.mongoDatabaseName)
    }

}