// const STORAGE_TOKEN = '7WOZYJPVRPLQU2QHOLVJAIBW8PYK5CJ3FKQF8720';
// const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


// function to retrieve users from backend
async function getUsers() { 
    const url = 'http://127.0.0.1:8000/users/'; 
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const users = await response.json();
        return users; 
    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
        throw error;
    }
}

//create user and register to backend
async function setUser(email, username, password) {  
    const url = 'http://127.0.0.1:8000/register/'; 
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": email,
            "username": username,
            "password": password,
        })
    }
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Anmeldefehler: Benutzer nicht gefunden oder falsches Passwort');
        }
    } catch (error){
        console.log('User konnte nicht erstellt werden: ', error)
    }
}

//update user credentials to backend
async function updateUser(email, username, phone, id){
    let correctId = id - 1;
    const csrfToken = localStorage.getItem('Token') 
    const url = `http://127.0.0.1:8000/users/${correctId}/`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            "email": email,
            "username": username,
            "phone": phone
        })
    }
    try {
        await fetch(url, requestOptions)
    } catch (error){
        console.error('konnte nicht updaten', error)
    }
}

//delete a user from backend
async function deleteUser(id){
    // let correctId = id - 1;
    const url = 'http://127.0.0.1:8000/users/' + id + '/delete/';
    const requestOptions = { method: 'DELETE' }
    try {
        await fetch(url, requestOptions);
    } catch (error){
        console.error('konnte nicht gelöscht werden', error)
    }
}

//login with credentials from backend
async function loginUser(username, password, csrfToken){
    const url = 'http://127.0.0.1:8000/login/';
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
         },
        body: JSON.stringify({ "username": username, "password": password })
    };
    
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Anmeldefehler: Benutzer nicht gefunden oder falsches Passwort');
        }
        const user = await response.json();
        localStorage.setItem('Token', user.token);
        localStorage.setItem('User', username)
        loggedInUser = username
        window.location.href = 'summary.html'; 
    } catch (error) {
        passwordError.textContent = 'Incorrect password. Please try again.';
        console.error('Fehler beim Einloggen:', error);
        // showError('loginError', 'Fehler beim Einloggen. Bitte versuchen Sie es später erneut.');
    }
}

// function to retrieve Todos from backend
async function getTodos() {
    const url = 'http://127.0.0.1:8000/todos/';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const todos = await response.json();
        return todos;
    } catch (error) {
        console.error('Fehler beim Abrufen der Todos:', error);
        throw error;
    }
}

async function setTodo(title, desc, created, prio, users, category, status, subtask){
    const url = 'http://127.0.0.1:8000/todos/';
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "title": title,
            "description": desc,
            "created_at": created,
            "priority": prio,
            "users": users, 
            "category": category, 
            "status": status
        }) 
    }
    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        await setSubtask(data.id, subtask)
        if (!response.ok) {
            throw new Error('Todo konnte nicht erstellt werden');
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateTodo(title, desc, created, prio, users, category, subtask, todoId, subtasksId){
    const url = `http://127.0.0.1:8000/todos/${todoId}/`;
    const csrfToken = getCSRFToken();
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
         },
        body: JSON.stringify({
            "title": title,
            "description": desc,
            "created_at": created,
            "priority": prio,
            "users": users, 
            "category": category, 
        }) 
    }
    try {
        await fetch(url, requestOptions),
        await updateSubtasks(todoId, subtask.text, subtask.status, subtasksId)
    } catch (error){
        console.error('konnte nicht updaten', error)
    }
}

async function updateTodoStatus(todoId, status){
    const url = `http://127.0.0.1:8000/todos/${todoId}/`;
    const csrfToken = getCSRFToken();
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
         },
        body: JSON.stringify({
            "status": status
        }) 
    }
    try {
        await fetch(url, requestOptions)
    } catch (error){
        console.error('konnte nicht updaten', error)
    }
}


async function deleteTodo(todoId){
    const url = 'http://127.0.0.1:8000/todos/' + todoId + '/delete/';
    const requestOptions = { method: 'DELETE' };
    try {
         await fetch(url, requestOptions);
    } catch (error){
        console.error('konnte nicht gelöscht werden', error)
    }
}

// function to retrieve Subtasks from backend
async function getSubtasks() {
    const url = 'http://127.0.0.1:8000/subtasks/';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const subtasks = await response.json();
        return subtasks;
    } catch (error) {
        console.error('Fehler beim Abrufen der Todos:', error);
        throw error;
    }
}

// create subtask function to backend
async function setSubtask(todoId, subtasks){
    const url = `http://127.0.0.1:8000/subtasks/`;
    console.log(subtasks)
    for (let i = 0; i < subtasks.length; i++ ){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "todo_item": todoId,
            "text": subtasks[i].text,
            "is_completed": false
        })
    }
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Todo konnte nicht erstellt werden');
        }
    } catch (error){
        console.log('konnte subtask nicht hinzufügen', error)
    }
    }
}

async function updateSubtasks(todoId, text, status, subId){
    const url = `http://127.0.0.1:8000/subtasks/${subId}/`;
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "todo_item": todoId,
            "text": text,
            "is_completed": status
        })
    }
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(' konnte nicht erstellt werden');
        }
    } catch (error){
        console.log('konnte subtask nicht geändert werden', error)
    }
}

async function deleteSubtasks(subId){
    try {
    const requestOptions = { method: 'DELETE' };
    const url = `http://127.0.0.1:8000/subtasks/${subId}/delete/`;
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Fehler beim Löschen der Subtask mit ID ${subId}`);
        }
} catch (error){
    console.error('fehler beim löschen von subtasks', error)
}
}

function getCSRFToken() {
    let csrfToken = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === ('csrftoken=')) {
                csrfToken = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return csrfToken;
}