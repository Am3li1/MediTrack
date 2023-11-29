document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('forgot-password-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('forgot-email').value;

        // Validate the email (you may want to add more robust validation)
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Assuming you have an endpoint for handling the forgot password request
        const url = '/forgot-password';
        const method = 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Redirect to a page for entering the OTP
            window.location.href = '/enter-otp.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
