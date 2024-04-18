// entre max participant et date <p class="event-location py-1">Lieu :</p>;
const events = document.querySelector(".events");
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
        <h2 class="event-title my-2">${element.title}</h2>
        <img class="w-11/12 rounded-xl py-2" src="${element.image}"/>
        <p class="w-full event-description max-h-24 bg-slate-400 border-y border-black overflow-auto text-center py-2 px-2">
            ${element.description}
        </p>
        <p class="w-full text-center border-t border-black pt-1 pb-3 text-center">le</p>
        <p class="w-full text-center text-green-900 border-b border-black pt-1 pb-3 text-center">${date[0]}</p>
        <p class="w-full text-center border-t border-black pt-1 pb-3 text-center">A</p>
        <p class="w-full text-center text-green-900 border-b border-black pt-1 pb-3 text-center">${date[1]}</p>
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
afficheEvent();

async function joinEvent(annonceId, listParticipant, maxParticipant, btnId, i) {
  let btn = document.querySelector(btnId);
  let participant = document.querySelector(`.event-maxParticipant${i}`);
  let token = window.localStorage.getItem("token");
  if (!token) {
    window.location.href = "../Register/index.html";
  }
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
