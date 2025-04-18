import styles from './Protected.module.css'
import { useState, useEffect } from 'react';
import api from '../../scripts/api.js'
import { useNavigate } from 'react-router-dom';

function ProtectedPage() {

    const navigate = useNavigate();

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/protected', {}, {withCredentials: true});
                console.log(response);
                setData(response.data)
            } catch (err) {
                console.log(err);
                navigate('/login');
            }
        };
        fetchData();
    }, [])

    return <div className={styles.gridContainer}>
        <h1>Protected Page</h1>
        <div className={styles.grid}>
            {data.map((element, index) => {
                return <div key={index} className={styles.row}>
                    <p>{element.username}</p>
                    <p>{element.password}</p>
                    <p>{element.email}</p>
                </div>
            })}
        </div>
    </div>
}

export default ProtectedPage;