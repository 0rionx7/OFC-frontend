import mongoose from 'mongoose';

try {
  mongoose.set('strictQuery', false); // if true only the fields that are specified in the Schema will be saved
  await mongoose.connect(
    `mongodb+srv://orionx7:i7HxupA9otqHGDWo@testcluster.t3fpgoc.mongodb.net/AdapterDb?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  console.log('🌎 Connection to AdapterDb Succesfull! 🌎');
} catch (err) {
  console.log('🌞 Connection to AdapterDb failed', err);
}

export const defaultConnection = mongoose.connection;

export const adapterCollection = defaultConnection.collection('socketEvents');
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
