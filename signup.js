import {
  auth,
  provider,
  signInWithPopup
} from "./firebase.js";

const googleBtn = document.getElementById("googleBtn");
const message = document.getElementById("messageText");

googleBtn.addEventListener("click", () => {

  signInWithPopup(auth, provider)
    .then((result) => {

      const user = result.user;

      message.innerText = "Google Login Successful ✅";
      message.style.color = "green";

      console.log(user);

      // redirect
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

    })
    .catch((error) => {
      message.innerText = error.message;
      message.style.color = "red";
    });

});

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