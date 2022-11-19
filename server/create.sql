create table polls (
    id integer primary key autoincrement not null,
    created text not null,
    title text not null
);

create table options (
    id integer primary key autoincrement not null,
    poll_id int not null,
    text text not null,
    votes int not null default 0
);

-- attack on titan poll
insert into polls (created, title) values ("1668820549000", "which attack on titan season is best?");
insert into options (text, poll_id, votes) 
values
    ("season 1", 1, 1509),
    ("season 2", 1, 865),
    ("season 3", 1, 1145),
    ("season 4", 1, 533);
