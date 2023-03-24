import {Data} from "./type";
import {headers, serverLink} from "./server";

export async function fetchData(): Promise<Data['submissions']> {
    const data = await (await fetch(`${serverLink}/get_json`, {method: 'POST', headers})).json();

    return Object.values(data).map((e: any) => ({
        name: e.project_name,
        accuracy: e.accuracy,
        emissions: e.emissions,
        score: Number((e.accuracy / e.emissions).toFixed(3)),
        gpu_model: e.gpu_model,
        cpu_model: e.cpu_model
    })) as Data['submissions']
}