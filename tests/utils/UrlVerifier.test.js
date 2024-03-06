import {UrlVerifier} from "../../utils/UrlVerifier";
import {Alert} from "react-native";

const alert = jest.spyOn(Alert, 'alert').mockImplementation(msg => console.log(msg));

describe('verifyQrLoginUrl', () => {
    it('should pass if url is correct', () => {
        const userId = 'john@doe.com';
        const token = '30r9efhj8';

        UrlVerifier.verifyQrLoginUrl(`${process.env['API_URL']}/api/login-qr?userId=${userId}&token=${token}`);

        expect(alert).toBeCalledWith(`userId: ${userId}; token: ${token}`);
    });

    it('should fail if url is not correct', () => {
        UrlVerifier.verifyQrLoginUrl('https://incorrect.url/api/xyz');

        expect(alert).toBeCalledWith('Nieprawidłowy URL');
    });
});