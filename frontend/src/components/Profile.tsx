import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
    const fetchProfile = useAuthStore((state) => state.fetchProfile);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="p-4 max-w-md mx-auto">
            <img src={user.avatar} alt="Avatar" className="rounded-full w-32 mb-4" />
            <h1 className="text-2xl">{user.name}</h1>
            <p className="text-gray-500">Осталось дней отпуска: 14</p>
        </div>
    );
};

export default Profile;
