import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post('http://localhost:5000/api/FlightLogs/filter-logs', req.body);
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
