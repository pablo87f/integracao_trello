
export namespace ArrayUtil {
    export function removeDuplicates(myArr: Array<any>, prop: any) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
}