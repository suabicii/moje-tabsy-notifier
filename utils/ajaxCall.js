import {API_URL} from "@env";

export const ajaxCall = async (method, route, body) => {
    try {
        const response = await fetch(`${API_URL}/api/${route}`,{
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};