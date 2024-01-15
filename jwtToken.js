// Клиенсткая архитектура


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const saveTokenInCookie = (token) => {
        // Сохранение токена в cookie
        document.cookie = `token=${token};path=/;`;
    };

    const handleResponse = (response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    };

    const handleError = (error, action) => {
        console.error(`${action} error:`, error);
        // Дополнительные действия при ошибке
    };

    const login = (username, password) => {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => handleResponse(response))
        .then(data => {
            console.log('Login successful:', data);
            
            saveTokenInCookie(data.token);
        })
        .catch(error => handleError(error, 'Login'));
    };

    const register = (username, password) => {
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => handleResponse(response))
        .then(data => {
            console.log('Registration successful:', data);
            // Сохранение токена в cookie
            saveTokenInCookie(data.token);
        })
        .catch(error => handleError(error, 'Registration'));
    };

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');

            login(username, password);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const username = formData.get('username');
            const password = formData.get('password');

            register(username, password);
        });
    }
});
