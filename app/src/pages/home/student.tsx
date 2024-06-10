import { NextPage } from "next";
import styles from '../../styles/Home.module.css'; // Assuming you have CSS module support

const HomeIndex: NextPage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1>Create A Student Account</h1>
                <p>Please Enter Info</p>
                <a href="#get-started" className={styles.cta}>Name</a>
            </header>
            <footer className={styles.footer}>
                <button>Sign Up</button>
            </footer>
        </div>
    );
}

export default HomeIndex;