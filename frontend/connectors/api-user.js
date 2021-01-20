const userControl = {
    async create(user) {
        try {
            let response = await fetch('/api/users/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    async list(signal) {
        try {
            let response = await fetch('/api/users/', {
                method: 'GET',
                signal: signal,
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    async read(params, credentials, signal) {
        try {
            let response = await fetch('/api/users/' + params.userId, {
                method: 'GET',
                signal: signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + credentials.t
                }
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    async update(params, credentials, user) {
        try {
            let response = await fetch('/api/users/' + params.userId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + credentials.t
                },
                body: user
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    async remove(params, credentials) {
        try {
            let response = await fetch('/api/users/' + params.userId, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + credentials.t
                }
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    async follow(params, credentials, followId) {
        try {
            let response = await fetch('/api/actions/follow/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + credentials.t
                },
                body: JSON.stringify({ userId: params.userId, followId: followId })
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    async unfollow(params, credentials, unfollowId) {
        try {
            let response = await fetch('/api/actions/unfollow/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + credentials.t
                },
                body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId })
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

   
    async findPeople(params, credentials, signal) {
        try {
            let response = await fetch('/api/actions/findpeople/' +
                params.userId, {
                method: 'GET',
                signal: signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + credentials.t
                }
            })
            return await response.json()
        } catch (err) {
            console.log(err)
        }
    },

    getPhotoUrl(userId) {
        return userId ? `/api/resources/photo/${userId}?${new Date().getTime()}`
            : '/api/resources/defaultphoto'
    }

}

export { userControl }