
create table if not exists BOOKS
(
    book_id INTEGER primary key AUTOINCREMENT,
    book_name varchar(30),
    author varchar(30),
    summary text,
    genre text,
    book_url text
);
CREATE TABLE IF NOT EXISTS USERS
(  
   user_id INTEGER primary key AUTOINCREMENT,
   name text,
   email text UNIQUE,
   contact_number text,
   password text
);
CREATE TABLE IF NOT EXISTS READING
(  
   record_id integer primary key AUTOINCREMENT,
   book_id integer, 
   user_id integer, 
   date_of_start DATE,
   date_of_end DATE,
   chapter_no text,
   FOREIGN KEY(book_id) REFERENCES BOOKS(book_id),
   FOREIGN KEY(user_id) REFERENCES USERS(user_id)
);
CREATE TABLE IF NOT EXISTS ADMIN
(
   admin_id INTEGER primary key,
   password text
);
CREATE TABLE IF NOT EXISTS LOGIN_RECORD
(
   token text primary key,
   user_id integer,
   login_time timestamp,
   FOREIGN KEY(user_id) REFERENCES USERS(user_id)
);

CREATE TABLE IF NOT EXISTS LOGIN_ADMIN_RECORD
(
   token text primary key,
   admin_id integer,
   login_time timestamp,
   FOREIGN KEY(admin_id) REFERENCES ADMIN(admin_id) 
);

