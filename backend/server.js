// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const formRoutes = require('./routes/formRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from frontend
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/googleForms', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// // Routes
// app.use('/api/forms', formRoutes); // Ensure routes are registered correctly

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const formRoutes = require('./routes/formRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Updated CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://bvs-form.web.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect('mongodb://localhost:27017/googleForms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// ✅ Routes
app.use('/api/forms', formRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
