const express = require('express');
require('dotenv').config();
const app = express();

const xpairRoutes = require('./routes/xpairRoutes');
app.use(express.json());
app.use('/api', xpairRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
