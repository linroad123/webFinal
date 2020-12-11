import {assertEquals,superoak} from "../deps.js";
// import { getHello, setHello } from "../services/userService.js";
import { showForm,showLogin } from "../routes/controllers/userController.js";
// import { getHello, setHello } from "../routes/apis/userApi.js";
import {app} from "../app.js";

Deno.test({
    name:"userController render test of registration form", 
    async fn() {
    const testClient = await superoak(app);
    await testClient.get('/auth/registration')
        .expect('<h1 align="center">Register!</h1>\r\n<div align="center">\r\n<form method="POST">\r\n    <label>Email:</label>\r\n    \r\n    <input type="email" name="email" value=""/><br><br>\r\n    <label>Password:</label>\r\n    \r\n    <input type="password" name="password" /><br><br>\r\n    <label>Verification:</label>\r\n    <input type="password" name="verification" /><br><br>\r\n    <input type="submit" value="Submit!" />\r\n</form>\r\n</div>');
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name:"userController render test of login form", 
    async fn() {
    const testClient = await superoak(app);
    await testClient.get('/auth/login')
        .expect('<h1 align="center">Login!</h1>\r\n<div align="center">\r\n<form method="POST">\r\n    <label>Email:</label>\r\n    \r\n    <input type="email" name="email" /><br><br>\r\n    <label>Password:</label>\r\n    \r\n    <input type="password" name="password" /><br><br>\r\n    <input type="submit" value="Submit!" />\r\n</form>\r\n<a href="registration">Reister</a>\r\n</div>');
    },
    sanitizeResources: false,
    sanitizeOps: false
});




// Deno.test("userController render test of login form", async() => {
//     const testClient = await superoak(app);
//     await testClient.get('/auth/login')
//         .expect();

// });