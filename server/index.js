const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('./utils/MongooseUtil.js');

const app = express();
const PORT = process.env.PORT || 3000;
const adminBuildPath = path.resolve(__dirname, '../client-admin/build');
const customerBuildPath = path.resolve(__dirname, '../client-customer/build');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// '/admin' serves the client-admin production build.
app.use('/admin', express.static(adminBuildPath));
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(adminBuildPath, 'index.html'));
});

// '/' serves the client-customer production build.
app.use('/', express.static(customerBuildPath));
app.get(/^(?!\/api(?:\/|$)|\/hello$).*/, (req, res) => {
  res.sendFile(path.join(customerBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
