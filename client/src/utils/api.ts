import axios from "axios";
import LocalStorage from "./localStorage";

interface IRequest {
    method: string,
    body: any,
    params: any
}

export const instance = axios.create({
    baseURL: 'https://upquizversionone.herokuapp.com/api/',
    timeout: 5000,
})

export const request = async ({ method = "GET", body, params }: IRequest) => {
    const token: string | null = LocalStorage.getSimple('profile') ? LocalStorage.get('profile').token : null;
    try {
        const res = await instance({
            method,
            ...(body && { data: body }),
            ...(params && { params }),
            headers: {
                'Authorization': "JWT " + token,
                'Content-Type': 'application/json',
                'accept': 'application/json',
            }
        })

        return res;
    } catch (e: any) {
        return e;
    }
}