import styles from './LoginRegister.module.css'
import { useState } from 'react';
import { Link } from 'react-router-dom'

function LoginPage() {

    const [error, setError] = useState('');

    return <>
        <h1>Login</h1>
        <form action="">
            <p>Login</p>
            <input type="text" />
            <p>Password</p>
            <input type="text" />
            <button>Login</button>
            <p className={styles.error}>Error: {error ? error : 'no error'}</p>
            <Link to='/register'><p className={styles.question}>Don't have account yet? Register</p></Link>
        </form>
    </>
}

export default LoginPage;