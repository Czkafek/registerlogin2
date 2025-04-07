import styles from './LoginRegister.module.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/register")
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])

    const fetchAPI = async () => {
        try {
            const response = await axios.post('http://localhost:3000/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            console.log(response);
            //navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchAPI();
    }

    const handleChange = (e) => {
        setFormData(data =>
        ({...data, [e.target.name]: e.target.value}));
    }
    
    return <div className={styles.container}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <p>Username</p>
            <input value={formData.username} onChange={handleChange} name='username' type="text" placeholder='Username' />
            <p>Email</p>
            <input value={formData.email} onChange={handleChange} name='email' type="text" placeholder='Email' />
            <p>Password</p>
            <input value={formData.password} onChange={handleChange} name='password' type="text" placeholder='Password' />
            <button>Register</button>
            <Link to='/login'><p className={styles.question}>Already have an account? Login</p></Link>
            <p className={styles.error}>Error: {error ? error : 'no error'}</p>
        </form>
    </div>
}

export default RegisterPage;