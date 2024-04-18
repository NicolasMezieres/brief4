const event = document.querySelector(".event");
const title = document.querySelector("#title");
const image = document.querySelector("#image");
const description = document.querySelector("#description");
const maxParticipant = document.querySelector("#maxParticipant");
const date = document.querySelector("#date");

const errorImage = document.querySelector(".errorImage");
const errorDate = document.querySelector(".errorDate");
const errorText = document.querySelector(".errorText");

maxParticipant.addEventListener("input", () => {
  if (maxParticipant.value >= 99) {
    maxParticipant.value = 99;
  } else if (maxParticipant.value <= 2) {
    maxParticipant.value = 2;
  }
});

async function essaie(event) {
  event.preventDefault();
  //mise en forme pour que le format de la date soit accepté
  let dateValue = date.value.replace("T", "-T");
  let token = window.localStorage.getItem("token");
  errorText.innerText = "";
  errorDate.innerText = "";
  errorImage.innerText = "";
  if (!dateValue) {
    return (errorDate.innerText = "Veuillez remplir la date");
  }
  let infoEvent = {
    title: title.value,
    image: image.value,
    description: description.value,
    maxParticipant: maxParticipant.value,
    date: dateValue,
  };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(infoEvent, token),
  };
  let creatEvent = await fetch("http://localhost:3000/event/create", request);
  let errorMsg = await creatEvent.json();
  console.log(errorMsg);
  console.log(await creatEvent);
  if (creatEvent.status === 200) {
    window.location.href = "../Acceuil/index.html";
  } else if (creatEvent.status === 401) {
    window.localStorage.removeItem("token");
    window.location.href = "../Login/index.html";
  } else if (
    creatEvent.status === 400 &&
    errorMsg.error === "please send a URL"
  ) {
    errorImage.innerText = "Veuillez rentrer un URL valide!";
  } else if (creatEvent.status === 400) {
    errorText.innerText = "Veuillez remplire tous les champs";
  } else {
    errorText.innerText = "Error";
  }
}
