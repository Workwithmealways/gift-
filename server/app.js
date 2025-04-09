const express = require('express');
const cors = require('cors');
const suggestionsRoute = require('./routes/suggestions');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(suggestionsRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
