document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const saveTokenInCookie = (token) => {
        // Сохранение токена в cookie
        document.cookie = `token=${token};path=/;`;
    };

    const getAccessToken = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'token') {
                return value;
            }
        }
        return '';
    };

    

    
    //*Я тут реализовать через куки логинсаксес.
    const handleLoginSuccess = (data) => {
        console.log('Login successful:', data);
        saveTokenInCookie(data.token);
    };
    
    //можно попробовать расширить логику саксесфул регистрации. И сюда же нужно добавить связку с бд я думаю
    const handleRegistrationSuccess = (data) => {
        console.log('Registration successful:', data);
        };

    const handleAccessDenied = () => {
        console.error('Access denied');
        };

    const handleError = (error, action) => {
        console.error(`${action} error:`, error);
        };

          //Тут надо логику токена при взаимодействии с бд добавить. Как по мне тут отлично подойдет реляционка какая-та
               
        const refreshToken = () => {
        
        fetch('/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token refresh failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Token refreshed:', data);
            saveTokenInCookie(data.token);
        })
        .catch(error => {
            console.error('Token refresh error:', error);
        });
    };

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(loginForm);

            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => handleLoginSuccess(data))
            .catch(error => handleError(error, 'Login'));
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(registerForm);

            if (formData.get('password') !== formData.get('confirmPassword')) {
                console.error('Пароль и подтверждение пароля не совпадают');
                return;
            }

            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed');
                }
                return response.json();
            })
            .then(data => handleRegistrationSuccess(data))
            .catch(error => handleError(error, 'Registration'));
        });
    }

         // логика защищенного подключения
    const protectedResourceRequest = () => {
        fetch('/api/protected-resource', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    refreshToken();
                } else {
                    handleAccessDenied();
                }
            }
            
            console.log('Protected resource accessed successfully');
        })
        .catch(error => {
            console.error('Protected resource access error:', error);
        });
    };

   
    protectedResourceRequest();
});
