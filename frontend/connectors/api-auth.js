const auth = {

    async signin(user) {
        try {
            let response = await fetch('/auth/signin/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(user)
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    async signout() {
        try {
            let response = await fetch('/auth/signout/', { method: 'GET' })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    authenticate(jwt, cb) {
        if (typeof window !== "undefined")
            sessionStorage.setItem('jwt', JSON.stringify(jwt))
        cb()
    },

    isAuthenticated() {
        if (typeof window == "undefined") {
            return false
        }

        if (sessionStorage.getItem('jwt')) {
            return JSON.parse(sessionStorage.getItem('jwt'))
        }

        return false
    },

    clearJWT(cb) {
        if (typeof window !== "undefined")
            sessionStorage.removeItem('jwt')
        cb()
        this.signout().then((data) => {
            document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        })
    }
}

export default auth;
