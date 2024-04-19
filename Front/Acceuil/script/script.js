// entre max participant et date <p class="event-location py-1">Lieu :</p>;
const body = document.querySelector("body");
const main = document.querySelector("main");
const events = document.querySelector(".events");
let token = window.localStorage.getItem("token");
function verifToken() {
  token = window.localStorage.getItem("token");
  if (!token) {
    window.location.href = "../Login/index.html";
  }
}
function inputNumber(number, min, max) {
  if (number.value >= parseInt(max)) {
    number.value = max;
  } else if (number.value <= parseInt(min)) {
    number.value = min;
  }
}
async function afficheEvent() {
  let apiCall = await fetch("http://localhost:3000/event/all");
  let result = await apiCall.json();
  result.forEach((element, i) => {
    let event = document.createElement("div");
    event.classList.add(`event${i}`);
    let date = element.date.split("-T");
    let list = element.listParticipant;
    event.innerHTML = `
    <div class="event bg-orange-500 w-2/3 mx-auto flex flex-col items-center rounded-xl px-2">
        <h2 class="event-title text-center my-2">${element.title}</h2>
        <img class="w-11/12 rounded-xl py-2" src="${element.image}"/>
        <p class="w-full event-description max-h-24 bg-slate-400 border-y border-black overflow-auto text-center py-2 px-2">
            ${element.description}
        </p>
        <p class="w-full text-center border-t border-black pt-1 pb-3 text-center">le</p>
        <p class="w-full date text-center text-green-900 border-b border-black pt-1 pb-3 text-center">${date[0]}</p>
        <p class="w-full text-center border-t border-black pt-1 pb-3 text-center">Horaire</p>
        <p class="w-full hours text-center text-green-900 border-b border-black pt-1 pb-3 text-center">${date[1]}</p>
        <p class="w-full text-center border-t border-black pt-1">Nombre de participant max</p>        
        <p class="w-full text-center text-green-900 border-b border-black event-maxParticipant${i} py-1">${element.listParticipant}/${element.maxParticipant}</p>
        <button onclick="joinEvent('${element._id}','${list}','${element.maxParticipant}','.btn-${i}','${i}')" class="bg-orange-200 rounded-3xl border border-orange-200 px-4 py-2 my-4 duration-500 hover:border-black active:bg-black active:text-white btn-${i}">Rejoindre l'évenement</button>
      </div> `;
    events.appendChild(event);
    let btn = document.querySelector(`.btn-${i}`);
    if (list == element.maxParticipant) {
      btn.removeAttribute("onclick");
      btn.classList.add("btnDisable");
      btn.classList.remove("bg-orange-200");
      btn.classList.remove("border-orange-200");
      btn.innerText = "COMPLET !";
    }
  });
}
function removeModal(overlay, modal) {
  overlay.remove();
  modal.remove();
  body.classList.remove("overflow-hidden");
}
afficheEvent();

async function joinEvent(annonceId, listParticipant, maxParticipant, btnId, i) {
  let btn = document.querySelector(btnId);
  let participant = document.querySelector(`.event-maxParticipant${i}`);
  verifToken();
  let annonce = {
    annonceId: annonceId,
  };
  let request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annonce),
  };
  let addParticipant = await fetch(
    "http://localhost:3000/event/addParticipant",
    request
  );

  let response = await addParticipant;
  btn.classList.add("btnDisable");
  btn.removeAttribute("onclick");
  btn.classList.remove("bg-orange-200");
  btn.classList.remove("border-orange-200");
  if (response.status === 200) {
    listParticipant++;
    if (listParticipant != maxParticipant) {
      btn.innerText = "Inscrit !";
      return (participant.innerText = `${listParticipant}/${maxParticipant}`);
    } else {
      return (
        (btn.innerText = "Complet !"),
        (participant.innerText = `${listParticipant}/${maxParticipant}`)
      );
    }
  }
  btn.innerText = "Déja inscrit!";
}
async function myEvents() {
  verifToken();
  let divMyEvents = document.querySelector("#myEvents");
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
  };
  let apiCall = await fetch("http://localhost:3000/event/myEvent", request);
  let response = await apiCall;
  if (response.status === 401) {
    window.localStorage.removeItem("token");
    window.location.href = "../Login/index.html";
  } else if (response.status === 200) {
    let result = await apiCall.json();
    divMyEvents.innerHTML = "";
    result.forEach((element, i) => {
      let event = document.createElement("div");
      event.classList.add(`myEvent${i}`);
      let date = element.date.split("-T");
      event.innerHTML = `
    <div class="event bg-orange-500 w-2/3 mx-auto flex flex-col items-center rounded-xl px-2">
        <h2 class="event-title text-center my-2">${element.title}</h2>
        <img class="w-11/12 rounded-xl py-2" src="${element.image}"/>
        <p class="w-full event-description max-h-24 bg-slate-400 border-y border-black overflow-auto text-center py-2 px-2">
            ${element.description}
        </p>
        <p class="w-full text-center border-t border-black pt-1 pb-3 text-center">le</p>
        <p class="w-full event-date text-center text-green-900 border-b border-black pt-1 pb-3 text-center">${date[0]}</p>
        <p class="w-full text-center border-t border-black pt-1 pb-3 text-center">Horaire</p>
        <p class="w-full event-hours text-center text-green-900 border-b border-black pt-1 pb-3 text-center">${date[1]}</p>
        <p class="w-full text-center border-t border-black pt-1">Nombre de participant max</p>        
        <p class="w-full text-center text-green-900 border-b border-black event-maxParticipant${i} py-1">${element.listParticipant}/${element.maxParticipant}</p>
        <div class="flex gap-3">
        <button onclick="deleteEvent('${element._id}','${i}')" class="btn-del${i} bg-black text-white rounded-3xl border border-orange-200 px-4 py-2 my-4 duration-500 hover:border-black active:bg-black active:text-white btn-${i}">Supprimer l'évenement!</button>
        <button onclick="modalEvent('${element._id}','${element.date}','${element.listParticipant}','${element.maxParticipant}','${i}')" class="btn-update${i} bg-black text-white rounded-3xl border border-orange-200 px-4 py-2 my-4 duration-500 hover:border-black active:bg-black active:text-white btn-${i}">Modifier</button>
        </div>
      </div> `;
      divMyEvents.appendChild(event);
    });
    let myEvents = document.querySelector(".myEventsTitle");
    myEvents.classList.remove("hidden");
  }
}

async function deleteEvent(element, i) {
  verifToken();
  let myEvent = document.querySelector(`.myEvent${i}`);
  let elementDelete = {
    _id: element,
  };
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(elementDelete),
  };
  let eventDelete = await fetch("http://localhost:3000/event/delete", request);
  let result = await eventDelete;
  if (result.status == 200) {
    console.log("Suppression réussie");
    myEvent.remove();
  }
  // unauthorized
  else if (result.status == 401) {
    window.localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "../Login/index.html";
    }, 1000);
  } else {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

async function modalEvent(id, date, listParticipant, maxParticipant, i) {
  date = date.replace("-T", "T");
  console.log(listParticipant);
  let event = document.querySelector(`.myEvent${i}`);
  let title = document.querySelector(`.myEvent${i} .event .event-title`);
  let image = document.querySelector(`.myEvent${i} .event img`);
  let description = document.querySelector(
    `.myEvent${i} .event .event-description`
  );
  let modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
  <button class="exitModal bg-red-500 px-3 py-1 rounded-3xl absolute right-2 duration-300 border border-red-500 hover:">X</button>
  <label for="title" class="pb-2 pt-8">Titre</label>
  <input id="title" value="${title.innerText}" class="w-3/5 mb-6 rounded-3xl text-center" type="text"/>
   <label for="image">URL d'une Image</label> 
  <input id="image" value="${image.src}" class="w-4/5 mb-6 rounded-3xl text-center" type="url"/>
   <label for="description">Description</label>
   <input id="description" value="${description.innerText}" class="w-4/5 mb-6 rounded-3xl text-center" type="text"/>
    <label for="maxParticipant">Nombre de participants</label>
   <input id="maxParticipant" class="w-1/12 text-center mb-6" min="${listParticipant}" value="${maxParticipant}" max="99" type="number"/>
   <label for="date">Aura lieu le</label>
   <input id="date" value="${date}" class="w-1/10 mb-6" type="datetime-local" />
   <p id="modalError" class="rounded-xl text-red-600 px-4 py-2 mb-2"></p>
   <button onclick="modifyEvent('${id}','${i}')" class="bg-black text-white rounded-3xl px-4 py-2 border border-white duration-500 hover:border-black active:bg-red-500">Confirmer<button>
   `;
  main.appendChild(modal);
  let overlay = document.createElement("div");
  overlay.classList.add("overlay");
  main.appendChild(overlay);
  body.classList.add("overflow-hidden");
  overlay.addEventListener("click", () => {
    removeModal(overlay, modal);
  });
  let exitModal = document.querySelector(".exitModal");
  exitModal.addEventListener("click", () => {
    removeModal(overlay, modal);
  });
  let verifyInputNumber = document.querySelector("#maxParticipant");
  console.log(verifyInputNumber);
  verifyInputNumber.addEventListener("input", () => {
    inputNumber(verifyInputNumber, listParticipant, 99);
  });
}

async function modifyEvent(eventId, i) {
  verifToken();
  let title = document.querySelector(`#title`).value;
  let image = document.querySelector(`#image`).value;
  let description = document.querySelector(`#description`).value;
  let maxParticipant = document.querySelector("#maxParticipant").value;
  let date = document.querySelector("#date").value;
  let modalError = document.querySelector("#modalError");

  let overlay = document.querySelector(".overlay");
  let modal = document.querySelector(".modal");

  if (!title || !image || !description || !maxParticipant || !date) {
    return (
      (modalError.innerText = "Veuillez remplire tous les champs"),
      (modalError.style.backgroundColor = "black")
    );
  } else {
    modalError.innerText = "";
    modalError.style.backgroundColor = "transparent";
  }
  date = date.replace("T", "-T");
  let event = {
    annonceId: eventId,
    title: title,
    image: image,
    description: description,
    maxParticipant: maxParticipant,
    date: date,
  };
  let request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  };
  let updateEvent = await fetch("http://localhost:3000/event/patch", request);
  let response = updateEvent;
  if (response.status === 200 || updateEvent.json() === "Nothing to modify") {
    //on retire la modal et l'overlay
    removeModal(overlay, modal);
    //on modifie l'affichage des evenements
    let titleMyEvent = document.querySelector(`.myEvent${i} .event-title`);
    let titleEvent = document.querySelector(`.event${i} .event-title`);
    titleMyEvent.innerText = title;
    titleEvent.innerText = title;
    let imageMyEvent = document.querySelector(`.myEvent${i} img`);
    let imageEvent = document.querySelector(`.event${i} img`);
    imageMyEvent.src = image;
    imageEvent.src = image;
    let descriptionMyEvent = document.querySelector(
      `.myEvent${i} .event-description`
    );
    let descriptionEvent = document.querySelector(
      `.event${i} .event-description`
    );
    descriptionMyEvent.innerText = description;
    descriptionEvent.innerText = description;
    date = date.split("-T");
    let dateMyEvent = document.querySelector(`.myEvent${i} .date`);
    let dateEvent = document.querySelector(`.event${i} .date`);
    dateMyEvent.innerText = date[0];
    dateEvent.innerText = date[0];
    let hoursMyEvent = document.querySelector(`.myEvent${i} .hours`);
    let hoursEvent = document.querySelector(`.event${i} .hours`);
    hoursEvent.innerText = date[1];
    hoursMyEvent.innerText = date[1];
  } else if (response.status === 400) {
    let error = await updateEvent.json();
    modalError.style.backgroundColor = "black";
    if (error.error === "please send a URL") {
      modalError.innerText = "Veuillez rentrer un URL Valide !";
    } else if (error.error === "please send a Date") {
      modalError.innerText = "Veuillez remplire correctement la date";
    }
  } else if (response.status === 401) {
    window.localStorage.removeItem("token");
    window.location.href = "../Login/index.html";
  } else {
    window.location.reload();
  }
}
