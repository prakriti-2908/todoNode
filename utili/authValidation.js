const validateEmail = ({key}) => {
    return String(key)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function validation({ username, email, password, country }) {
    return new Promise((resolve, reject) => {
        if (!username || !email || !password || !country) {
            return reject("Please fill all fields");
        }
        if (typeof username !== 'string') {
            return reject("Username is not a text");
        }
        if (typeof email !== 'string') {
            return reject("Email is not a text");
        }
        if (typeof password !== 'string') {
            return reject("Password is not a text");
        }
        if (typeof country !== 'string') {
            return reject("Country is not a text");
        }

        if (!validateEmail({key:email})) {
            return reject("Please provide a valid email");
        }

        resolve("All good to go");
    });
}

module.exports = validation;
module.exports = validateEmail;