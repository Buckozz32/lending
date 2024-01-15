const bcrypt = require('bcrypt');


const saltRounds = 10;
const plainPassword = 'user_password';

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) throw err;
    // добавить логику сохранения кэша в бд
});

// Проверка пароля при входе
const hashFromDatabase = '...'; // Здесь надо добавить хэш в нашей бд
bcrypt.compare(plainPassword, hashFromDatabase, (err, result) => {
    if (err) throw err;
    if (result) {
        console.log('Password is correct');
       
    } else {
        console.log('Incorrect password');
        //можно добавить обротку неверного пароля
    }
});
