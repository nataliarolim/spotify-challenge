'use client'

import { useEffect, useState } from "react";
import { ProfileInterface } from '@/app/lib/profile.type';

const Profile = () => {
    const [userData, setUserData] = useState<ProfileInterface | null>(null);
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/me');
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                console.log(data, 'data');
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">Profile</h1>
            <div className="mt-4">
                <h2 className="text-xl">{userData?.display_name}</h2>
                <img src={userData?.images[0]?.url} alt={userData?.display_name} className="rounded-full w-32 h-32" />
                <p>Email: {userData?.email}</p>
            </div>
        </div>
    );

}

export default Profile;