const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb+srv://kavalipavan22_db_user:xcZralnr5FfFgef3@cluster0.xahawaa.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  tls: true,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

(async () => {
  try {
    await client.connect();
    console.log('connected');
    const doc = await client.db(process.env.MONGODB_DB || 'kavalipavan22_db_user').collection('users').findOne();
    console.log('doc', doc);
  } catch (err) {
    console.error('error', err);
  } finally {
    await client.close();
  }
})();
