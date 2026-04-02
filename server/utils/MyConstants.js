const MyConstants = {
  MONGODB_URI: 'mongodb://kimtandb_user:kimtan123456@ac-fntnrcz-shard-00-00.2dzozas.mongodb.net:27017,ac-fntnrcz-shard-00-01.2dzozas.mongodb.net:27017,ac-fntnrcz-shard-00-02.2dzozas.mongodb.net:27017/?ssl=true&replicaSet=atlas-rg4po5-shard-0&authSource=admin&appName=Cluster0',
  DB_DATABASE: 'shopping_online',

  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || 'your_email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'YOUR_16_CHAR_GMAIL_APP_PASSWORD',

  JWT_SECRET: 'shopping_secret',
  JWT_EXPIRES: 86400000
};
module.exports = MyConstants;
