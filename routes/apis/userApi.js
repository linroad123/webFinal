import * as userService from "../../services/userService.js";
import {bcrypt} from "../../deps.js";
import {validate, required, lengthBetween, isEmail, minLength} from "../../deps.js";

const validationRules = {
    password: [required, minLength(4)],
    email: [required, isEmail],
};

const setRegister = async({request, response,render}) => {
    const body = request.body();
    const params = await body.value;
    
    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');

    const data = {
        password: password,
        email: email,
        errors: {},
    };

    const [passes, errors] = await validate(data, validationRules);

    if (!passes) {
        data.errors = errors;
        render("register.ejs", data);
    } else {
        if (password !== verification) {
            response.body = 'The entered passwords did not match';
            return;
        }
        
        const existingUsers = await userService.setRegister(email);
        if (existingUsers.rowCount > 0) {
            response.body = 'The email is already reserved.';
            return;
        }
        
        // otherwise, store the details in the database
        await userService.password(email,password);
        response.redirect('/auth/login');
    }
};

const authenticate = async({request, response, session,render}) => {
    const body = request.body();
    const params = await body.value;
  
    const email = params.get('email');
    const password = params.get('password');

    const data = {
        password: password,
        email: email,
        errors: {},
    };

    const [passes, errors] = await validate(data, validationRules);

    if (!passes) {
        data.errors = errors;
        render("login.ejs", data);
    } else {  
        // check if the email exists in the database
        const existingUsers = await userService.setRegister(email);
        if (existingUsers.rowCount === 0) {
            response.status = 401;
            return;
        }
    
        // take the first row from the results
        const userObj = existingUsers.rowsOfObjects()[0];
    
        const hash = userObj.password;
    
        const passwordCorrect = await bcrypt.compare(password, hash);
        if (!passwordCorrect) {
            data.errors = {password:{wrong:"Invalid password"}}
            render("login.ejs", data);
        }else{
    
        await session.set('authenticated', true);
        await session.set('user', userObj.email);
        await session.set('id', userObj.id);
        response.body = 'Authentication successful!';
        response.redirect('/behavior/reporting');
        }
    }
    
}

const logout = async({request, response, session,render}) => {
    await session.set('authenticated',null);
    await session.set('user',null);
    await session.set('id', 'anonymous');
    response.redirect('/');
}


export {setRegister,authenticate,logout};