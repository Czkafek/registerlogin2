import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});


api.interceptors.request.use(async config => {
/*
1. Sprawdza czy masz access token, jeśli nie to cię odsyła na /refresh_token
2. Sprawdza czy access token jest valid, jeśli nie to cię odsyła na /refresh_token
3. Podczepia access token do configu i puszcza dalej
*/
}, (error) => {
    return Promise.reject(error);
})


export default api;