document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Validate the login information (you may want to add more robust validation)
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Assuming you have an endpoint for handling the login request
        const url = '/login';
        const method = 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Redirect to the dashboard or another page after successful login
            // window.location.href = '/dashboard.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});
