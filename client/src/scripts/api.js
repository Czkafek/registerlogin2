import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

const refresh_token = async () => {
    try {
        const response = await axios.post('http://localhost:3000/refresh_token', {}, {withCredentials: true});
        localStorage.setItem("accessToken", response.data.accessToken);
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


api.interceptors.request.use(async config => {
    const token = localStorage.getItem("accessToken");
    if(token && jwtDecode(token).exp < new Date().getTime() / 1000) {
        const response = await refresh_token();
        if(response.status === 200) {
            const accessToken = 'Bearer ' + response.data.accessToken;
            config.headers['Authorization'] = accessToken;
        }
    }
    else if(!token) {
        try {
            const response = await refresh_token();
            if(response.status === 200) {
                const accessToken = 'Bearer ' + response.data.accessToken;
                config.headers['Authorization'] = accessToken;
            }
        } catch (err) {
            console.error("Nie udało się odświeżyć tokena: ", error);
        }
    }
    else {
        try {
                const accessToken = 'Bearer ' + token;
                config.headers['Authorization'] = accessToken;
        } catch (err) {
            console.error("Nie udało się odświeżyć tokena: ", err);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})


export default api;