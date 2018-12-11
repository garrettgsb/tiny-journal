const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'tinyJournal';
const mongo = new MongoClient(dbUrl);

const entries = [
  {
    title: "I learned callbacks today",
    author: "Garrett",
    content: "Actually, not strictly true. I knew callbacks already from things like `.map`. But today, I learned to use them to write asynchronous code with the Mongo client.",
  },
];

mongo.connect((err, mongo) => {
  if (err) throw err;
  mongo.db(dbName).collection('entries').insert(entries, (err, result) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(result);
    mongo.close();
  });
});
