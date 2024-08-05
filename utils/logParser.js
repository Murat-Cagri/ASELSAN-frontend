export const parseLogFile = ({ dataPath, attributeNames, setLogEntries, setEarliestTimestamp }) => {
    fetch(`/data/${dataPath}`)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const logEntries = [];

            lines.forEach(line => {
                if (line.includes('->')) {
                    try {
                        const timestamp = extractTimestamp(line);
                        const jsonMessage = extractJsonMessage(line);
                        const attributeMaps = mapAttributes(attributeNames, jsonMessage);

                        // Check if all attributes have values
                        const allAttributesValid = Object.values(attributeMaps).every(value => value !== null && value !== undefined);

                        if (allAttributesValid) {
                            logEntries.push({ timestamp, ...attributeMaps });
                        } else {
                            console.warn('Skipping log entry due to missing attributes:', line);
                        }
                    } catch (error) {
                        console.error('Error parsing line:', line, error);
                    }
                }
            });

            if (logEntries.length > 0) {
                logEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setLogEntries(logEntries);
                setEarliestTimestamp(logEntries[0].timestamp);
            } else {
                console.warn('No valid log entries found');
                setLogEntries([]);
                setEarliestTimestamp(null);
            }
        })
        .catch(error => console.error('Error fetching log file:', error));
};

const extractJsonMessage = (line) => {
    const match = line.match(/->\s*(\{.*\})\s*$/);
    if (match) {
        return JSON.parse(match[1]);
    } else {
        throw new Error("JSON message format is incorrect");
    }
};

const extractTimestamp = (line) => {
    const match = line.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+([+-]\d{2}:\d{2})/);
    if (match) {
        return `${match[1]} ${match[2]}`;
    } else {
        throw new Error("Timestamp format is incorrect");
    }
};

const mapAttributes = (attributeNames, jsonMessage) => {
    const attributeMaps = {};
    Object.keys(attributeNames).forEach(attribute => {
        const attributeName = attributeNames[attribute];
        if (attributeName in jsonMessage['data']) {
            const value = jsonMessage['data'][attributeName];
            try {
                if (attribute === 'id') {
                    attributeMaps[attribute] = parseInt(value);
                } else {
                    attributeMaps[attribute] = parseFloat(value);
                }
            } catch (error) {
                attributeMaps[attribute] = null;
            }
        } else {
            attributeMaps[attribute] = null;
        }
    });
    return attributeMaps;
};
