function validateEmail(email) {
    let re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateUsername(username) {
    //Same regex present in API
    let re = /^[-_.A-Za-z0-9]+$/;
    return re.test(String(username).toLowerCase());
}

const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 6;
const MIN_EMAIL_LENGTH = 6;

export {
    validateEmail,
    validateUsername,
    MIN_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
    MIN_EMAIL_LENGTH
}