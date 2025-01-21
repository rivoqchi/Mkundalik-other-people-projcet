import { jwtDecode } from 'jwt-decode';
export const checkTokenStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token mavjud emas!');
        return { status: 'no-token', message: 'Token mavjud emas' };
    }

    try {
        const decoded = jwtDecode(token); // JWTni dekodlash
        const currentTime = Date.now() / 1000; // Hozirgi vaqt (soniyada)
    
        if (decoded.exp < currentTime) {
            console.log('Token yaroqsiz (muddati tugagan)');
            return { status: 'expired', message: 'Token muddati tugagan' };
        }
    
        console.log('Token yaroqli');
        return { status: 'valid', message: 'Token yaroqli', decoded };
    } catch (error) {
        console.log('Token noto‘g‘ri yoki buzilgan!');
        return { status: 'invalid', message: 'Token noto‘g‘ri yoki buzilgan' };
    }
};