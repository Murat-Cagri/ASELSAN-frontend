// Function to filter log entries based on flightIDs
export const filterLogs = (logEntries = [], flightIDs = []) => {
    // Check if logEntries is an array and flightIDs is an array of strings
    if (!Array.isArray(logEntries) || !flightIDs.every(id => typeof id === 'string')) {
        throw new Error('Invalid parameters. Expected arrays.');
    }

    return logEntries.filter(log => flightIDs.includes(log.id.toString()));
};
