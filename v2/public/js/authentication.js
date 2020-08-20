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

const request = async (url, method, headers, body) => {
    return await fetch(url, {
        method,
        headers,
        body
    })
}
const loadUserAccount = async (token) => {
    const response = await fetch('/my-budget', {
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`}
    })
    // const load = response.text()
}
const logInUser = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({
        email: authStrings.loginEmail.value,
        password: authStrings.loginPassword.value
    })

    const response = await request('/users/login', 'POST', {'Content-Type': 'application/json'}, body)
    const data = await response.json();
    console.log(data.success);

    if(data.success) window.location.href = '/my-budget';

}

authStrings.loginButton.addEventListener('click', logInUser);