const MyConstants = {
  MONGODB_URI: 'mongodb://127.0.0.1:27017/shopping_online',
  DB_DATABASE: 'shopping_online',

  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || 'your_email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'YOUR_16_CHAR_GMAIL_APP_PASSWORD',

  JWT_SECRET: 'shopping_secret',
  JWT_EXPIRES: 86400000
};
module.exports = MyConstants;
