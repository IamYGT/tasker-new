import React from 'react';
import { Head } from '@inertiajs/react';

export default function Test() {
    return (
        <>
            <Head title="Test Sayfası" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
                    <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                        Test Sayfası
                    </h1>
                    <p className="text-gray-600 text-center">
                        Bu bir test sayfasıdır.
                    </p>
                </div>
            </div>
        </>
    );
}