import * as Koa from "koa";
import database from "../database/mongoDatabase";
import Container from "typedi";
import { CourtManager } from "../usecases/courtManager";
import { APIUtils } from "./apiUtils";

const courtManager = Container.get(CourtManager);

export default {
  // get all courts information from the type(ex. basketball) we clicked
  // hint: three type of court (basketball、badminton、volleyball)
  async getCourts(ctx: Koa.Context) {
    const type_keyword = ctx.query.type_keyword;
    const collection = await database.getCollection("courts");
    const courts = await collection.find({ type: type_keyword }).toArray();
    ctx.body = courts;
  },
  async createCourts(ctx: Koa.Context) {
    const name = ctx.request.body.name;
    const photo = ctx.request.body.photo;
    const price = ctx.request.body.price;
    const court_status = ctx.request.body.court_status;
    const type = ctx.request.body.type;
    const beReserved = ctx.request.body.beReserved;

    ctx.request.body.createdTime = new Date();
    const createdTime = ctx.request.body.createdTime;
    const collection = await database.getCollection("courts");

    //check if name is used
    if ((await collection.find({ name: name }).toArray()).length === 0) {
      const result = await collection.insertOne({
        name: name,
        photo: photo,
        price: price,
        court_status: court_status,
        type: type,
        beReserved: beReserved,
        createdTime: createdTime,
      });
      ctx.body = result.ops[0];
    } else {
      ctx.body = "Warning: The court name had been used!";
    }
  },

  async editCourts(ctx: Koa.Context) {
    const photo = ctx.request.body.photo;
    const price = ctx.request.body.price;
    const court_status = ctx.request.body.court_status;
    const type = ctx.request.body.type;
    const beReserved = ctx.request.body.beReserved;

    const name_keyword = ctx.query.name_keyword;
    const collection = await database.getCollection("courts");
    ctx.request.body.lastModified = new Date();
    const lastModified = ctx.request.body.lastModified;

    //check if the target exist
    if (
      (await collection.find({ name: name_keyword }).toArray()).length === 0
    ) {
      ctx.body = "Warning: Can't find the court!";
    } else {
      const courts = await collection.updateOne(
        { name: name_keyword },
        {
          $set: {
            photo: photo,
            price: price,
            court_status: court_status,
            type: type,
            beReserved: beReserved,
            lastModified: lastModified,
          },
        }
      );
      ctx.body = await collection.find({ name: name_keyword }).toArray();
    }
  },

  async deleteCourts(ctx: Koa.Context) {
    const name_keyword = ctx.query.name_keyword;
    const collection = await database.getCollection("courts");

    //check if the target exist
    if (
      (await collection.find({ name: name_keyword }).toArray()).length === 0
    ) {
      ctx.body = "Warning: Can't find the court!";
    } else {
      const deleting = await collection.deleteOne({ name: name_keyword });
      ctx.body = "The court had been deleted";
    }
  },
};
