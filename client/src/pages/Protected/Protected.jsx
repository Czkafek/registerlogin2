import styles from './Protected.module.css'

function ProtectedPage() {
    return <div className={styles.gridContainer}>
        <h1>Protected Page</h1>
        <div className={styles.grid}>
            <div className={styles.row}>
                <p>Username</p>
                <p>Password</p>
                <p>Email</p>
            </div>
            <div className={styles.row}>
                <p>Username</p>
                <p>Password</p>
                <p>Email</p>
            </div>
            <div className={styles.row}>
                <p>Username</p>
                <p>Password</p>
                <p>Email</p>
            </div>
        </div>
    </div>
}

export default ProtectedPage;