import { Settings } from "src/Main";

export function stringToNullOrUndefined(current: string) {
    if (current === 'undefined') {
        return undefined;
    } else if (current === 'null') {
        return null
    } else {
        return current
    }
}

export function debug(settings: Settings, log: any): void {
    if (settings.debugMode) {
        console.log(log);
    }
}

// export function superDebug(settings: Settings, log: any): void {
//     if (settings.superDebugMode) {
//         console.log(log);
//     }
// }