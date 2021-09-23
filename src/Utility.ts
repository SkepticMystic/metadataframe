// Source: https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
export function arrayToCSV(objArray: { [key: string]: string | number }[]) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return array.reduce((str: string, next: string) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
        return str;
    }, str);
}