import {Data} from "./type";

export async function fetchData(): Promise<Data> {
    return import('./mock.json')
}