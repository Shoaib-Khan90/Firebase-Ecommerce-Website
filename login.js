import {
  auth,
  signInWithEmailAndPassword
} from "./firebase.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("messageText");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      message.innerText = "Login Successful ✅";
      message.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })
    .catch((error) => {
      message.innerText = error.message;
      message.style.color = "red";
    });
});