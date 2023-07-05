const API_URL = process.env['API_URL'];

export const ajaxCall = async (method, route, {body, customApiUrl} = {}) => {
    try {
        const options = {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const apiUrl = customApiUrl || API_URL;
        const response = await fetch(`${apiUrl}/api/${route}`, options);
        const responseType = response.headers.get("content-type");
        return responseType === 'application/json' ? response.json() : response;
    } catch (err) {
        console.log(err);
    }
};