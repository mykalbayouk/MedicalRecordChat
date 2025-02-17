'use client';
import React from 'react';
import Link from 'next/link';

const StartPage: React.FC = () => {


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
            <h1 className="text-8xl font-bold mb-8">Welcome to The Demo</h1>
            <p className="text-lg text-center mb-6">Have the AI anaylze your Medical Record</p>
            <Link href="/addfile">
            <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Get Started
            </button>
            </Link>
        </div>
    );
};

export default StartPage;