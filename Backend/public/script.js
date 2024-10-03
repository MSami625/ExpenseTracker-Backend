// SingUp Functionality
const API_BASE_URL = "http://localhost:4000";

async function handleFormSubmitSignUp(e) {
  try {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userDetails = {
      name,
      email,
      password,
    };

    const res = await axios.post(`${API_BASE_URL}/api/signup`, userDetails);
    alert(res.data.message);

    window.location.href = "./login.html";
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("An error occurred. Please try again.");
    }
  }
}

//Login Functionality
async function handleFormSubmitLogin(e) {
  localStorage.clear();
  try {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userDetails = {
      email,
      password,
    };

    const res = await axios.post(`${API_BASE_URL}/api/login`, userDetails);
    alert(res.data.message);
    localStorage.setItem("auth", res.data.token);
    window.location.href = "./Expenses/expenses.html";
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("An error occurred. Please try again.");
    }
  }
}
