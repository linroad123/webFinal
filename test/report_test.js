import {assertEquals,superoak} from "../deps.js";
// import { getHello, setHello } from "../services/userService.js";
import { showForm,showLogin } from "../routes/controllers/userController.js";
// import { getHello, setHello } from "../routes/apis/userApi.js";
import {app} from "../app.js";

Deno.test({
    name:"userController render test of registration form", 
    async fn() {
    const testClient = await superoak(app);
    await testClient.get('/')
        .expect('');
    },
    sanitizeResources: false,
    sanitizeOps: false
});