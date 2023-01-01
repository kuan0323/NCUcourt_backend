import { Inject, Service } from "typedi";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError";
import TypeUtils from "../libs/typeUtils";
import { CourtGateway } from "../adapters/data_access/courtGateway";
import { AddCourtParameter } from "../adapters/data_access/parameters/addCourtParameters";

@Service()
export class CourtManager {
    
    @Inject('CourtService')
    private courtGateway: CourtGateway;


    async addCourt(name: string, price: string, type: string) {
        const existCourt = await this.courtGateway.findByName(name);

        if(TypeUtils.isNotNone(existCourt)) {
            throw new IllegalArgumentError("The court had been added.");
        } 

        const court = await this.courtGateway.addCourt(new AddCourtParameter({name, price, type}));
        return court;
    }
}