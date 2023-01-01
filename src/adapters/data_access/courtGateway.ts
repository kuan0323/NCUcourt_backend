import { Court } from "../../entities/court";
import { AddCourtParameter } from "./parameters/addCourtParameters";

export interface CourtGateway {
    findByName(name: string): Promise<Court>;
    addCourt (parameter: AddCourtParameter): Promise<Court>;
    // updateUser (parameter: UpdateUserParameter): Promise<void>;
}