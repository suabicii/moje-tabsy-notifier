export const generateToken = () => {
    let result = '';
    const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$^*';
    for (let i = 0; i < 16; i++) {
        result += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }
    return result;
};