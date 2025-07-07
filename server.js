const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
 
app.post('/initiate-payment', async (req, res) => {
    try {
        const response = await axios.post(
            "https://eu-gateway.mastercard.com/api/rest/version/80/merchant/TEST7008334/session",
            req.body,
            {
                headers: {
                    Authorization: "Basic " + Buffer.from("merchant.TEST7008334:8535609f374c4f8486bbf45d0bd09e88").toString('base64'),
                    "Content-Type": "application/json",
                },
            }
        );
 
        res.json(response.data);
    } catch (error) {
        console.error("Error sending request to Mastercard API:", error);
        res.status(500).json({ error: "Failed to initiate payment. Please try again later." });
    }
});
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});