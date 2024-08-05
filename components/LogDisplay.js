import React from 'react';

const LogDisplay = ({ logs }) => {
    if (!logs || !logs.length) {
        return <div>No logs to display</div>;
    }

    return (
        <div className="log-container">
            {logs.map((log, index) => (
                <div key={index} className="log-entry">
                    <p>UTC Time: {log.timestamp}</p>
                    <p>Latitude: {log.lat}</p>
                    <p>Longitude: {log.lon}</p>
                    <p>Speed: {log.speed}</p>
                    <p>ID: {log.id}</p>
                </div>
            ))}
        </div>
    );
};

export default LogDisplay;
