import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and registration

    const register = useAuthStore((state) => state.register);
    const login = useAuthStore((state) => state.login); // Assuming you have login function
    const error = useAuthStore((state) => state.error);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
            window.location.href = '/profile';
        } catch (error) {
            console.error(`${isLogin ? 'Login' : 'Registration'} failed:`, error);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="flex justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`p-2 w-1/2 ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`p-2 w-1/2 ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {!isLogin && (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="border p-2 w-full mb-4"
                    />
                )}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="border p-2 w-full mb-4"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border p-2 w-full mb-4"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 w-full">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;
