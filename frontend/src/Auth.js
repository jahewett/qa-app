import auth0 from 'auth0-js';

class Auth {
    constructor(){
        this.auth0 = new auth0.WebAuth({
            domain: 'jahew-dev.eu.auth0.com',
            audience: 'https://jahew-dev.eu.auth0.com/userinfo',
            clientID: 'F10XLFz4szoTK8VzKI2dDjMZv6YJLHoe',
            redirectUri: 'http://localhost:3000/callback',
            responseType: 'id_token',
            scope: 'openid profile'
        });

        this.getProfile = this.getProfile.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.setSession = this.setSession.bind(this);
        this.silentAuth = this.silentAuth.bind(this);
    }

    getProfile() {
        return this.profile;
    }

    getIdToken() {
        return this.idToken;
    }

    isAuthenticated() {
        return new Date().getTime() < this.expiresAt;
    }

    signIn() {
        this.auth0.authorize();
    }

    handleAuthentication() {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash((err, authResult) => {
                if (err) {
                    return reject(err);
                }

                if (!authResult || !authResult.idToken) {
                    return reject(err);
                }

                this.setSession(authResult);
                resolve();
            });
        })
    }

    setSession(authResult) {
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;

        // Set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;
    }

    signOut() {
        this.auth0.logout({
            returnTo: 'http://localhost:3000',
            clientID: 'F10XLFz4szoTK8VzKI2dDjMZv6YJLHoe',
        });
    }

    silentAuth() {
        return new Promise((resolve, reject) => {
            this.auth0.checkSession({}, (err, authResult) => {
                if(err) {
                    return reject(err);
                }

                this.setSession(authResult);
                resolve();
            });
        });
    }
}

const auth0Client = new Auth();

export default auth0Client;