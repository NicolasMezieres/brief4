const register = document.querySelector(".register");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const divCheckbox = document.querySelector(".checkbox");
const checkbox = document.querySelector("#acceptTermes");

const firstNameTextError = document.querySelector(".firstNameTexteError");
const lastNameTextError = document.querySelector(".lastNameTexteError");
const emailTextError = document.querySelector(".emailTexteError");
const passwordTextError = document.querySelector(".passwordTexteError");
const confirmPasswordTextError = document.querySelector(
  ".confirmPasswordTexteError"
);
const checkboxTextError = document.querySelector(".checkboxTexteError");

const patternName = /^(?!\s)[a-zA-Zéèê\s-]+$/;
const patternMail = /^[^\s]+@[a-z]+\.[a-z]{2,4}$/;
const patternPass = /^[A-Z{1}a-z{1}0-9{1}#?!@$%^&*-{1}]{8,}$/;

function verifForm(pattern, input, textError, text, isError) {
  if (!pattern.test(input.value)) {
    textError.innerText = `Ce n'est pas un ${text} valide`;
    isError = true;
  } else {
    textError.innerText = "";
  }
  return isError;
}

async function envoie() {
  event.preventDefault();
  let isError = false;
  //Vérification du regex
  isError = verifForm(
    patternName,
    firstName,
    firstNameTextError,
    "prenom",
    isError
  );
  isError = verifForm(patternName, lastName, lastNameTextError, "nom", isError);
  isError = verifForm(patternMail, email, emailTextError, "email", isError);
  isError = verifForm(
    patternPass,
    password,
    passwordTextError,
    "mot de passe",
    isError
  );
  if (password.value != confirmPassword.value) {
    console.log();
    return (confirmPasswordTextError.innerText =
      "Votre mot de passe n'est pas identique");
  }
  confirmPasswordTextError.innerText = "";
  if (checkbox.checked == false) {
    return (checkboxTextError.innerText =
      "Veuillez Accepter les termes et conditions");
  }
  checkboxTextError.innerText = "";
  //Si le regex n'a pas d'erreur
  if (isError == false) {
    let user = {
      firstName: firstName.value,
      lastName: lastName.value,
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
    let register = await fetch("http://localhost:3000/user/register", request);
    let response = await register;
    if (response.status === 200) {
      let token = await register.json();
      window.localStorage.setItem("token", token.jwt);
      window.location.href = "../Acceuil/index.html";
    } else if (response.status === 401) {
      emailTextError.innerText = "Email déja utiliser";
    }
  }
}
