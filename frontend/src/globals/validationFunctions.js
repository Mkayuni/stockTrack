export async function validateUsername (username, setSignupError) {

    // Empty field
    if (username === "") {
        setSignupError(prev => [...prev, 7]);
        return false;
    }

    // Does username have at least three characters
    if (username.length < 3) {
        setSignupError(prev => [...prev, 12]);
        return false;
    }

    // Does username have the '@' in it?
    if (username.includes("@")) {
        setSignupError(prev => [...prev, 13]);
        return false;
    }

    // Is this username taken
    try {
        const response = await fetch ("http://localhost:3001/api/users/has-username/" + username, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            }});

        const data = await response.json();
        const usernameFounded = data.found;

        // Username is in the system
        if (usernameFounded) {
            setSignupError(prev => [...prev, 1]); // Username was taken
            return false;
        }

    } catch (e) {
        setSignupError(prev => [...prev, -1]); // Unknown Error
        return false;
    }

    return true;
}

export async function validateEmail (email, setSignupError) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Is empty?
    if (email === "") {
        setSignupError(prev => [...prev, 9]);
        return false;
    }

    // Is email an email?
    if (!emailRegex.test (email)) {
        setSignupError(prev => [...prev, 2]); // Email not formatted correctly
        return false;
    }

    // Does this email already have an account?
    try {
        const response = await fetch ("http://localhost:3001/api/users/has-email/" + email.toLowerCase(), {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            }});

        const data = await response.json();
        const emailFounded = data.found;

        // Email is in the system
        if (emailFounded) {
            setSignupError(prev => [...prev, 3]); // Email already used
            return false;
        }

    } catch (e) {
        setSignupError(prev => [...prev, -2]); // Unknown Error
        return false;
    }

    return true;
}

// Ensures the password matches requirements
export function validatePassword(password, setSignupError) {

    // Empty field
    if (password === "") {
        setSignupError(prev => [...prev, 8]);
        return false;
    }

    let isValid = true;
    const min_pass_length = 8;

    // Is characters 8 or more?
    if (password.length < min_pass_length) {
        isValid = false;
        setSignupError(prev => [...prev, 4]); // Password not correct length
    }

    // Is there a number?
    if (!/\d/.test(password)) {
        setSignupError(prev => [...prev, 5]); // Password missing a number
        isValid = false;
    }

    // Is there a cap?
    if (!/[A-Z]/.test(password)) {
        setSignupError(prev => [...prev, 6]); // Password missing a cap
        isValid = false;
    }

    return isValid;
}

export function validateVerifyPassword(verifiedPassword, password, setSignupError) {

    // Is verify password empty?
    if (verifiedPassword === "") {
        setSignupError(prev => [...prev, 14]);
        return false;
    }

    // Does validate password match password?
    if (password !== verifiedPassword) {
        setSignupError(prev => [...prev, 15]);
        return false;
    }

    return true;
}

export function blankFieldsCheck(firstName, lastName, setFNameError, setLnameError, setSignupError) {

    let empty = false;

    // First Name
    if (firstName === "") {
        empty = true;
        setSignupError(prev => [...prev, 10]);
        setFNameError(true);
    } else setFNameError(false);

    // Last Name
    if (lastName === "") {
        empty = true;
        setSignupError(prev => [...prev, 11]);
        setLnameError(true);
    } else setLnameError(false);

    return empty;
}

export function getLoginErrorMessage(type, errors) {

    if (errors.length === 0) {return '';}

    let message = "";

    // Loops through to check all errors in array and returns the first error that matches the type
    for (const err of errors){
        switch (err) {

            case -2: // Email Error
                if (type === 'email') {
                    message = "Unknown Email Error";
                    return message;
                }

                break;

            case -1: // Username Error
                if (type === 'username') {
                    message = "Unknown Username Error";
                    return message;
                }

                break;

            case 1: // Username was taken
                if (type === 'username') {
                    message = "This username is already taken";
                    return message;
                }

                break;

            case 2: // Email not formatted correctly
                if (type === 'email') {
                    message = "Please enter a valid email";
                    return message;
                }

                break;

            case 3: // Email taken
                if (type === 'email') {
                    message = "This email is already taken";
                    return message;
                }

                break;

            case 4: // Password does not meet length condition
                if (type === 'password') {
                    message = "Password does not meet the requirement: 8 characters minimum";
                    return message;
                }

                break;

            case 5: // Password missing number
                if (type === 'password') {
                    message = "Password does not meet the requirement: at least 1 number";
                    return message;
                }

                break;

            case 6: // Password missing cap
                if (type === 'password') {
                    message = "Password does not meet the requirement: at least 1 capital letter";
                    return message;
                }

                break;

            case 7: // Empty Username
                if (type === 'username') {
                    message = "A username is required";
                    return message;
                }

                break;

            case 8: // Empty Password
                if (type === 'password') {
                    message = "A password is required";
                    return message;
                }

                break;

            case 9: // Empty Email
                if (type === 'email') {
                    message = "A email is required";
                    return message;
                }

                break;

            case 10: // fname empty
                if (type === 'fname') {
                    message = "Your first name is required";
                    return message;
                }

                break;

            case 11: // lname empty
                if (type === 'lname') {
                    message = "Your last name is required";
                    return message;
                }

                break;

            case 12: // username does not meet character length of 3
                if (type === 'username') {
                    message = "Username must be at least 3 characters long";
                    return message;
                }

                break;

            case 13: // username includes '@'
                if (type === 'username') {
                    message = "Username must not include the symbol '@'";
                    return message;
                }

                break;

            case 14: // verify password is blank
                if (type === 'verify-password') {
                    message = "Verifying your password is required";
                    return message;
                }

                break;

            case 15: // verify password does not match password
                if (type === 'verify-password') {
                    message = "Passwords do not match";
                    return message;
                }

                break;


            default: // Unknown Error
                return ('Unknown Error code: ' + err)
        }
    }

    return message;
}