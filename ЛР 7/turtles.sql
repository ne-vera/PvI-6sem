CREATE TABLE IF NOT EXISTS 'Weapons'(
    'id' integer primary key AUTOINCREMENT,
    `name` VARCHAR(255) not null,
    'dps' integer not null
);

CREATE TABLE IF NOT EXISTS 'Pizzas'
(
    'id' integer primary key AUTOINCREMENT,
    'name' VARCHAR(255) not null,
    'calories' integer not null
);

CREATE TABLE IF NOT EXISTS 'Turtles'
(
    'id' integer primary key AUTOINCREMENT,
    'name' VARCHAR(255) not null,
    'color' text not null,
    'image' text,
    'weapon_id' INTEGER REFERENCES `Weapons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    'favorite_pizza_id' INTEGER REFERENCES `Pizzas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE, 
    'second_favorite_pizza_id' INTEGER REFERENCES `Pizzas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO `Weapons` (`name`,`dps`) VALUES ('katana', 5);
INSERT INTO `Weapons` (`name`,`dps`) VALUES ('sai', 4 );
INSERT INTO `Weapons` (`name`,`dps`) VALUES ('nunchaku', 3);
INSERT INTO `Weapons` (`name`,`dps`) VALUES ('staff', 2);

INSERT INTO `Pizzas` (`name`,`calories`) VALUES ('pepperoni', 1550);
INSERT INTO `Pizzas` (`name`,`calories`) VALUES ('margarita', 1430);
INSERT INTO `Pizzas` (`name`,`calories`) VALUES ('capriciosa', 1600);
INSERT INTO `Pizzas` (`name`,`calories`) VALUES ('hawaiian', 1390);

INSERT INTO `Turtles` (`name`,`color`,`image`,`weapon_id`,`favorite_pizza_id`,`second_favorite_pizza_id`) VALUES ('Leonardo', 'blue', 'file:///D:/учеба/ПвИ/Лабораторные работы/ЛР 7/images/leonardo.png', 1, 1, 2);
INSERT INTO `Turtles` (`name`,`color`,`image`,`weapon_id`,`favorite_pizza_id`,`second_favorite_pizza_id`) VALUES ('Raphael', 'res', 'file:///D:/учеба/ПвИ/Лабораторные работы/ЛР 7/images/raphael.png', 2, 1, 3);
INSERT INTO `Turtles` (`name`,`color`,`image`,`weapon_id`,`favorite_pizza_id`,`second_favorite_pizza_id`) VALUES ('Donatello', 'purple', 'file:///D:/учеба/ПвИ/Лабораторные работы/ЛР 7/images/donatello.png', 4, 3, 2);
INSERT INTO `Turtles` (`name`,`color`,`image`,`weapon_id`,`favorite_pizza_id`,`second_favorite_pizza_id`) VALUES ('Michelangelo', 'orange', 'file:///D:/учеба/ПвИ/Лабораторные работы/ЛР 7/images/michelangelo.png', 3, 4, 1);