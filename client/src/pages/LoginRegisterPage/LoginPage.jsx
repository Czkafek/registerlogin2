import styles from './LoginRegister.module.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginPage() {

    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData(data =>
        ({...data, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchAPI();
    }

    const fetchAPI = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                login: formData.login,
                password: formData.password
            }, {withCredentials: true});
            console.log(response);
            localStorage.setItem("accessToken", response.data.accessToken)
            //navigate('/protected');
        } catch (err) {
            console.log(err);
            setError(error);
        }
    }

    return <div className={styles.container}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <p>Login</p>
            <input type="text" placeholder='Login' name='login' value={formData.login} onChange={handleChange} />
            <p>Password</p>
            <input type="text" placeholder='Password' name='password' value={formData.password} onChange={handleChange} />
            <button>Login</button>
            <Link to='/register'><p className={styles.question}>Don't have account yet? Register</p></Link>
            <p className={styles.error}>Error: {error ? error : 'no error'}</p>
        </form>
    </div>
}

export default LoginPage;