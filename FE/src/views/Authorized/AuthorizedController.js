export class AuthorizedController {
    constructor(usersService) {
        this.usersService = usersService;
        this.users = [];
        this.text = null;
        this.lastResponse = null;
    }

    getUsers() {
        this.usersService.get()
            .then(users => {
                this.users = users;
                this.lastResponse = "got users";
            })
            .catch(response => {
                this.lastResponse = response;
            });
    }

    adminFunction(text) {
        this.usersService.adminFunction(text)
            .then(response => {
                this.lastResponse = response;
            })
            .catch(response => {
                this.lastResponse = response;
            });
    }
}