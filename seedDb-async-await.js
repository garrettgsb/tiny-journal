const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'tinyJournal';
const mongo = new MongoClient(dbUrl);

const entries = [
  {
    title: "I learned async/await today",
    author: "Garrett",
    content: "Why doesn't everybody just use async/await all the time? There are many arguments, and most (but not all) of them are dumb.",
  },
];

async function seed() {
  await mongo.connect();
  const results = await mongo.db(dbName).collection('entries').insert(entries);
  // eslint-disable-next-line no-console
  console.log(results);
  mongo.close();
}

seed();
