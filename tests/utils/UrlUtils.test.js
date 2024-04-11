import {UrlUtils} from "../../utils/UrlUtils";

describe('extractUserDataFromQrLoginUrl', () => {
    it('should extract user data if url is correct', () => {
        const userId = 'john@doe.com';
        const token = '30r9efhj8';

        const userData = UrlUtils.extractUserDataFromQrLoginUrl(`${process.env['API_URL']}/api/login-qr?userId=${userId}&token=${token}`);

        expect(userData).toEqual({userId, token});
    });

    it('should return null if url is not correct', () => {
        const userData = UrlUtils.extractUserDataFromQrLoginUrl('https://incorrect.url/api/xyz');

        expect(userData).toBeNull();
    });
});