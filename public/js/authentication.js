const authStrings = {
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    loginButton: document.getElementById('loginSubmit'),
    registerName: document.getElementById('registerFirstName'),
    registerEmail: document.getElementById('registerEmail'),
    registerPassword: document.getElementById('registerPassword'),
    registerSubmit: document.getElementById('registerSubmit'),
    loginError: document.getElementById('login-error'),
    registerError: document.getElementById('register-error')
}

const logInUser = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({
        email: authStrings.loginEmail.value,
        password: authStrings.loginPassword.value
    })

    const response = await request('/users/login', 'POST', {'Content-Type': 'application/json'}, body);
    const data = await response.json();
    if(data.error) {
        authStrings.loginError.innerText = data.error;
    } else if(data.success) {
        window.location.href = '/my-budget';
    }
}

const registerUser = async (event) => {
    event.preventDefault();

    const body = JSON.stringify({
        name: authStrings.registerName.value,
        email: authStrings.registerEmail.value,
        password: authStrings.registerPassword.value
    });

    const response = await request('/users', 'POST', {'Content-Type': 'application/json'}, body);
    const data = await response.json();

    if(data.error) {
        authStrings.registerError.innerText = data.error
    } else if (data.success) {
        window.location.href = '/my-budget';
    }
}

authStrings.loginButton.addEventListener('click', logInUser);
authStrings.registerSubmit.addEventListener('click', registerUser);