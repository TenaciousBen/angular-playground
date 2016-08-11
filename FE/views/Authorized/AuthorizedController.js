class AuthorizedController {
    constructor(usersService) {
        this.usersService = usersService;
        this.users = [];
        this.error = null;
    }

    getUsers() {
        this.usersService.get()
            .then(users => {
                this.users = users;
            })
            .catch(error =>
                this.error = error);
    }
}

angular.module("playground").controller("authorizedController", ["usersService", AuthorizedController]);