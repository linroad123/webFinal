import * as userService from "../../services/userService.js";


const showForm = async({render}) => {
  render('register.ejs',{errors:{},email:null});
};

const showLogin = async({render}) => {
  render('login.ejs',{errors:{}});
}




export { showForm,showLogin };