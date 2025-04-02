import styles from './LoginRegister.module.css'
import { useState } from 'react';
import { Link } from 'react-router-dom'

function RegisterPage() {
    const [error, setError] = useState('');
    
    return <>
        <h1>Register</h1>
        <form action="">
            <p>Username</p>
            <input type="text" />
            <p>Email</p>
            <input type="text" />
            <p>Password</p>
            <input type="text" />
            <button>Register</button>
            <p className={styles.error}>Error: {error ? error : 'no error'}</p>
            <Link to='/login'><p className={styles.question}>Already have an account? Login</p></Link>
        </form>
    </>
}

export default RegisterPage;