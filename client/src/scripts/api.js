import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});


api.interceptors.request.use(async config => {
/*
1. Sprawdza czy masz access token w localstorage, jeśli nie to cię odsyła na /refresh_token
2. Sprawdza czy access token jest valid po przez użycie jwtDecode i sprawdzenia daty w tokenie z obecną datą, jeśli nie to cię odsyła na /refresh_token
3. Jeśli wynik z funkcji zajmującej się komunikacją z /refresh_token jest poprawny to tworzy string w postaci 'Bearer ' + accessToken i następnie podczepa do configu i puszcza dalej,
   Jeśli jest niepoprawny nie tworzy stringu i nie dodaje go do configu
4. Zwraca config
*/
}, (error) => {
    return Promise.reject(error);
})


export default api;