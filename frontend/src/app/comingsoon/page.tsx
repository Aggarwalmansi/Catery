'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench } from 'lucide-react'; // A relevant and professional icon

export default function ComingSoonPage() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <div className="max-w-md">
                <Wrench className="mx-auto h-16 w-16 text-orange-500 mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Coming Soon!</h1>
                <p className="text-lg text-gray-600 mb-6">
                    We're working hard to bring you this feature. It's not quite ready yet, but it's going to be great. Stay tuned!
                </p>
                <img
                    src="https://placehold.co/600x400/fff0e6/ff8c33?text=Building+Something+Amazing"
                    alt="Under Construction"
                    className="rounded-lg shadow-lg mb-8 w-full"
                    // Fallback in case the image service is down
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Available')}
                />
                <Link
                    href="/"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 inline-block"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}

