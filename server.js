const Express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const App = Express();
const BodyParser = require('body-parser');
const PORT = 8080;


const DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'tinyJournal';
const mongo = new MongoClient(DB_URL);
let db;

// Express Configuration
App.set('view engine', 'ejs');
App.use(BodyParser.urlencoded({ extended: false }));
App.use(Express.static('public'));

// Mongo Helpers
function findEntry(id) {
  return db.collection('entries').findOne({ _id: new ObjectId(id) });
}

function indexEntries() {
  return db.collection('entries').find().toArray();
}

// GET Routes
App.get('/', (req, res) => indexEntries().then(result => res.render('index', { entries: result })));

App.get('/entries', (req, res) => res.redirect('/'));
App.get('/entries/new', (req, res) => res.render('entries/new'));

App.get('/entries/:id', (req, res) => findEntry(req.params.id).then(result => res.render('entries/show', { entry: result })));
App.get('/entries/:id/edit', (req, res) => findEntry(req.params.id).then(result => res.render('entries/edit', { entry: result } )));


// POST Routes
App.post('/entries', (req, res) => db.collection('entries').insert(req.body).then(res.redirect('/')));

App.post('/entries/:id', (req, res) => {
  db.collection('entries')
  .update(
    {_id: new ObjectId(req.params.id)},
    req.body,
  )
  .then(() => res.redirect(`/entries/${req.params.id}`));
});


// Can't forget this buddy
mongo.connect().then(() => {
  db = mongo.db(DB_NAME);
  App.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Tiny Journal seems to be listening on port ${PORT} so that's pretty good 👍`);
  });
});
