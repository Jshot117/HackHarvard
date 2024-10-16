import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const toggleLogin = () => {
        setIsLogin(!isLogin);
        setFullName('');
        setLocation('');
        setUsername('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // existing user
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/dashboard');
            } else {
                // new user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    fullName,
                    email,
                    location,
                    username,
                    streaks: 0,
                    badges: "none",
                    carbonFootprint: 0.0,
                    points: 0
                });

                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Authentication error:", error.message);
            alert(error.message);
        }
    };

    const styles = {
        container: `min-h-screen flex items-center justify-center bg-green-50`,
        formWrapper: `w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md`,
        title: `text-2xl font-bold text-center text-green-600`,
        input: `w-full p-2 border border-gray-300 rounded-md`, 
        button: `w-full p-2 text-white bg-green-500 rounded-md hover:bg-green-600`, 
        toggleButton: `w-full text-green-500 hover:underline text-center`, 
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button
                        type="submit"
                        className={styles.button}
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <button
                    onClick={toggleLogin}
                    className={styles.toggleButton}
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}
