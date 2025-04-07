import styles from './LoginRegister.module.css'
import { useState } from 'react';
import { Link } from 'react-router-dom'

function LoginPage() {

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return <div className={styles.container}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <p>Login</p>
            <input type="text" placeholder='Login' />
            <p>Password</p>
            <input type="text" placeholder='Password' />
            <button>Login</button>
            <Link to='/register'><p className={styles.question}>Don't have account yet? Register</p></Link>
            <p className={styles.error}>Error: {error ? error : 'no error'}</p>
        </form>
    </div>
}

export default LoginPage;