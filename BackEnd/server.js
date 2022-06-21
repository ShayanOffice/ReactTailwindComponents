const { router: filtersRouter } = require('./filters');
const { router: pagingsRouter } = require('./pagings');
const { router: sortingsRouter } = require('./sort');
const cors = require('cors');
const express = require('express');

const localPort = 5000;
const app = express();

app.use(express.json());
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json('I am working correctly.');
});

app.use('/api/monitors', require('./routes/monitors'));
app.use('/api/lov', require('./routes/lov'));
app.use('/api/filters', filtersRouter);
app.use('/api/pagings', pagingsRouter);
app.use('/api/sort', sortingsRouter);

app.listen(localPort, () => {
  console.log(`Server listening on port ${localPort}...`);
});
