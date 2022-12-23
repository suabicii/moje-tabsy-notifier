import {generateToken} from "../../utils/tokenGenerator";

it('should properly generate token with 6 random characters', () => {
    const token = generateToken();

    expect(token.length).toBe(16);
});