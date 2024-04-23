import axios from 'axios';

function login(email, password) {
    const url = "https://todo-api-18-140-52-65.rakamin.com/auth/login";
    const payload = {
        email: email,
        password: password
    };
    return axios.post(url, payload)
        .then(response => {
            if (response.status === 200) {
                const token = response.data.auth_token;
                if (token) {
                    localStorage.setItem('authToken', token);
                    return token;
                } else {
                    console.log("Token not found in login response.");
                    return null;
                }
            } else {
                console.log("Login failed with status code:", response.status);
                return null;
            }
        })
        .catch(error => {
            console.log("An error occurred during login:", error);
            return null;
        });
}

export default login