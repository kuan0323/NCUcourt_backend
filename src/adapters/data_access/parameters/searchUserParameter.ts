import TypeUtils from "../../../libs/typeUtils";

export class SearchUserParameter {
    public keyword: string;
    public sortBy: string;
    public role: string;

    constructor (init: Partial<SearchUserParameter>) {
        if (TypeUtils.isNotNone(init.keyword)) this.keyword = init.keyword;
        if (TypeUtils.isNotNone(init.sortBy)) this.sortBy = init.sortBy;
        if (TypeUtils.isNotNone(init.role)) this.role = init.role;
    }
}



