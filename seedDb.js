const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'tinyJournal';
const mongo = new MongoClient(dbUrl);

const entries = [
  {
    title: "I saw a dog",
    author: "Garrett",
    content: "I saw a dog today at around 2:15. It was a good dog.",
  },
  {
    title: "A minor setback",
    author: "Garrett",
    content: "Today was a bad day. I poured water into my Corn Pops by accident. That kind of took the wind out of my sails, so I just went back to bed.",
  },
  {
    title: "Keys??????",
    author: "Garrett",
    content: "When do you know that you have too many keys? I only have two of them, but recently, I've been wondering if I could get by with one.",
  },
  {
    title: "Some thoughts about binoculars",
    author: "Garrett",
    content: "It's weird that we don't need binoculars more often. Usually, by the time we want to look at something, it's close enough to see. There was a long period of history where people would have loved binoculars but didn't have them, and now we don't need them... There was only a brief period where you would both want and be able to have binoculars.",
  },
  {
    title: "Quick update",
    author: "Garrett",
    content: "Several things happened to me today. First, I got a letter in the mail, made of paper. I hardly ever get mail. It was not interesting. Second, somebody honked at me while I was crossing the street. I think it was probably an accident, or maybe that's their way of relieving stress. Finally, my bathroom door stopped squeaking. I don't know how, but oh man am I glad for that!",
  },
];

mongo.connect()
  .then(() => {
    return mongo.db(dbName).collection('entries').insertMany(entries);
  })
  .then(result => {
    // eslint-disable-next-line no-console
    console.log(result);
    mongo.close();
  })
  .catch(err => { throw err; });
