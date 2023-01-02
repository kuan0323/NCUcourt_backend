import { User } from "../../entities/user";
import { AddUserParameter } from "./parameters/addUserParameter";
import { SearchUserParameter } from "./parameters/searchUserParameter";
import { UpdateUserParameter } from "./parameters/updateUserParameter";

export interface UserGateway {
    isPasswordCorrect (id: string, password: string): Promise<boolean>;
    findById (id: string): Promise<User>;
    findByStudentId (studentId: string): Promise<User>;
    find (parameter: SearchUserParameter): Promise<User[]>;
    addUser (parameter: AddUserParameter): Promise<User>;
    updateUser (parameter: UpdateUserParameter): Promise<void>;
    deleteUser (deleteId: string): Promise<void>;
}