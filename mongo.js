const HOST = 'localhost';
const PORT = 27017;
const NEW_DB_NAME = 'mongo-script-playground';

const connection = new Mongo(`${HOST}:${PORT}`);

function printResult(cursor) {
  while (cursor.hasNext()) {
    printjson(cursor.next());
  }
  print('');
}

print('');

let db, cursor;

db = connection.getDB(NEW_DB_NAME);

db.dropDatabase(); // to start from scratch

db.createCollection('users');

db.users.insertMany([
  {
    _id: 1,
    name: 'Natasha',
    gender: 'f'
  },
  {
    _id: 2,
    name: 'Mario',
    gender: 'm'
  },
  {
    _id: 3,
    name: 'Lebowski',
    gender: 'm'
  }
]);

print('list all users:');
print('query: db.users.find({})\n');

printResult(db.users.find({}));

print('change user 2\'s name to Luigi');
print(`query: db.users.updateOne({ _id: 2 }, { $set: { name: 'Luigi' } })\n`);

db.users.updateOne({ _id: 2}, { $set: { name: 'Luigi' }});

printResult(db.users.find({ _id: 2 }));

print('list all users, but show only name, and sort alphabettically');
print(`query: db.users.find({}, {name: 1, _id: 0}).sort({ name: 1 })\n`);

printResult(db.users.find({}, {name: 1, _id: 0}).sort({ name: 1 }));

print('');

print('list all female users');
print(`query: db.users.find({ gender: 'f' })\n`);

printResult(db.users.find({ gender: 'f' }));

print('create collection tasks and populate it');
db.createCollection('tasks');

db.tasks.insertMany([
  {
    title: 'urgent',
    text: 'feed the dog',
    completed: false,
    created: new Date('1985-01-24'),
    updated: new Date()
  },
  {
    title: 'reminder',
    text: 'learn mongodb',
    completed: true,
    created: new Date('1986-09-01'),
    updated: new Date()
  },
  {
    title: 'asap',
    text: 'feed the alligator',
    completed: false,
    created: new Date('1960-02-07'),
    updated: new Date()
  },
]);

printResult(db.tasks.find({}));

print('set all tasks completed to false');
print('query: db.tasks.updateMany({ completed: true }, { $set: { completed: false } })\n')

db.tasks.updateMany({ completed: true }, { $set: { completed: false } });

printResult(db.tasks.find({}, { _id:0, text:1, completed:1 }));

print('set task containing string mongo to completed true');
print('query: db.tasks.updateOne( {text: /mongo/ }, { $set: { completed: true } })\n')

db.tasks.updateOne( {text: /mongo/ }, { $set: { completed: true } });

printResult(db.tasks.find({}, { _id:0, text:1, completed:1 }));

print('delete all completed tasks');
print('query: db.tasks.deleteMany({ completed: true })\n');

db.tasks.deleteMany({ completed: true });

printResult(cursor = db.tasks.find({}, { _id:0, text:1, completed:1 }));

print('list incomplete tasks sorted by created date');
print('query: db.tasks.find({ completed: false }, { _id:0, text:1, completed:1, created: 1 }).sort({ created:1 })\n');

printResult(db.tasks.find({ completed: false }, { _id:0, text:1, completed:1, created: 1}).sort({ created:1 }));
