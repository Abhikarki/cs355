const express = require("express"); // load express module
const bodyParser = require("body-parser");
const nedb = require("nedb-promises"); // load nedb module
const bcrypt = require("bcrypt");


const app = express();
const dbUsers = nedb.create("users.jsonl");
const dbTodo = nedb.create("todoappdata.jsonl");


app.use(express.static("public")); // enable static routing to "./public" folder
//TODO:
// automatically decode all requests from JSON and encode all responses into JSON
app.use(express.json());



app.post("/todo/:username/:token", (req, res) => {
    // tehnically u should only do below if username/authToken combo is found in db
    dbUsers.findOne({ username: req.params.username, token: req.params.token }).then((doc) => {
        if (doc) {
            dbTodo.insertOne(req.body).then((doc) => {
                if (doc) {
                    res.send(doc);
                } else {
                    res.send({ error });
                }
            }).catch((error) => res.send({ error }));
        } else {
            res.send({ error });
        }
    })

    .catch((error) => res.send({ error }));
});


app.get("/users", (req, res) => {
    dbUsers
        .find({})
        .then((docs) => res.send(docs))
        .catch((error) => res.send({ error }));
});


app.post("/authorization", (req, res) => {
    dbUsers.findOne({ username: req.body.username })
        .then((userDoc) => {
            if (userDoc) {
                if (bcrypt.compareSync(req.body.password, userDoc.password)) {
                    userDoc.token = "" + Math.random();
                    dbUsers.updateOne({ username: req.body.username }, { $set: { token: userDoc.token } })
                        .then((r) => {
                            delete userDoc.password;
                            //fetching todos
                            dbTodo.find({ username: req.body.username }).then((tododocs) => {
                                userDoc.todos = tododocs; // Add the user's todos to the user object
                                res.send(userDoc); // Send the user object with todos as the response
                                console.log(userDoc.todos);
                            });
                        });
                } else {
                    r.send({ error: "Login Failed." });
                }
            } else {
                r.send({
                    error: "Username not found.",
                });
            }
        })
        .catch((error) => res.send({ error }));
});

app.post("/users", (req, res) => {
    const user = req.body;

    if (!user.hasOwnProperty("username") ||
        !user.hasOwnProperty("password") ||
        !user.hasOwnProperty("email") ||
        !user.hasOwnProperty("name")
    ) {
        res.send({ error: "Missing field." });
    } else {
        dbUsers
            .findOne({ username: user.username })
            .then((doc) => {
                if (doc) {
                    res.send({ error: "Username already exists." });
                } else {
                    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
                    user.token = "" + Math.random();
                    dbUsers.insertOne(user).then((doc) => {
                            delete doc.password;
                            res.send(doc);
                        })
                        .catch((error) => res.send({ error }));
                }
            })
            .catch((error) => res.send({ error }));
    }
});


app.patch("/users/:username/:token", (req, res) => {
    dbUsers
        .updateOne({ username: req.params.username, token: req.params.token }, {
            $set: req.body,
        })
        .then((result) => {
            if (result == 0) {
                res.send({ error: "something went wrong" });
            } else {
                res.send({ ok: true });
            }
        })
        .catch((error) => res.send({ error }));
});

app.delete('/authorization/:username/:token', (req, res) => {
    dbTodo.updateOne({
        token: req.params.token,
        username: req.params.username
    }, { $set: { token: null } }).then((result) => {
        if (result) {
            res.send({ ok: true });
        } else {
            res.send({ error });
        }

    }).catch((error) => res.send({ error }));
});


app.delete("/users/:username/:token", async(req, res) => {
    try {
        const username = req.params.username;
        const result = await dbUsers.deleteOne({ username: username });
        if (result.deletedCount === 1) {
            res.send({ ok: true });
            console.log("Record deleted.");
        } else {
            res.send({ error: "Something went wrong." });
            console.log("No record deleted. ");
        }
    } catch (err) {
        res.send({ error: err });
    }
});

app.patch('/todo/username/:token/:id', (req, res) => {
    dbTodo.update({ _id: req.body._id }, { $set: { completed: req.body.completed } },
        (error) => {
            if (error) {
                res.send({ error });
            } else {
                res.send({ _id: req.body._id, completed: req.body.completed });
            }
        });
});

// default route
app.all("*", (req, res) => {
    res.status(404).send({
        error: "Invalid URL.",
    });
});


// start server
app.listen(3003, () => console.log("Server started on http://localhost:3003"));