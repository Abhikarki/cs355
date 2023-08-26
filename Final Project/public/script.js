'use strict'

const $ = document.querySelector.bind(document);


// login link action
$('#loginLink').addEventListener('click', openLoginScreen);
$('#logoutLink').addEventListener('click', openLoginScreen);
$('#logoutLink').addEventListener('click', () => {
    fetch('/authorization/' + $('#username').innerText + "/" + authToken, {
            method: 'DELETE'
        })
        .then((r) => r.json())
        .then(doc => {
            if (doc.error) {
                showError(doc.error);
            } else {
                openLoginScreen();
            }
        }).catch(err => showError('Error: ' + err));
});
// register link action
$('#registerLink').addEventListener('click', openRegisterScreen);

// logout link action
//$('#logoutLink').addEventListener('click', openLoginScreen);
$('#registerBtn').addEventListener('click', setupToDoList);


// Sign In button action
$('#loginBtn').addEventListener('click', () => {
    // check to make sure username/password aren't blank
    if (!$('#loginUsername').value || !$('#loginPassword').value) {
        showError('All fields are required.');
        return;
    }
    var data = {
        username: $('#loginUsername').value,
        password: $('#loginPassword').value
    };
    fetch('/authorization', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(doc => {
            if (doc.error) {
                showError(doc.error);
            } else {
                // openHomeScreen(doc);
                setupToDoList(doc);
            }

        }).catch(err => showError('Error: ' + err));
});


// Register button action
$('#registerBtn').addEventListener('click', () => {
    // check to make sure no fields aren't blank
    if (!$('#registerUsername').value ||
        !$('#registerPassword').value ||
        !$('#registerName').value ||
        !$('#registerEmail').value) {
        showError('All fields are required.');
        return;
    }
    // grab all user info from input fields, and POST it to /users
    var data = {
        username: $('#registerUsername').value,
        password: $('#registerPassword').value,
        name: $('#registerName').value,
        email: $('#registerEmail').value
    };


    fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(doc => {
            if (doc.error) {
                showError(doc.error)
            } else {
                setupToDoList(doc);
                // openHomeScreen(doc)
            }
        }).catch(err => showError('Error: ' + err));
});


function showListOfUsers() {

    fetch('/users')
        .then(r => r.json())
        .then(docs => {
            docs.forEach(showUserInList);
        }).catch(err => showError('Could not get user List: ' + err))

}


function showUserInList(doc) {
    // add doc.username to #userlist
    var item = document.createElement('li');
    $('#userlist').appendChild(item);
    item.innerText = doc.username;
}

function showError(err) {
    // show error in dedicated error div
    $('#error').innerText = err;
}

function resetInputs() {
    // clear all input values
    var inputs = document.getElementsByTagName("input");
    for (var input of inputs) {
        input.value = '';
    }
}

var authToken, username;

function openHomeScreen(doc) {
    if (doc.todos) {
        doc.todos.forEach(setupToDoList);
    }
    username = doc.username;
    authToken = doc.authToken;
    // hide other screens, clear inputs, clear error
    $('#loginScreen').classList.add('hidden');
    $('#registerScreen').classList.add('hidden');
    resetInputs();
    showError('');
    // display name, username
    $('#name').innerText = doc.name;
    $('#username').innerText = doc.username;
    // display updatable user info in input fields
    $('#updateName').value = doc.name;
    $('#updateEmail').value = doc.email;
    // clear prior userlist
    $('#userlist').innerHTML = '';
    // show new list of users
    showListOfUsers();
}


function openLoginScreen() {
    // hide other screens, clear inputs, clear error
    $('#registerScreen').classList.add('hidden');
    $('#container').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal login screen
    $('#loginScreen').classList.remove('hidden');
    $('#taskList').innerHTML = "";

}



function openRegisterScreen() {
    // hide other screens, clear inputs, clear error
    $('#container').classList.add('hidden');
    $('#loginScreen').classList.add('hidden');
    $('#error').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal register screen
    $('#registerScreen').classList.remove('hidden');
}


//todo app
function setupToDoList(userDoc) {
    var taskList = document.getElementById("taskList");
    var taskInput = document.getElementById("taskInput");
    var addBtn = document.getElementById("addBtn");

    $('#container').classList.remove('hidden');
    $('#registerScreen').classList.add('hidden');
    $('#loginScreen').classList.add('hidden');
    $('#error').classList.add('hidden');

    userDoc.todos.forEach(addTask);

    function addTask(todoDoc = {}) {

        if (todoDoc._id) {
            var taskItem = document.createElement("div");
            taskItem.innerText = todoDoc.todo;
            taskList.appendChild(taskItem);
            taskItem.id = todoDoc._id;
            if (todoDoc.completed) {
                taskItem.classList.toggle("completed");
            }
        } else {
            if (taskInput.value !== "") {
                var taskItem = document.createElement("div");
                taskItem.innerText = taskInput.value;
                taskList.appendChild(taskItem);
                fetch('/todo/' + username + "/" + authToken, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            todo: taskInput.value,
                            username: userDoc.username,
                            completed: false,
                        }),
                    })
                    .then(res => res.json())
                    .then(doc => {
                        if (doc.error) {
                            showError(doc.error)
                        } else {
                            taskItem.id = doc._id;
                            console.log("POSTED.")
                            res.send(doc.body);
                        }
                    }).catch(err => showError('Error: ' + err));
                taskInput.value = "";
            }
        }
        // click functionality
        taskItem.addEventListener("click", function() {
            taskItem.classList.toggle("completed");
            fetch('/todo/' + username + "/" + authToken + "/" + taskItem.id, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        completed: true,
                        _id: taskItem.id,
                    }),
                })
                .then(res => res.json())

            .then(doc => {
                console.log(doc);
                if (doc.error) {
                    showError(doc.error)
                } else {
                    console.log("patched.")
                }
            }).catch(err => showError('Error: ' + err));
        });

    }
    addBtn.addEventListener("click", addTask);

    $('#container').classList.remove('hidden');
    $('#registerScreen').classList.add('hidden');
    $('#loginScreen').classList.add('hidden');
    $('#error').classList.add('hidden');


}