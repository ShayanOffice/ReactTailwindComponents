const { router: LogsRouter } = require('./routes/logs');
const { router: filtersRouter } = require('./filters');
const { router: pagingsRouter } = require('./pagings');
const { router: sortingsRouter } = require('./sort');
const cors = require('cors');
const express = require('express');

const localPort = 5000;
const app = express();

app.use(express.json());
const corsOptions = {
  //   origin: ["http://localhost:3000"],
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json('I am working correctly.');
});

app.use('/api/users', require('./routes/users'));
app.use('/api/provinces', require('./routes/provinces'));
app.use('/api/computers', require('./routes/computers'));
app.use('/api/monitors', require('./routes/monitors'));
app.use('/api/scanners', require('./routes/scanners'));
app.use('/api/printers', require('./routes/printers'));
app.use('/api/telephones', require('./routes/telephones'));
app.use('/api/lov', require('./routes/lov'));
app.use('/api/logs', LogsRouter);
app.use('/api/filters', filtersRouter);
app.use('/api/pagings', pagingsRouter);
app.use('/api/sort', sortingsRouter);

app.listen(localPort, () => {
  console.log(`Server listening on port ${localPort}...`);
});
