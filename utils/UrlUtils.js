import {Alert} from "react-native";

export class UrlUtils {
    static extractUserDataFromQrLoginUrl(url) {
        // https://some-url.domain/api/login-qr?userId=john@doe.com&token=9345rjfe98uyrst809we4
        const urlParts = url.split('/');
        const urlPartsSliced = urlParts.slice(2); // Remove https and empty string

        const API_URL = process.env['API_URL'];
        const apiAddress = API_URL.substring(API_URL.lastIndexOf('/') + 1); // name and domain only

        const urlCheckCriteria = [apiAddress, 'api', 'login-qr', 'userId', 'token'];
        if (this.checkIfUrlContainsKeywords(urlPartsSliced, urlCheckCriteria)) {
            const lastPart = urlPartsSliced.pop(); // login-qr?userId=john@doe.com&token=9345rjfe98uyrst809we4
            const queryIndex = lastPart.indexOf('?');

            if (queryIndex !== -1) {
                const query = lastPart.substring(queryIndex + 1); // userId=john@doe.com&token=9345rjfe98uyrst809we4
                const queryPairs = query.split('&'); // ['userId=john@doe.com', 'token=9345rjfe98uyrst809we4]
                if (queryPairs.length === 2) {
                    // Extract userId and token
                    const userIdPair = queryPairs.filter(pair => pair.includes('userId'))[0];
                    const userId = userIdPair.split('=')[1];
                    const tokenPair = queryPairs.filter(pair => pair.includes('token'))[0];
                    const token = tokenPair.split('=')[1];
                    return {userId, token};
                }
            }
        }
        return null;
    }

    /**
     * @param {string[]} urlParts Parts of sliced URL
     * @param {string[]} keywords Array with keywords that URL should contain
     * @return boolean
     */
    static checkIfUrlContainsKeywords(urlParts, keywords) {
        let matches = 0;

        keywords.forEach(keyword => {
            if (!!urlParts.find(part => part.includes(keyword))) {
                matches++;
            }
        });

        return matches === keywords.length;
    }
}