/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Koa from 'koa';
import { ObjectID } from 'mongodb';

export default () => {
    return new ValidatorBuilder();
}

export function body (name: string) {
    return new ValidatorBuilder().body(name);
}

export function query (name: string) {
    return new ValidatorBuilder().query(name);
}

export function params (name: string) {
    return new ValidatorBuilder().params(name);
}

enum ValidatorField {
    body = 'body',
    query = 'query',
    params = 'params'
}

enum ValidatorType {
    string = 'string',
    stringArray = 'stringArray',
    number = 'number',
    boolean = 'boolean',
    email = 'email',
    objectID = 'objectID'
}

class InvalidNumberRange extends Error {
    constructor (message: string) {
        super(message);
    }
}

class InvalidValueType extends Error {
    constructor (message: string) {
        super(message);
    }
}

class InvalidValueInList extends Error {
    constructor (message: string) {
        super(message);
    }
}

class ValidatorBuilder {

    private isRequired = false;
    private name: string = null;
    private type: ValidatorType = null;
    private field: ValidatorField = null;
    private highest: number = null;
    private lowest: number = null;
    private isNotBlank = false;
    private valueList: any[] = [];

    public body (name: string) {
        this.field = ValidatorField.body;
        this.name = name;
        return this;
    }

    public query (name: string) {
        this.field = ValidatorField.query;
        this.name = name;
        return this;
    }

    public params (name: string) {
        this.isRequired = true;
        this.field = ValidatorField.params;
        this.name = name;
        return this;
    }

    public required () {
        this.isRequired = true;
        return this;
    }

    public optional () {
        this.isRequired = false;
        return this;
    }

    public isString () {
        this.type = ValidatorType.string;
        return this;
    }

    public isNumber () {
        this.type = ValidatorType.number;
        return this;
    }

    public isBoolean () {
        this.type = ValidatorType.boolean;
        return this;
    }

    public isObjectID () {
        this.type = ValidatorType.objectID;
        return this;
    }

    public isStringArray () {
        this.type = ValidatorType.stringArray;
        return this;
    }

    public rangeHigh (high: number) {
        this.highest = high;
        return this;
    }

    public rangeLow (low: number) {
        this.lowest = low;
        return this;
    }

    public notBlank () {
        this.isNotBlank = true;
        return this;
    }

    public in (valueList: any[]) {
        this.valueList = valueList;
        return this;
    }

    private validateString (value: any) {
        if (typeof(value) != 'string') {
            throw new InvalidValueType('invalid string');
        }
        if (this.isNotBlank && value.trim().length === 0) {
            throw new InvalidValueType('invalid string, can not be blank');
        }
    }

    private validateNumber (value: any) {
        if (value !== '' && !isNaN(value)) {
            value = parseFloat(value);
            if ((this.highest !== null && value > this.highest)
                    || (this.lowest !== null && value < this.lowest)) {
                throw new InvalidNumberRange('invalid number range');
            }
        } else throw new InvalidValueType('invalid number');
    }

    private validateBoolean (value: any) {
        if (typeof(value) !== 'boolean' && value !== 'true' && value !== 'false') {
            throw new InvalidValueType('invalid boolean');
        }
    }

    private validateObjectID (value: any) {
        if (typeof(value) !== 'string' || !ObjectID.isValid(value)) {
            throw new InvalidValueType('invalid id');
        }
    }

    private validateStringArray (value: any) {
        try {
            if (Array.isArray(value) && value.length >= 0) {
                value.forEach(v => this.validateString(v));
            } else {
                this.validateString(value);
            }
        } catch (e) {
            throw new InvalidValueType('invalid string array')
        }
    }

    private validateInValueList (value: any) {
        if (this.valueList.length > 0 && !this.valueList.includes(value)) {
            throw new InvalidValueInList(`value not in list`);
        }
    }

    private retrieveValue (ctx: Koa.Context): any {
        if (this.field === ValidatorField.body) {
            return ctx.request.body[this.name]
        } else if (this.field === ValidatorField.query) {
            return ctx.query[this.name]
        } else if (this.field === ValidatorField.params) {
            return ctx.params[this.name]
        }
    }

    private validateValue (value: any) {
        if (this.type === ValidatorType.string) {
            this.validateString(value);
        } else if (this.type === ValidatorType.stringArray) {
            this.validateStringArray(value);
        } else if (this.type === ValidatorType.number) {
            this.validateNumber(value);
        } else if (this.type === ValidatorType.boolean) {
            this.validateBoolean(value);
        } else if (this.type === ValidatorType.objectID) {
            this.validateObjectID(value);
        }
        this.validateInValueList(value);
    }

    public build () {
        if (this.name === null || this.field === null || this.type === null) {
            throw new Error('Validator information not fulfilled');
        }

        return async (ctx: Koa.Context, next: () => Promise<void> | void) => {
            const value = this.retrieveValue(ctx);

            if (this.isRequired && value === undefined) {
                ctx.response.status = 400;
                ctx.body = {message: `${this.field.toString()} paramater "${this.name}" should be given.`, code: 40000};
                return;
            }
            if (!this.isRequired && value === undefined) {
                await next();
                return;
            }

            try {
                this.validateValue(value)
            } catch (error) {
                if (error instanceof InvalidNumberRange) {
                    ctx.response.status = 400;
                    ctx.body = {message: `${this.field.toString()} paramater "${this.name}" not in the range.`, code: 40000};
                } else if (error instanceof InvalidValueType) {
                    ctx.response.status = 400;
                    ctx.body = {message: `${this.field.toString()} paramater "${this.name}": ${error.message}.`, code: 40000};
                } else if (error instanceof InvalidValueInList) {
                    ctx.response.status = 400;
                    ctx.body = {message: `${this.field.toString()} paramater "${this.name}" should be one of value in [${this.valueList.join()}].`, code: 40000};
                }
                return;
            }
            await next();
        }
    }
}