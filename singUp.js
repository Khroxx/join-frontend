function openPage(page) {
    window.location.href = `${page}`;
}

let users = [];

async function init(){
    loadUsers();
}

async function loadUsers(){
    users = await getUsers();
        // users = JSON.parse(await getItem('users'));    
}

//Set users
async function register(){
    const signUpBtn = document.getElementById('signUpBtn');
    const username = document.getElementById('user_name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const repeat_password = document.getElementById('repeat_password');
    signUpBtn.disabled = true;
    if (password.value !== repeat_password.value) {
        document.getElementById('signUpPassword').style.display = 'block';
        signUpBtn.disabled = false;
        return;
    } else {
        document.getElementById('signUpPassword').style.display = 'none';
        try {
            await setUser(email.value, username.value, password.value)
        } catch (error) {
            console.log('User konnte nicht erstellt werden: ', error)
        }
        document.getElementById('msgBox').classList.remove('d-none');
        resetForm();


        setTimeout(() => {
            window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert';
        }, 3000);
    }
}

function resetForm(){
    user_name.value = '';
    email.value = '';
    password.value = '';
    repeat_password.value = '';
    signUpBtn.disabled = false;
}