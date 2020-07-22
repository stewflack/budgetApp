console.log('Hello Auth');

const authStrings = {
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    loginButton: document.getElementById('loginSubmit'),
    registerName: document.getElementById('registerFirstName'),
    registerEmail: document.getElementById('registerEmail'),
    registerPassword: document.getElementById('registerPassword'),
    registerSubmit: document.getElementById('registerSubmit')
}


const logInUser = async (event) => {
    event.preventDefault();

    const response = await fetch('/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: authStrings.loginEmail.value,
            password: authStrings.loginPassword.value
        })
    })
    const data = await response.json()
    console.log(data);
}

authStrings.loginButton.addEventListener('click', logInUser);