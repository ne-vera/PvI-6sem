const fs = require("fs");
const path = require("path");
const express = require("express");
const fileUpload = require('express-fileupload');
const { Sequelize, DataTypes, Model, Op } = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './turtles.db',
    define: {
        timestamps: false
    }
});

class Turtle extends Model {}
class Weapon extends Model {}
class Pizza extends Model {}

async function initModels() {
    await Weapon.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dps: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Weapon',
        }
    );

    await Pizza.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            calories: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            test: {
                type: DataTypes.INTEGER
            }
        },
        {
            sequelize,
            modelName: 'Pizza',
        }
    );

    await Turtle.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            color: {
                type: DataTypes.STRING,
                allowNull: true
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        },
        {
            sequelize,
            modelName: 'Turtle',
        }
    );

    await Weapon.hasMany(Turtle, {
        foreignKey: "weapon_id",
    })
    await Pizza.hasMany(Turtle, {
        foreignKey: "favorite_pizza_id",
    });
    await Pizza.hasMany(Turtle, {
        foreignKey: "second_favorite_pizza_id",
    });

    await Weapon.sync();
    await Pizza.sync();
    await Turtle.sync();
}

initModels();


const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(express.static("images"));
app.use(function(_, response, next) { 
    response.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/api/turtles", getTurtles);
app.get("/api/turtles/:id", getTurtleById);
app.post("/api/turtles", postTurtle);
app.put("/api/turtles/:id", putTurtle);
app.put("/api/turtles/:id/favoritePizzaBind/:favoritePizza", turtleBindFavoritePizza);
app.put("/api/turtles/:id/secondFavoritePizzaBind/:secondFavoritePizza", turtleBindSecondFavoritePizza);
app.put("/api/turtles/:id/weaponBind/:weapon", turtleBindWeapon);
app.delete("/api/turtles/:id/favoritePizzaUnbind/:favoritePizza", turtleUnbindFavoritePizza);
app.delete("/api/turtles/:id/secondFavoritePizzaUnbind/:secondFavoritePizza", turtleUnbindSecondFavoritePizza);
app.delete("/api/turtles/:id/weaponUnbind/:weapon", turtleUnbindWeapon);
app.delete("/api/turtles/:id", deleteTurtle);

app.get("/api/weapons", getWeapons);
app.get("/api/weapons/:id", getWeaponById);
app.post("/api/weapons", postWeapon);
app.put("/api/weapons/:id", putWeapon);
app.delete("/api/weapons/:id", deleteWeapon);

app.get("/api/pizzas", getPizzas);
app.get("/api/pizzas/:id", getPizzaById);
app.post("/api/pizzas", postPizza);
app.put("/api/pizzas/:id", putPizza);
app.delete("/api/pizzas/:id", deletePizza);

const urlencodedParser = express.urlencoded({extended: false});
app.get("/upload", getUpload);
app.post("/upload", postUpload);

app.put("/api/superfat", putSuperfat);

app.listen(3000);


async function getTurtles(request, response) {
    let turtles;
    if (request.query["favoritePizza"] !== undefined) {
        const favoritePizzaName = request.query["favoritePizza"];
        const pizza = await Pizza.findOne({
            where: {
                name: favoritePizzaName
            }
        });
        turtles = await Turtle.findAll({
            where: {
                favorite_pizza_id: pizza.id
            }
        });
    }
    else {
        turtles = await Turtle.findAll();
    }
    response.json(turtles);
}

async function getTurtleById(request, response) {
    const id = parseInt(request.params["id"]);
    
    if (isNaN(id)) {
        response.status(400).json({ error: "Invalid ID. Must be a number." });
        return;
    }
    const turtle = await Turtle.findOne({
        where: {
            id: id
        }
    });
    response.json(turtle);
}

async function postTurtle(request, response) {
    const newTurtle = request.body;

    if (!newTurtle.id || !newTurtle.name || !newTurtle.color) {
        response.status(400).json({ error: "Missing required fields." });
        return;
    }
    Turtle.create(newTurtle);
    response.json(request.body);
}

async function putTurtle(request, response) {
    const putData = request.body;
    const putId = parseInt(request.params["id"]);

    if (isNaN(putId)) {
        response.status(400).json({ error: "Invalid ID. Must be a number." });
        return;
    }

    if (!putData.id || !putData.name || !putData.color) {
        response.status(400).json({ error: "Missing required fields." });
        return;
    }

    await Turtle.update(putData, { 
        where: { 
            id: putId
        } 
    });
    const updatedObject = await Turtle.findOne({
        where: {
            id: putId
        }
    });
    response.json(updatedObject);
}

async function deleteTurtle(request, response) {
    const turtle_id = parseInt(request.params["id"]);
    const turtle = await Turtle.findOne({
        where: {
            id: turtle_id
        }
    });
    Turtle.destroy({
        where: {
            id: turtle_id
        }
    });
    response.json(turtle);
}

async function turtleBindFavoritePizza(request, response) {
    const turtleId = parseInt(request.params["id"]);
    const pizzaId = parseInt(request.params["favoritePizza"]);

    if (isNaN(turtleId)) {
        response.status(400).json({ error: "Invalid Turtle ID. Must be a number." });
        return;
    }

    if (isNaN(pizzaId)) {
        response.status(400).json({ error: "Invalid Pizza ID. Must be a number." });
        return;
    }

    const turtle = await Turtle.findOne({
        where: {
            id: turtleId
        }
    });

    const pizza = await Pizza.findOne(
        {
            where: {
                id: pizzaId
            }
        }
    )

    if (!turtle) {
        response.status(404).json({ error: "Turtle not found." });
        return;
    }

    if (!pizza) {
        response.status(404).json({ error: "Pizza not found." });
        return;
    }

    await turtle.update({ favorite_pizza_id: pizzaId });

    response.json(turtle);
}


async function turtleUnbindFavoritePizza(request, response) {
    const turtleId = parseInt(request.params["id"]);

    if (isNaN(turtleId)) {
        response.status(400).json({ error: "Invalid ID. Must be a number." });
        return;
    }

    const turtle = await Turtle.findOne({
        where: {
            id: turtleId
        }
    });

    if (!turtle) {
        response.status(404).json({ error: "Turtle not found." });
        return;
    }

    await turtle.update({ favorite_pizza_id: null });
    response.json(turtle);
}


async function turtleBindSecondFavoritePizza(request, response) {
    const turtleId = parseInt(request.params["id"]);
    const pizzaId = parseInt(request.params["secondFavoritePizza"]);

    if (isNaN(turtleId)) {
        response.status(400).json({ error: "Invalid Turtle ID. Must be a number." });
        return;
    }

    if (isNaN(pizzaId)) {
        response.status(400).json({ error: "Invalid Pizza ID. Must be a number." });
        return;
    }

    const turtle = await Turtle.findOne({
        where: {
            id: turtleId
        }
    });

    const pizza = await Pizza.findOne(
        {
            where: {
                id: pizzaId
            }
        }
    )

    if (!turtle) {
        response.status(404).json({ error: "Turtle not found." });
        return;
    }

    if (!pizza) {
        response.status(404).json({ error: "Pizza not found." });
        return;
    }

    await turtle.update({ second_favorite_pizza_id: pizzaId });

    response.json(turtle);
}

async function turtleUnbindSecondFavoritePizza(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ second_favorite_pizza_id: null });
    response.json(turtle);
}

async function turtleBindWeapon(request, response) {
    const turtleId = parseInt(request.params["id"]);
    const weaponId = parseInt(request.params["weapon"]);

    if (isNaN(turtleId)) {
        response.status(400).json({ error: "Invalid Turtle ID. Must be a number." });
        return;
    }

    if (isNaN(weaponId)) {
        response.status(400).json({ error: "Invalid Weapon ID. Must be a number." });
        return;
    }

    const turtle = await Turtle.findOne({
        where: {
            id: turtleId
        }
    });

    if (!turtle) {
        response.status(404).json({ error: "Turtle not found." });
        return;
    }

    await turtle.update({ weapon_id:  weaponId});
    response.json(turtle);
}

async function turtleUnbindWeapon(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ weapon_id: null });
    response.json(turtle);
}


async function getWeapons(request, response) {
    const dpsgt = request.query["dpsgt"] === undefined ? 0 : parseInt(request.query["dpsgt"]);
    const dpslt = request.query["dpslt"] === undefined ? 500 : parseInt(request.query["dpslt"]);
    const weapons = await Weapon.findAll({
        where: {
            dps: {
                [Op.gt]: dpsgt,
                [Op.lt]: dpslt,
            }
        }
    });
    response.json(weapons);
}

async function getWeaponById(request, response) {
    const weapon = await Weapon.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    response.json(weapon);
}

async function postWeapon(request, response) {
    const newWeapon = request.body;

    if (!newWeapon.id || !newWeapon.name|| !newWeapon.dps) {
        response.status(400).json({ error: "Missing required fields." });
        return;
    }

    if (newWeapon.dps > 500) {
        response.status(400).json({ error: "dps is too high"  });
    }
    else {
        Weapon.create(newWeapon);
        response.json(request.body);
    }
}

async function putWeapon(request, response) {
    const putData = request.body;

    if (!putData.id || !putData.name|| !putData.dps) {
        response.status(400).json({ error: "Missing required fields." });
        return;
    }

    if (putData.dps > 500) {
        response.json({ error: "dps is too high" });
        return;
    }
    const putId = parseInt(request.params["id"]);
    await Weapon.update(putData, { 
        where: { 
            id: putId
        } 
    });
    const updatedObject = await Weapon.findOne({
        where: {
            id: putId
        }
    });
    response.json(updatedObject);
}

async function deleteWeapon(request, response) {
    const weapon_id = parseInt(request.params["id"]);
    const weapon = await Weapon.findOne({
        where: {
            id: weapon_id
        }
    });
    Weapon.destroy({
        where: {
            id: weapon_id
        }
    });
    response.json(weapon);
}


async function getPizzas(request, response) {
    const caloriesgt = request.query["caloriesgt"] === undefined ? 0 : parseInt(request.query["caloriesgt"]);
    const calorieslt = request.query["calorieslt"] === undefined ? 200000 : parseInt(request.query["calorieslt"]);
    const pizzas = await Pizza.findAll({
        where: {
            calories: {
                [Op.gt]: caloriesgt,
                [Op.lt]: calorieslt,
            }
        }
    });
    response.json(pizzas);
}

async function getPizzaById(request, response) {
    const pizza = await Pizza.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    response.json(pizza);
}

async function postPizza(request, response) {
    const newPizza = request.body;
    if (!newPizza.id || !newPizza.name || !newPizza.calories) {
        response.status(400).json({ error: "Missing required fields." });
        return;
    }

    if (newPizza.calories > 2000) {
        response.status(400).json({ error: "Calories are too high." });
        return;
    }
    else {
        Pizza.create(newPizza);
        response.json(request.body);
    }
}

async function putPizza(request, response) {
    const putData = request.body;

    if (!putData.id || !putData.name || !putData.calories) {
        response.status(400).json({ error: "Missing required fields." });
        return;
    }

    if (putData.calories > 2000) {
        response.status(400).json({ error: "Calories are too high." });
        return;
    }
    const putId = parseInt(request.params["id"]);
    await Pizza.update(putData, { 
        where: { 
            id: putId
        } 
    });
    const updatedObject = await Pizza.findOne({
        where: {
            id: putId
        }
    });
    response.json(updatedObject);
}

async function deletePizza(request, response) {
    const pizza_id = parseInt(request.params["id"]);
    const pizza = await Pizza.findOne({
        where: {
            id: pizza_id
        }
    });
    Pizza.destroy({
        where: {
            id: pizza_id
        }
    });
    response.json(pizza);
}


async function getUpload(request, response) {
    response.sendFile(__dirname + "/html/upload.html");
}

async function postUpload(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: request.body.id
        }
    });
    if (turtle === null) {
        return response.sendStatus(400);
    }

    const image = request.files.image;
    if (!image) {
        return response.sendStatus(404);
    }
    const imagePath = __dirname + `\\images\\turtle_${request.body.id}.png`;
    image.mv(imagePath);
    await Turtle.update({ image: "file:///" + imagePath }, { 
        where: { 
            id: request.body.id
        } 
    });
    response.sendStatus(200);
}

async function putSuperfat(request, response) {
    const fatPizzas = await Pizza.findAll({
        where: {
            calories: {
                [Op.gt]: 1500
            }
        }
    });
    fatPizzas.forEach((pizza) => {
        const pizzaName = pizza.name;
        pizza.update({ name: pizzaName + " SUPER FAT!"});
    });
    response.json(fatPizzas);
}
