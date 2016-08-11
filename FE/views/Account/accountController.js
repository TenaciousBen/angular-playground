class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
        this.registerModel = new RegisterModel();
        this.loginModel = new LoginModel();
        this.lastResponse = null;
        this.isLoggedIn = this.accountService.isLoggedIn();
    }

    login(loginModel) {
        this.accountService.login(loginModel.userName, loginModel.password)
            .then(response => {
                this.lastResponse = "login successful";
                this.isLoggedIn = this.accountService.isLoggedIn();
            })
            .catch(response => {
                this.lastResponse = response;
            })
    }

    logout(){
        this.accountService.logout();
        this.isLoggedIn = this.accountService.isLoggedIn();
    }

    register(registerModel) {
        this.accountService.register(registerModel.userName, registerModel.password, registerModel.confirmPassword)
            .then(response => {
                this.lastResponse = "registration successful";
            })
            .catch(response => {
                this.lastResponse = response;
            })
    }
}

class LoginModel {
    constructor() {
        this.userName = "";
        this.password = "";
    }
}

class RegisterModel extends LoginModel {
    constructor() {
        super();
        this.confirmPassword = "";
    }
}

angular.module("playground").controller("accountController", ["accountService", AccountController]);