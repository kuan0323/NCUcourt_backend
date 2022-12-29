/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectID } from "mongodb";


export default class TypeUtils {

    static isNone (obj: any) {
        return obj === null || obj === undefined;
    }

    static isNotNone (obj: any) {
        return !TypeUtils.isNone(obj);
    }
    
    static isNull (obj: any) {
        return obj === null;
    }

    static isUndefined (obj: any) {
        return obj === undefined;
    }

    static isNotUndefined (obj: any) {
        return obj !== undefined;
    }

    static toObjectIDList (idList: string[]): ObjectID[] {
        return idList
                    .filter(id => ObjectID.isValid(id))
                    .map(id => new ObjectID(id));
    }

    static isStringBlank (str: string): boolean {
        return str === '' || str === null || str === undefined;
    }

    static isNumberStirng (str: string): boolean {
        if (str === null || str === undefined || str.trim() === '') {
            return false;
        }
        return !isNaN(Number(str));
    }

    static isEmptyObject (obj: object): boolean {
        return TypeUtils.isNotNone(obj)
                ? Object.keys(obj).length == 0
                : true;
    }
}