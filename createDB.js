let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('users');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
  )`);

    db.run("INSERT INTO users (username, password) VALUES ('johnD@gmail.com', 'JohnDoe123')");
    db.run("INSERT INTO users (username, password) VALUES ('mattSmith@gmail.com', 'M@ttSmith448')");
});

db.close();
