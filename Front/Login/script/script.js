const login = document.querySelector(".login");
const email = document.querySelector("#email");
const emailTexteError = document.querySelector(".emailTexteError");
const password = document.querySelector("#password");
const passwordTexteError = document.querySelector(".passwordTexteError");
const connectTexteError = document.querySelector(".connectTexteError");

const patternMail = /^[^\s]+@[a-z]+\.[a-z]{2,4}$/;
const patternPass = /^[A-Z{1}a-z{1}0-9{1}#?!@$%^&*-{1}]{8,}$/;

function verifForm(pattern, input, textError, text, isError) {
  if (!pattern.test(input.value)) {
    textError.innerText = `Ce n'est pas un ${text} valide`;
    isError = true;
  } else {
    textError.innerText = "";
  }
}

async function connect() {
  event.preventDefault();
  let isError = false;
  connectTexteError.innerText = "";
  verifForm(patternMail, email, emailTexteError, "email", isError);
  verifForm(patternPass, password, passwordTexteError, "mot de passe", isError);
  if (isError === false) {
    let user = {
      email: email.value,
      password: password.value,
    };
    let request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(user),
    };
    let login = await fetch("http://localhost:3000/user/login", request);
    if (login.status === 200) {
      let token = await login.json();
      console.log(token.jwt);
      window.localStorage.setItem("token", token.jwt);
      window.location.href = "../Acceuil/index.html";
    } else {
      connectTexteError.innerText = "Email ou mot de passe incorrect!";
    }
  }
}
