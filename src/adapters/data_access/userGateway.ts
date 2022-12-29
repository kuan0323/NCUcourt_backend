import { User } from "../../entities/user";
import { AddUserParameter } from "./parameters/addUserParameter";

export interface UserGateway {
    findByStudentId (studentId: string): Promise<User>;
    addUser (parameter: AddUserParameter): Promise<User>;
}
