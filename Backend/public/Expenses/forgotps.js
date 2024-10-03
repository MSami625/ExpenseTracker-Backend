document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const email = document.getElementById('forgotEmail').value;
    const message = document.getElementById('message');

    if (email) {
        try {
            const response = await axios.post('http://localhost:4000/password/forgotpassword', { email });
            message.textContent = response.data.message;
            message.style.color = 'green';
            
            const resetToken = response.data.resetToken;
            if (resetToken) {
                localStorage.setItem('resetToken', resetToken);
                document.getElementById('forgotPasswordForm').style.display = 'none';
                document.getElementById('resetPasswordForm').style.display = 'block';
            }
        } catch (error) {
            message.textContent = error.response.data.message;
            message.style.color = 'red';
        }
    } else {
        message.textContent = 'Please enter a valid email address.';
        message.style.color = 'red';
    }
});


document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const password = document.getElementById('newPassword').value;
    const message = document.getElementById('message');
    const resetToken = localStorage.getItem('resetToken');

    try {
        const response = await axios.post('http://localhost:4000/password/resetpassword', { password, resetToken });
        message.textContent = response.data.message;
        message.style.color = 'green';
        localStorage.removeItem('resetToken');
        alert('Password reset successful. Please login with your new password.');
        window.location.href = '../login.html';
    } catch (error) {
        message.textContent = error.response.data.message;
        message.style.color = 'red';
    }
});
