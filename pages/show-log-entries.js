import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client'; // Import socket.io-client library
import { parseLogFile } from '../utils/logParser';
import config from '../public/config.json';
import FlightLogsModal from './FlightLogsModal';

const ShowLogEntries = () => {
    const router = useRouter();
    const { dataPath } = router.query;
    const [logEntries, setLogEntries] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [attributeNames, setAttributeNames] = useState({});
    const [earliestTimestamp, setEarliestTimestamp] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [flightIDInput, setFlightIDInput] = useState('');
    const logsToShow = flightIDInput ? filteredLogs : logEntries;

    useEffect(() => {
        setAttributeNames({
            lat: config.lat,
            lon: config.lon,
            speed: config.speed,
            id: config.id,
        });
    }, []);

    useEffect(() => {
        if (dataPath) {
            parseLogFile({ dataPath, attributeNames, setLogEntries, setEarliestTimestamp });
        }
    }, [dataPath, attributeNames]);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prevElapsedTime => prevElapsedTime + 100); // Increment by 100 milliseconds
        }, 100); // Update every 100 milliseconds

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    const formatTime = (milliseconds) => {
        const totalSeconds = milliseconds / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const millisecondsRemaining = Math.floor((milliseconds % 1000) / 10); // Extract only two digits for milliseconds

        return `${hours.toString().padStart(3, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millisecondsRemaining.toString().padStart(2, '0')}`;
    };

    const handleFilterLogs = (input) => {
        const flightIDs = input.split(',').map(id => id.trim());
        const filtered = logEntries.filter(log => flightIDs.includes(log.id.toString()));
        setFilteredLogs(filtered);
        setFlightIDInput(input);
    };

    const handleOpenModal = (flightID) => {
        setSelectedFlight(flightID);
    };

    const handleSendData = () => {
        const socket = new WebSocket('ws://127.0.0.1:56600/websocket'); 

        socket.onopen = () => {
            console.log("Connected to socket server");

            logsToShow.forEach(entry => {
                const serializedData = JSON.stringify({
                    flightID: entry.id,
                    lat: entry.lat,
                    lon: entry.lon,
                    speed: entry.speed,
                    timestamp: entry.timestamp,
                    Type: "FIXED WING",
                    Status: "UNKNOWN",
                    DataType: "Track",
                    DeviceUnit: "A205"
                });

                socket.send(serializedData);
                console.log(`Sent data: ${serializedData}`);
            });

            console.log("Data sent successfully to socket server");
            socket.close();
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    };


    const handleReturn = () => {
        window.location.href = 'http://localhost:5000';
    };


    const renderFlightButtons = () => {
        const firstAndLastLogs = getFirstAndLastLogs();
        return (
            <div className="space-y-4">
                {Object.keys(firstAndLastLogs).map((flightID, index) => (
                    <div key={index} className="bg-gray-200 p-2 rounded-lg flex justify-between items-center">
                        <div>
                            <p>Flight ID: {flightID}</p>
                            <p>First Log Timestamp: {firstAndLastLogs[flightID].first.timestamp}</p>
                            <p>Last Log Timestamp: {firstAndLastLogs[flightID].last.timestamp}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleOpenModal(flightID)}
                                className="px-2 py-2 bg-black text-white rounded-md hover:bg-gray-900 focus:outline-none focus:bg-blue-600"
                            >
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getFirstAndLastLogs = () => {
        const firstAndLastLogs = {};
        logsToShow.forEach(log => {
            if (!firstAndLastLogs[log.id]) {
                firstAndLastLogs[log.id] = { first: log, last: log };
            } else {
                if (log.timestamp < firstAndLastLogs[log.id].first.timestamp) {
                    firstAndLastLogs[log.id].first = log;
                }
                if (log.timestamp > firstAndLastLogs[log.id].last.timestamp) {
                    firstAndLastLogs[log.id].last = log;
                }
            }
        });
        return firstAndLastLogs;
    };

    

    return (
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-gray-100 min-h-screen">
            <div className="bg-white text-black rounded-2xl shadow-2xl flex w-full md:w-2/3 max-w-4xl">
                {/* Left Section */}
                <div className="w-full md:w-3/5 p-5 flex flex-col items-center justify-center relative">
                    <div className="flex items-center justify-center w-full mb-10 mt-20">
                        <h2 className="text-3xl font-bold">Log Entries</h2>
                    </div>
                    <div className="border-b-2 w-10 border-black mb-2"></div>
                    <div className="overflow-y-auto h-72 w-full">
                        {logsToShow.length > 0 ? (
                            <div className="overflow-y-auto w-full">
                                {renderFlightButtons()}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p>No log entries available.</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Right Section - Actions */}
                <div className="w-full md:w-2/5 bg-black text-white rounded-tr-2xl rounded-br-2xl flex flex-col items-center justify-center py-10 px-12">
                    <div className="flex items-center justify-center w-full mb-10">
                        <h2 className="text-3xl font-bold">Actions</h2>
                    </div>
                    <div className="border-b-2 w-10 border-white mb-12"></div>
                    <div className="space-y-2 text-center">
                        <input
                            type="text"
                            placeholder="Enter Flight ID/s"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                            onChange={(e) => handleFilterLogs(e.target.value)}
                        />
                        <button
                            onClick={handleSendData}
                            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Send Data
                        </button>
                        <button
                            onClick={handleReturn}
                            className="w-full inline-flex items-center justify-center px-4 py-2 mt-4 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Return
                        </button>
                    </div>
                    <div className="mt-4 text-lg text-white">
                        <p className="font-mono">Time: {formatTime(elapsedTime)}</p> 
                    </div>
                </div>
            </div>
            {/* Modal Component */}
            {selectedFlight && (
                <FlightLogsModal
                    flightID={selectedFlight}
                    logEntries={logsToShow}
                    onClose={() => setSelectedFlight(null)}
                    earliestStartTime={earliestTimestamp}
                    elapsedTime={(elapsedTime)}
                />
            )}
        </main>
    );
};

export default ShowLogEntries;
