
create table if not exists BOOKS
(
    book_id INTEGER primary key AUTOINCREMENT,
    book_name varchar(30),
    author varchar(30),
    summary text,
    genre text
);
CREATE TABLE IF NOT EXISTS USERS
(  
   user_id INTEGER primary key AUTOINCREMENT,
   name text,
   email text UNIQUE,
   contact_number text,
   password text
);
CREATE TABLE IF NOT EXISTS LENDING
(  
   record_id integer primary key AUTOINCREMENT,
   book_id integer, 
   user_id integer, 
   date_of_lending DATE,
   date_of_return DATE,
   FOREIGN KEY(book_id) REFERENCES BOOKS(book_id),
   FOREIGN KEY(user_id) REFERENCES USERS(user_id)
);
CREATE TABLE IF NOT EXISTS ADMIN
(
   admin_id INTEGER,
   password text
);
CREATE TABLE IF NOT EXISTS LOGIN_RECORD
(
   token text primary key,
   user_id integer,
   login_time text,
   FOREIGN KEY(user_id) REFERENCES USERS(user_id)
);


