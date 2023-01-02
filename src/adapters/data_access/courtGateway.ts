import { Court } from "../../entities/court";
import { AddCourtParameter } from "./parameters/addCourtParameters";

export interface CourtGateway {
    findByName(name: string): Promise<Court>;
    addCourt (parameter: AddCourtParameter): Promise<Court>;
    find(type: string, name: string): Promise<Court[]>;
    deleteCourt (courtId: string): Promise<void>;
}