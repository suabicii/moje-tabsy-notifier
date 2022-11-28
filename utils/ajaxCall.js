import {API_URL} from "@env";

export const ajaxCall = async (method, route, body = null) => {
    try {
        const options = {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body)
        }
        const response = await fetch(`${API_URL}/api/${route}`, options);
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};