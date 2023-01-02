import { Court } from "../../entities/court";
import { AddCourtParameter } from "./parameters/addCourtParameters";
import { UpdateCourtParameter } from "./parameters/updateCourtParameter";

export interface CourtGateway {
    findByName(name: string): Promise<Court>;
    addCourt (parameter: AddCourtParameter): Promise<Court>;
    find(type: string, name: string): Promise<Court[]>;
    updateCourt(parameter: UpdateCourtParameter): Promise<void>;
}