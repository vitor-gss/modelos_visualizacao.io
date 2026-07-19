import axios from 'axios';

export interface NodeData{
    name:string;
    probability: number;
}

export interface ListOfData {
    names:string[];
    probabilities: number[];
}
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

export const getNetworkData = async (netId: number): Promise<ListOfData> => {
    const response = await api.get<NodeData[]>(`http://127.0.0.1:8000/api/network/${netId}`);
    const data =  response.data;
    const filteredData = data.filter(item => !item.name.startsWith('CP'));
    const names = filteredData.map(item => item.name);
    const probabilities = filteredData.map(item => {
        return parseFloat((item.probability * 100).toFixed(2));
    });
    
    console.log(names, probabilities);
    return { names, probabilities };
}