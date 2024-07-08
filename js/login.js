let users = [];
let accumulator = [];
let loggedInUser = null;

// listens to a loginbutton to click perform login function
document.addEventListener('DOMContentLoaded', function () {
    if (document.location.pathname.includes("index.html")){
        document.getElementById('loginBtn').addEventListener('click', login);
    }
});

//intitalize onload
async function initUsers() {
    await loadUsers();
    // removeDuplicateUsers(users);
}

//Get users 
async function loadUsers() {
        users = await getUsers();
}

// logs in user with given inputs
async function login(event) {
    event.preventDefault();

    const email = document.getElementById('login').value;
    const username = users.find(user => user.email === email);
    const password = document.getElementById('password').value;
    const csrfToken = getCSRFToken();
    console.log(username.username)

    await loginUser(username.username, password, csrfToken)
}


async function removeDuplicateUsers(users) {
    let uniqueUsers = users.reduce((accumulator, currentUser) => {
        if (!accumulator.find(user => user.email === currentUser.email)) {
            accumulator.push(currentUser);
        }
        return accumulator;
    }, []);
    // await setItem('users', JSON.stringify(uniqueUsers));
    // put request um doppelte user zu löschen ?
    return uniqueUsers;
}

function showError(elementId, message) {
    let errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}
// gets guest access to login
async function guestLogin(event) {
    event.preventDefault();
    const csrfToken = getCSRFToken();
    await loginUser("Guest", "Guestuser1", csrfToken)

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