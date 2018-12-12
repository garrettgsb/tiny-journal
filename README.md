# A Simple Introduction to Data Persistence with MongoDB

To learn about Mongo, we are going to play around with this simple journaling app, built in Express. In the beginning, the app stores all data in memory. When the server stops, the data disappears. We want to refactor it to use a database for data storage, because a journal that deletes your entries every time you go away is not much of a journal at all.

First, we create some script files that add **seed data** to the database. It will be useful to work with a database that is not empty.

Then, we will create the connection between MongoDB and Express. When an HTTP request is made, instead of looking up and modifying an in-memory object, our code will make calls to the Mongo database.

## Tags

This repository uses tags to show the app in different states of development. This README will call out the points for a **CONTEXT SWITCH**, telling you which tag to check out and when. To see the app in each state, type `git checkout tag-name`, where `tag-name` is the name of one of the tags below:

* `volatile-memory` - Before introducing Mongo at all-- Tiny Journal works, but it does not persist data at all. When the server stops, everything resets.
* `seed-examples` - Seed files demonstrating a basic Mongo insert using Promises (`seedDb-promises.js`), callbacks (`seedDb-callbacks.js`), and async/await (`seedDb-async-await.js`).
* `mongo-with-express` - The whole Express server rebuilt to use Mongo to store data, instead of a silly in-memory object.
* `mongo-helpers` - A demonstration of how one might DRY out their database code and/or make it more readable by abstracting the calls to Mongo out to helper functions.

To see the code changes made between two tags, use `git diff tag1 tag2`.

## Setup

Install the node modules using the package manager of your choice. All of the packages necessary are in the `package.json` from the start, so you should only need to do this once:

```
yarn install
npm install
```

You will also need a Mongo server running on port 27017 (or you'll need to modify the database URL yourself). If you can access the Mongo shell with the `mongo` command in bash, you're set. (From the Mongo shell, type `quit()` to exit)

To start the server with `nodemon`, in the project directory, execute one of:

```
yarn go
npm run go
```

Then visit Tiny Journal by directing your favorite browser to `localhost:8080`.


## TL;DR:

**Data Persistence**

* Storing data in memory only is foolhardy
* **Persisting** data means it doesn't go away just because your application process has terminated
* For static data that doesn't change too much, files are great. Try JSON.
* A Database Management System (or **DBMS**) is special software that handles large volumes of reads and writes
* You can use a DBMS directly (through its shell/console) or through another app (like an Express server)
* We will have a DBMS server running alongside our web server

**Mongo**

* Mongo is a Document-Oriented Database
  - A document is almost the same thing as a Javascript object
* The Mongo shell is a Javascript interpreter
* The Mongo server can have many databases
  - Databases contain Collections
  - Collections contain Documents
  - Documents contain Fields

**Mongo + Node**

* Node communicates with Mongo through a **driver**
* Communication to and from the database is **asynchronous**

**Asynchrony**

* I don't know how to TL;DR asynchrony
* Here are some words: Promises. Callbacks. async/await.

**Mongo + Express**

* A client (probably a browser) asks for things from the Express server (via HTTP request)
* The Express server asks the Mongo server for things (via the Mongo driver)
* The Mongo server comes back with data
* The Express server builds a page (or a JSON object) with the data and sends it back to the Client

----------------

# A Thing That Is Annoying

> **CONTEXT SWITCH:** To get into the state described in this section, `git checkout volatile-memory`

In its first iteration, this is the workflow of Tiny Journal:

  * Start server
  * Publish some journal entries
  * Stop the server for any number of valid reasons
  * Lose all of your journal entries

That's annoying, right? The app is basically unusable in this state. Our data shouldn't go away just because the server stopped. Why does this happen, and how do we solve it?

# Data Storage: In Memory vs. On Disk

## In-memory data storage

**Pros:**
  * Fast to read
  * Fast to change
  * Exists in the process where you use it

**Cons:**
  * Temporary - Disappears when the process dies


## Persistent Data Storage

Data that is stored to disk is considered "persisted." It doesn't disappear when the process ends, or the machine turns off. Files on your computer are persistent data. Bookmarks in your browser are persisted. Text messages on your phone are persisted.

**Pros:**
  * Doesn't die when the process dies

**Cons:**
  * More complexity
  * Not as fast as in-memory storage

# Data-Application Separation

Separating our data from the application is desirable for a few reasons:

* Application instances come and go-- Data doesn't
* Multiple applications may want to use the same data
* Keeping application logic and data separate makes maintenance easier
  - Easier to debug
  - Easier to reconfigure (Config files, feature flippers, permissioning)
  - Easier to understand

To some extent, this can be done with plain text files (e.g. JSON, YAML, CSV) as long as they aren't changed frequently.

This is a good idea for **read-only storage**. If the data changes frequently (say, more than once per second) and/or if the dataset is large (say, >50 MB), this plan starts to feel heavy. Why?

----------------

# A Bad Plan for Persisting Data

We could save every journal entry to a plain text file as one big JSON object or something, and then read it when the server starts. Every time something changes, you could write the new state of the data object to the file again.

What are the disadvantages of this approach?

# A Better Plan for Persisting Data

A **DBMS**, or **Database Management System** is a powerful software application designed to alleviate these storage constraints. What would we want from such a system?

1) We want data to persist
2) We want to have smart interactions (queries) for our data
3) We want multiple applications to be able to use our data

A DBMS serves our purpose much better than plain text files can. That's the good news. The bad news is that they add a significant layer of complexity to our app.

# A Document-Oriented Database

Today, we're going to talk specifically about **MongoDB**. Mongo is a document-oriented database, which to most people means "It's not a relational database," which to most people means "It's not a SQL database."

**Document-Oriented Database Key Terms**

* Document
* Field
* Collection
* Database
* Schema

For an app like Tiny Journal, we would expect to find something like:
  * A **database** called `tinyJournal` or `tiny-journal`
  * **Collections** called things like `entries` and `users`
  * The `entries` **collection** would contain **documents** that have **fields** like `author`, `title`, and `content`
  * No **schema** anywhere in sight

# The Mongo Server

Mongo runs a server on your machine (or on some other machine), much like Node/Express runs on your machine. The command to start the server (if it isn't running already) is `mongod`. Don't get this confused with `mongo`, which opens the Mongo shell.

# The Mongo Shell

The Mongo shell lets you interact with the database directly, using command line Javascript. To access the Mongo shell, just type `mongo`. To quit, invoke the `quit()` function.

To see some of the things that you can do in the Mongo shell, pulling up a cheat sheet is helpful:

https://www.opentechguides.com/how-to/article/mongodb/118/mongodb-cheatsheat.html

But here are some commands to play with:

| Command | Behavior |
|:--------|:---------|
| `show dbs` | Show all of the databases on this Mongo server |
| `use tinyJournal` | Connect to the database called tinyJournal, creating it if it doesn't exist
| `show collections` | Show all of the collections in the current database
| `db.nameOfACollection.find()` | Show every document in a collection |
| `db.dropDatabase()` | Erase the whole database (careful) |

## CRUD

Tiny Journal has a collection called entries. To do CRUD stuff to an entry, try the following commands:

| Command | Behavior |
|:--------|:-------- |
| `db.entries.insert()` | Takes an object as a paremter and inserts it into `entries` as a document (works with arrays, too) |
| `db.entries.find()` | With no parameters, returns every document in the collection |
| `db.entries.find({ author: 'Garrett' })` | Finds all documents where the "author" field has the value "Garrett" |

----------------

# Using Mongo with Node

Before we wire Mongo up to a web app, let's first discuss how to use it with Node. To make this happen, we need to add the MongoDB **driver** to our project.

## The MongoDB Node Driver

**What's a driver?**

* Basically just a library
* A driver is a piece of software that gives us a high-level interface to interact with another piece of software
  - Usually a database
* Each language that Mongo supports has its own driver
* Compare to: Device drivers (for a mouse, gamepad, keyboard...) for hardware
* If "driver" makes you think of cars, it's more like the steering wheel and pedals than the person doing the driving

If the project did not already have the MongoDB driver installed, we could add it with this command:

```
yarn add mongodb
npm install mongodb --save
```

## Seed the Database

"Seeding" means to put some initial data into the database, usually with a script. Why might you do that?

  * Working on a blank app is difficult and no fun
  * You want to set up some initial accounts, like admins or test users
  * You have configuration settings in the database and you want to set up their initial values
  * You have different datasets for different situations:
    - Real-looking data for demos
    - Sanitized data for internal/third-party development
    - Special purposes: Minimal data, deliberately problematic data
  * You are running automated tests, and the tests depend on a certain database state

Rather than throw away our previous mock data, we are going to use it to seed a Mongo collection. On the surface, that's a one-step task:

_Perform an `insert` into the tinyJournal database_

However, there is some technical overhead around making this possible. The reason is that we have two applications that need to communicate with each other _asynchronously_.

## A word on asynchrony

Synchronous programming means everything happens in a particular order: Step 2 can't start until Step 1 has completed.

Asynchronous programming is different. If Step 1 takes a long time, then Step 2 can start before Step 1 completes. This adds an awesome level of flexibility, but also complexity: If Step 2 relies on Step 1, care needs to be taken to make sure that Step 2 doesn't run too soon.

**Synchronous**

  * Blocking I/O
  * Mongo shell
  * Waiter standing outside of the kitchen waiting for your food
  * Starcraft: Terran and Protoss units are built synchronously

**Asynchronous**

  * Non-blocking I/O
  * Mongo driver
  * Waiter waiting other tables while your food cooks
  * Starcraft: Zerg units are built asynchronously

The tools that are used in Javascript to manage asynchrony are:

  * Promises
  * Callbacks
  * async/await

We'll work primarily with **Promises**, but we'll have a look at all three.

## Building our seed script

> **CONTEXT SWITCH:** To see the full seed scripts, `git checkout seed-examples`.

Our seed script's job is fairly straightforward: Insert a handful of documents into one collection. A bunch of things need to come together to make that happen. We need to:
  * Use the Mongo driver to connect Node to the Mongo server
  * Create an **instance** of the Mongo Client (What does "client" mean?)
  * Open a **connection** between the Mongo client and Mongo server
  * Do some CRUD stuff (a Create, or `.insert()` in this case)
  * Close the connection to the Mongo server

Optionally, we may want to drop the database before seeding, either in the Mongo shell:

```
use tinyJournal
db.dropDatabase();
```

...Or in the seed script, before (not after!) inserting the seed data:

```
mongo.db(dbName).dropDatabase();
```


### Boilerplate

We are going to do three versions of the seed script. This code is the same for all three, and must precede the other stuff.

```
const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'tinyJournal';
const mongo = new MongoClient(dbUrl);

const entries = [
  {
    title: "🌱",
    author: "Johnny Mongoseed",
    content: "I'll see you in the Mongo console!"
  }
]
```

All of our interaction with Mongo will be performed through the `MongoClient` object that we've just instantiated, and stored in the `mongo` variable.

### Promise Version

See: `seedDb-promises.js`

```
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
```

### Callback Version

See: `seedDb-callbacks.js`

```
mongo.connect((err, mongo) => {
  if (err) throw err;
  mongo.db(dbName).collection('entries').insertMany(entries, (err, result) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(result);
    mongo.close();
  });
});
```

### async/await Version

```
async function seed() {
  await mongo.connect();
  const results = await mongo.db(dbName).collection('entries').insertMany(entries);
  // eslint-disable-next-line no-console
  console.log(results);
  mongo.close();
}

seed();
```

In the final version of the app, we have just one file called `seedDb`, which uses "real" (or real-looking) data to populate the database using the Promise method.

--------

# Connecting Mongo to Express

> **CONTEXT SWITCH:** To see the final seed file and the Express server connecting to Mongo, `git checkout mongo-with-express`

Finally, we're ready for Mongo and Express to meet. We know all of the tools now-- The hard part is designing how they fit together.

> **Question:** When do we want Mongo to make a query?

For our seed file, the answer is simple: "When we run the script from the command line." But that answer doesn't work for a web server. When do we want our Express app to tell Mongo to make a query?

> **Answer:** When a client asks it to.

The client (probably a browser) asks the server to do things via HTTP requests (which is why they're called requests). The routes that the server provides tell the user what things it can ask for. The server decides for itself how it fulfills those requests: Before, each request implied a data lookup in an in-memory object. Now, it implies a query made to Mongo. Using this app as an example:

| Route | Asks to... | Implicit data query |
|:--------|:---------|:--------------------|
| GET / | List every entry by title and author, with links to their content | Find every document in the `entries` collection |
| GET /entries/:id | Show the details for the entry with ID `:id` | Find the document with ID `:id`|
| GET /entries/:id/edit | Same as above, but with the data in text fields | Same as above |
| POST /entries | Submit a new entry | Insert a new entry into the database |
| POST /entries/:id | Make changes to the entry with ID `:id` | Update the document with ID `:id` |


The full cycle looks like this:

* Receive an HTTP request from the web client
* Make a query
* Send a response to the web client based on the results

Here is how the basic GET looks for the home route:

```
App.get('/', (req, res) => {
  db.collection('entries').find().toArray()
  .then(result => res.render('index', { entries: result }));
});
```

> **NOTE:** Mongo's `.find()` method doesn't return an array-- It returns something called a **cursor**. To use the data, we need to convert it to an actual array using `.toArray()`. We don't have that problem using `.findOne()`

Note where the HTTP response (`res.render`) happens: If it relies on data from the database, then it _must_ occur as a consequence of the database query. This is because, again, the database query is _asynchronous_.

How can we extend this pattern to serve the remaining routes in the app?

# Mongo Helpers

> **CONTEXT SWITCH:** To see the Express server with a sample Mongo helper method, `git checkout mongo-helpers`

Of course, filling our routes with Mongo code will get messy, especially once queries start becoming complex. To build a more feature-rich app, we would want to wrap some of this complexity in helper functions.

We can abstract out our calls to Mongo into a named function, and then use that function in our route. For example, to make our `GET /` route more readable, we might write a function like this:

```
function indexEntries() {
  return db.collection('entries').find().toArray();
}
```

Now, our route can change from this:

```
App.get('/', (req, res) => {
  db.collection('entries').find().toArray()
  .then(result => res.render('index', { entries: result }));
});
```

To a much more readable one-liner:

```
App.get('/', (req, res) => indexEntries().then(result => res.render('index', { entries: result })));
```

This way, a future developer (who might be you!) can easily glance at the route and know that its job is to index the entries. If you don't like the word "index," you could just as happily call it something like `getEntries()` or `getAllEntries()`. In any case, it saves you the trouble of needing to carefully read database code to determine what data a particular route uses-- **The method name communicates the intent.** That's important enough to call out for someone just skimming:

> **The method name communicates the intent.**

Another simple example would be to notice that our `entries/show` and `entries/edit` views require the same data: A single entry. If we capture the `findOne` query in a function, we can use it for both routes:

```
function findEntry(id) {
  return db.collection('entries').findOne({ _id: new ObjectId(id) });
}

App.get('/entries/:id', (req, res) => findEntry(req.params.id).then(result => res.render('entries/show', { entry: result })));
App.get('/entries/:id/edit', (req, res) => findEntry(req.params.id).then(result => res.render('entries/edit', { entry: result } )));
```

Could we DRY this out even further?


# Fun Links:

* Cool cheat sheet with a fun typo in the URL: https://www.opentechguides.com/how-to/article/mongodb/118/mongodb-cheatsheat.html

* All the docs you could want: https://mongodb.github.io/node-mongodb-native/
