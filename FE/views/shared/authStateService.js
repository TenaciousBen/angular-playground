export class AuthStateService {
    constructor($cookies) {
        this.$cookies = $cookies;
        this.authCookieName = "token";
    }

    setToken(user, accessToken, refreshToken) {
        var token = new Token(user, accessToken, refreshToken);
        var stringifiedToken = JSON.stringify(token);
        this.$cookies.put(this.authCookieName, stringifiedToken, { domain: frontendConfig.domain });
    }

    getToken() {
        var jsonEncodedToken = this.$cookies.get(this.authCookieName);
        if (!jsonEncodedToken) return null;
        var token = JSON.parse(jsonEncodedToken);
        return token;
    }

    hasToken() {
        return !!this.getToken();
    }

    deleteToken() {
        if (!this.hasToken()) return;
        this.$cookies.put(this.authCookieName, null, { domain: frontendConfig.domain });
    }
}

class Token {
    constructor(userName, accessToken, refreshToken) {
        this.userName = userName;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}