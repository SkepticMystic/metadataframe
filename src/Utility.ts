export function stringToNullOrUndefined(current: string) {
    if (current === 'undefined') {
        return undefined;
    } else if (current === 'null') {
        return null
    } else {
        return current
    }
}