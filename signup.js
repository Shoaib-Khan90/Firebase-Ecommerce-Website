const form = document.getElementById("signupForm");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validation
  if (name === "" || email === "" || password === "" || confirmPassword === "") {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Save data (localStorage)
  const user = {
    name: name,
    email: email,
    password: password
  };

  localStorage.setItem("user", JSON.stringify(user));

  alert("Signup successful!");

  // Redirect to login
  window.location.href = "login.html";
});