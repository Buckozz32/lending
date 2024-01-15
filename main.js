//Навигация

const redirectToHome = () => {
    window.location.href = '/home';
};

// приветствование пользователя

const displayWelcomeMessage = (username) => {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Welcome, ${username}!`;
};

//Обработчик событий 

const handleInputEvent = (event) => {
    console.log('Input event:', event.target.value);
};
