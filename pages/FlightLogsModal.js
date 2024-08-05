import React, { useEffect, useState } from 'react';

const FlightLogsModal = ({ flightID, logEntries, onClose, earliestStartTime, elapsedTime }) => {
    const [receivedLogs, setReceivedLogs] = useState([]);
    const [notReceivedLogs, setNotReceivedLogs] = useState([]);

    useEffect(() => {
        if (logEntries && earliestStartTime) {
            // Convert earliestStartTime to Date object
            const earliestTime = new Date(earliestStartTime);

            // Calculate current time based on earliest time and elapsedTime
            const currentTime = new Date(earliestTime.getTime() + elapsedTime);
            console.log(currentTime);
            // Filter received and not received logs based on flightID and time comparison
            const received = logEntries.filter(log => log.id === parseInt(flightID, 10) && new Date(log.timestamp) <= currentTime);
            const notReceived = logEntries.filter(log => log.id === parseInt(flightID, 10) && new Date(log.timestamp) > currentTime);

            setReceivedLogs(received);
            setNotReceivedLogs(notReceived);
        }
    }, [flightID, logEntries, earliestStartTime, elapsedTime]);

    const formatDateTime = (dateTime) => {
        const dateObj = new Date(dateTime);
        const year = dateObj.getFullYear();
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
        const day = ('0' + dateObj.getDate()).slice(-2);
        const hours = ('0' + dateObj.getHours()).slice(-2);
        const minutes = ('0' + dateObj.getMinutes()).slice(-2);
        const seconds = ('0' + dateObj.getSeconds()).slice(-2);
        const milliseconds = ('00' + dateObj.getMilliseconds()).slice(-3);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 text-black">
            <div className="bg-white rounded-lg p-8 max-w-md w-full h-3/4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Flight ID: {flightID}</h3>
                    <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={onClose}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mb-4">
                    <h4 className="text-md font-bold mb-2">Received Messages:</h4>
                    {receivedLogs.length > 0 ? (
                        <ul className="space-y-2">
                            {receivedLogs.map((log, index) => (
                                <li key={index} className="border-b pb-2 mb-2">
                                    <p>Timestamp: {log.timestamp}</p>
                                    <p>ID: {log.id}</p>
                                    <p>Longitude: {log.lon}</p>
                                    <p>Latitude: {log.lat}</p>
                                    <p>Speed: {log.speed}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No received messages for this flight.</p>
                    )}
                </div>
                <div>
                    <h4 className="text-md font-bold mb-2">Not Received Messages:</h4>
                    {notReceivedLogs.length > 0 ? (
                        <ul className="space-y-2">
                            {notReceivedLogs.map((log, index) => (
                                <li key={index} className="border-b pb-2 mb-2">
                                    <p>Timestamp: {log.timestamp}</p>
                                    <p>ID: {log.id}</p>
                                    <p>Longitude: {log.lon}</p>
                                    <p>Latitude: {log.lat}</p>
                                    <p>Speed: {log.speed}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No not received messages for this flight.</p>
                    )}
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Earliest Start Time: {formatDateTime(earliestStartTime)}</p>
                </div>
            </div>
        </div>
    );
};

export default FlightLogsModal;
