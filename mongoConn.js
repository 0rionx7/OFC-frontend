import mongoose from 'mongoose';

try {
  mongoose.set('strictQuery', false); // if true only the fields that are specified in the Schema will be saved
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@mean.c0rsp.mongodb.net/${process.env.ADAPTER_DB}?retryWrites=true&w=majority`
  );
  console.log('🌎 Connection to AdapterDb Succesfull! 🌎');
} catch (err) {
  console.log('🌞 Connection to MongoDB failed', err);
}

export const defaultConnection = mongoose.connection;

export const adapterCollection = defaultConnection.collection(
  process.env.ADAPTER_COLLECTION
);
try {
  adapterCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 60, background: true }
  );
} catch (error) {
  console.log('🌞 SocketDb Create index error!!!', error);
}

defaultConnection.on('error', err => {
  console.log('🌞 Db error', err);
});
defaultConnection.on('disconnected', () => {
  console.log('🌞 Disconnected from Db!!!');
});
