import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
    const router = useRouter();
    const [dataPath, setDataPath] = useState('');

    const handleSetDataPath = (path) => {
        setDataPath(path);
    };

    const handleNavigate = () => {
        router.push({
            pathname: '/show-log-entries',
            query: { dataPath },
        });
    };

    return (
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gray-100 min-h-screen">
            <div className="bg-white text-black rounded-2xl shadow-2xl flex w-full md:w-2/3 max-w-4xl">
                {/* Left Section */}
                <div className="w-full md:w-3/5 p-5 flex flex-col items-center justify-center relative overflow-y-auto mt-16 mb-16">
                    <div className="flex items-center justify-center w-full mb-10 mt-20">
                        <h2 className="text-3xl font-bold">Choose Data</h2>
                    </div>
                    <div className="border-b-2 w-10 border-black mb-10"></div>
                    <div className="inline-flex rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white mb-20 mt-2">
                        <button
                            onClick={() => handleSetDataPath('telemetry.txt')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white dark:border-gray-700"
                        >
                            Telemetry
                        </button>
                        <button
                            onClick={() => handleSetDataPath('asterix.txt')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white dark:border-gray-700"
                        >
                            Asterix
                        </button>
                        <button
                            onClick={() => handleSetDataPath('adsp.txt')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white dark:border-gray-700"
                        >
                            ADSP
                        </button>
                    </div>
                </div>
                {/* Right Section - Actions */}
                <div className="w-full md:w-2/5 bg-black text-white rounded-tr-2xl rounded-br-2xl flex flex-col items-center justify-center py-10 px-12">
                    <div className="flex items-center justify-center w-full mb-10">
                        <h2 className="text-3xl font-bold">Actions</h2>
                    </div>
                    <div className="border-b-2 w-10 border-white mb-12"></div>
                    <div className="space-y-4">
                        <button
                            onClick={handleNavigate}
                            className="w-full inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-transparent rounded-md hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                        >
                            Parse Logs
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
