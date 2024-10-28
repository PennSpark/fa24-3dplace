const mongoose = require('mongoose');
const uri = process.env.dbURI || 'mongodb://localhost:27017/3dPaint';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const dbConnect = mongoose.connection;
dbConnect.once('open', () => {
    console.log('Connected to MongoDB');
  });

dbConnect.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

export default dbConnect;