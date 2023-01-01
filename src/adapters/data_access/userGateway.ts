import { User } from "../../entities/user";
import { AddUserParameter } from "./parameters/addUserParameter";
import { UpdateUserParameter } from "./parameters/updateUserParameter";

export interface UserGateway {
    isPasswordCorrect (id: string, password: string): Promise<boolean>;
    findByStudentId (studentId: string): Promise<User>;
    addUser (parameter: AddUserParameter): Promise<User>;
    updateUser (parameter: UpdateUserParameter): Promise<void>;
}
