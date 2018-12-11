const Express = require('express');
const App = Express();
const BodyParser = require('body-parser');
const PORT = 8080;

// The database, if you use the word "database" fairly loosely
const entries = [
  {
    id: 1,
    title: "I saw a dog",
    author: "Garrett",
    content: "I saw a dog today at around 2:15. It was a good dog.",
  },
  {
    id: 2,
    title: "A minor setback",
    author: "Garrett",
    content: "Today was a bad day. I poured water into my Corn Pops by accident. That kind of took the wind out of my sails, so I just went back to bed.",
  },
  {
    id: 3,
    title: "Keys??????",
    author: "Garrett",
    content: "When do you know that you have too many keys? I only have two of them, but recently, I've been wondering if I could get by with one.",
  },
  {
    id: 4,
    title: "Some thoughts about binoculars",
    author: "Garrett",
    content: "It's weird that we don't need binoculars more often. Usually, by the time we want to look at something, it's close enough to see. There was a long period of history where people would have loved binoculars but didn't have them, and now we don't need them... There was only a brief period where you would both want and be able to have binoculars.",
  },
  {
    id: 5,
    title: "Quick update",
    author: "Garrett",
    content: "Several things happened to me today. First, I got a letter in the mail, made of paper. I hardly ever get mail. It was not interesting. Second, somebody honked at me while I was crossing the street. I think it was probably an accident, or maybe that's their way of relieving stress. Finally, my bathroom door stopped squeaking. I don't know how, but oh man am I glad for that!",
  },
];

// Express Configuration
App.set('view engine', 'ejs');
App.use(BodyParser.urlencoded({ extended: false }));
App.use(Express.static('public'));


// Helper Functions
function findEntry(id) {
  return entries.find(entry => entry.id === Number(id));
}

function getNextId() {
  return entries.reduce((max, next) => max.id > next.id ? max.id : next.id, 0) + 1;
}


// GET Routes
App.get('/', (req, res) => res.render('index', { entries }));
App.get('/entries', (req, res) => res.redirect('/'));
App.get('/entries/new', (req, res) => res.render('entries/new'));
App.get('/entries/:id', (req, res) => res.render('entries/show', { entry: findEntry(req.params.id) }));
App.get('/entries/:id/edit', (req, res) => res.render('entries/edit', { entry: findEntry(req.params.id) } ));


// POST Routes
App.post('/entries', (req, res) => {
  const newEntry = req.body;
  newEntry.id = getNextId();
  entries.push(newEntry);
  res.redirect('/');
});


App.post('/entries/:id', (req, res) => {
  findEntry(req.params.id).content = req.body.content;
  res.redirect(`/entries/${req.params.id}`);
});


// Can't forget this buddy
App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Tiny Journal seems to be listening on port ${PORT} so that's pretty good 👍`);
});
