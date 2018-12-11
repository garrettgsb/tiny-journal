const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'tinyJournal';
const mongo = new MongoClient(dbUrl);

const entries = [
  {
    title: "I learned Promises today",
    author: "Garrett",
    content: "Promises are cool because of how easy they are to chain, and pass around like first-class values.",
  },
];

mongo.connect()
  .then(() => {
    return mongo.db(dbName).collection('entries').insert(entries);
  })
  .then(result => {
    // eslint-disable-next-line no-console
    console.log(result);
    mongo.close();
  })
  .catch(err => { throw err; });
