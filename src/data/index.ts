import {Data} from "./type";
import {headers, serverLink} from "./server";

export async function fetchData(): Promise<Data['submissions']> {
    const data = await (await fetch(`${serverLink}/get_json`, {method: 'POST', headers})).json();
    console.log(data)
    return Object.values(data).map((e: any) => ({
        name: e.project_name,
        accuracy: e.accuracy,
        emissions: e.emissions,
        score: Number((e.accuracy / e.emissions).toFixed(3)),
    })) as Data['submissions']
}