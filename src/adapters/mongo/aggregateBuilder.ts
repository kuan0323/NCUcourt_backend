import { IllegalArgumentError } from "../../exceptions/illegalArgumentError";
// import { MongoCollectionType } from "./mongoCollection";

export class AggregateJoinRule {
    private _from: string;
    private _localField: string;
    private _foreignField: string;
    private _asField: string;

    public get from (): string { return this._from; }
    public get localField (): string { return this._localField; }
    public get foreignField (): string { return this._foreignField; }
    public get asField (): string { return this._asField; }

    public setFrom (from: string): AggregateJoinRule {
        this._from = from;
        return this;
    }

    public setLocalField (localField: string): AggregateJoinRule {
        this._localField = localField;
        return this;
    }

    public setForeignField (foreignField: string): AggregateJoinRule {
        this._foreignField = foreignField;
        return this;
    }

    public setAsField (asField: string): AggregateJoinRule {
        this._asField = asField;
        return this;
    }
}

export default class AggregateBuilder {

    private aggregate: object[] = [];

    public match (filter: object): AggregateBuilder {
        this.aggregate.push({ $match: filter });
        return this;
    }

    public sample (size: number): AggregateBuilder {
        this.aggregate.push({ $sample: { size } })
        return this;
    }

    public sort (rule: object): AggregateBuilder {
        this.aggregate.push({ $sort: rule });
        return this;
    }

    public replaceWithArray (field: string): AggregateBuilder {
        this.aggregate.push({ $unwind: `$${field}` });
        this.aggregate.push({ $replaceRoot: { newRoot: `$${field}` } });
        return this;
    }
    
    public join (rule: AggregateJoinRule): AggregateBuilder {
        if (!rule.from || !rule.localField || !rule.foreignField || !rule.asField) {
            throw new IllegalArgumentError('invalid join rule');
        }
        this.aggregate.push({ $lookup: { from: rule.from, localField: rule.localField, foreignField: rule.foreignField, as: rule.asField } });
        this.aggregate.push({ $unwind: `$${rule.asField}` });
        return this;
    }

    public joinOptional (rule: AggregateJoinRule): AggregateBuilder {
        if (!rule.from || !rule.localField || !rule.foreignField || !rule.asField) {
            throw new IllegalArgumentError('invalid join rule');
        }
        this.aggregate.push({ $lookup: { from: rule.from, localField: rule.localField, foreignField: rule.foreignField, as: rule.asField } });
        this.aggregate.push({ $unwind: {path: `$${rule.asField}`, preserveNullAndEmptyArrays: true} }); 
        return this;
    }

    public unwind (field: string): AggregateBuilder {
        this.aggregate.push({ $unwind: `$${field}` })
        return this;
    }

    public limit (limit: number): AggregateBuilder {
        this.aggregate.push({ $limit: limit });
        return this;
    }

    public skip (skip: number): AggregateBuilder {
        this.aggregate.push({ $skip: skip });
        return this;
    }

    public project (rule: object): AggregateBuilder {
        this.aggregate.push({ $project: rule });
        return this;
    }

    public group (rule: object): AggregateBuilder {
        this.aggregate.push({ $group: rule });
        return this;
    }

    public build () {
        return this.aggregate;
    } 
}
