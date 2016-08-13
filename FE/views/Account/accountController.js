class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
        this.registerModel = new RegisterModel();
        this.loginModel = new LoginModel();
        this.lastResponse = null;
        this.isLoggedIn = this.accountService.isLoggedIn();
        this.currentUser = accountService.currentUser;
        this.roleName = "";
    }

    login(loginModel) {
        this.accountService.login(loginModel.userName, loginModel.password)
            .then(response => {
                this.lastResponse = "login successful";
                this.isLoggedIn = this.accountService.isLoggedIn();
                this.currentUser = this.accountService.currentUser;
            })
            .catch(response => {
                this.lastResponse = response;
            })
    }

    getRoles() {
        if (!this.currentUser) return;
        this.accountService.getRoles(this.currentUser.userName)
            .then(roles => {
                this.lastResponse = "get roles successful";
                this.currentUser.roles = roles;
            })
            .catch(response => {
                this.lastResponse = response;
            });
    }

    addRole(roleName) {
        if (!this.currentUser) return;
        this.accountService.addRole(this.currentUser.userName, roleName)
            .then(roles => {
                this.lastResponse = "add role successful";
            })
            .catch(response => {
                this.lastResponse = response;
            });
    }

    removeRole(roleName) {
        if (!this.currentUser) return;
        this.accountService.removeRole(this.currentUser.userName, roleName)
            .then(roles => {
                this.lastResponse = "remove role successful";
            })
            .catch(response => {
                this.lastResponse = response;
            });
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