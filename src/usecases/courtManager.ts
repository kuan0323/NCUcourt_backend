import * as shortUUID from 'short-uuid';
import { Inject, Service } from "typedi";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError";
import TypeUtils from "../libs/typeUtils";
import { CourtGateway } from "../adapters/data_access/courtGateway";
import { AddCourtParameter } from "../adapters/data_access/parameters/addCourtParameters";
import { ImageStorage } from "../adapters/storage_access/imageStorage";
import { ImageUtils } from "../libs/imageUtils";

@Service()
export class CourtManager {
    
    @Inject('CourtService')
    private courtGateway: CourtGateway;
    @Inject('ImageStorage')
    private imageStorage: ImageStorage;

    async addCourt(name: string, price: string, type: string, photoContent: Buffer) {
        const existCourt = await this.courtGateway.findByName(name);

        if(TypeUtils.isNotNone(existCourt)) {
            throw new IllegalArgumentError("The court had been added.");
        }

        const imageInfo = await ImageUtils.probe(photoContent)
        const photoUrl = await this.imageStorage.upload(`courts/${shortUUID().generate()}.${imageInfo.format}`, photoContent);

        const court = await this.courtGateway.addCourt(new AddCourtParameter({
            name, price, type, photo: photoUrl
        }));
        return court;
    }
}