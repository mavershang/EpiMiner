export class SearchParam {
    maxDist: string;
    tissues: string[];

    SearchParam() {
        this.maxDist='';
        this.tissues = [];
    }

    hasValue() {
        return !(this.tissues == undefined || this.tissues.length == 0);
    }
}

