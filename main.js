// Sélection du bouton de changement de ville
let villeInput = document.querySelector("#villeInput");

// Appel des fonctions de base pour affichage au lancement de la page
afficherProchainsJours();
obtenirLocalisation(recevoirTemps);
mobile();

// Événement du bouton avec appel des fonctions
villeInput.addEventListener("keypress", (event) => {
  const inputValue = event.target.value;
  const lettersOnly = /^[A-Za-z]+$/;

  if (!inputValue.match(lettersOnly)) {
    event.target.value = inputValue.replace(/[^A-Za-z]/g, " ");
  }
  if (event.key === "Enter") {
    const ville = villeInput.value;

    // Vérifier si la valeur de l'input est vide ou contient uniquement des espaces
    if (ville.trim() === "") {
      alert("Veuillez entrer une ville valide");
      return; // Arrêter l'exécution du reste du code
    }

    recevoirTemps(ville);
    afficherMeteoProchainsJours(ville);
    afficherTemperatureProchainsJours(ville);
    villeInput.value = ""; // Réinitialiser la valeur de l'input après l'événement
  }
});

//fonction pour obtenir la localisation de l'utilisateur
function obtenirLocalisation(callback) {
    //condition de la disponibilite de la géolocalisation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a3a3a0a3b9787d551def0bf9e963422c&units=metric`;
        //requete de l'API
        axios
          .get(url)
          .then(function (response) {
            const ville = response.data.name;
            callback(ville);
          })
          .catch(function (erreur) {
            console.error(erreur);
            alert("Impossible de récupérer la localisation de l'utilisateur.");
          });
      },
      function (erreur) {
        console.error(erreur);
        alert("Impossible de récupérer la localisation de l'utilisateur.");
      }
    );
  } else {
    alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
  }
}

//fonction de base pour recevoir la température et la météo de la ville géolocaliser ou demander par l'utilisateur
function recevoirTemps(ville) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=a3a3a0a3b9787d551def0bf9e963422c&units=metric`;

  axios
    .get(url)
    .then(function (response) {
      const meteoActuelle = response.data.main.temp;
      const tempsActuelle = response.data.weather[0].main;
      document.querySelector("#temperature_label").textContent = meteoActuelle.toFixed(1);
      document.querySelector("#ville").textContent = ville;
      document.querySelector("#temps_label").textContent = tempsActuelle;

      afficherTemperatureProchainsJours(ville, tempsActuelle);
      afficherMeteoProchainsJours(ville);
      afficherImageMeteo(tempsActuelle);
      afficherSvgMeteo(tempsActuelle);
    })
    .catch(function (erreur) {
      console.error(erreur);
      alert("Une erreur est survenue, merci de réessayer plus tard");
    });
}

//fonction pour afficher les prochains jours.
function afficherProchainsJours() {
  const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const dateActuelle = new Date();
  const jourActuel = dateActuelle.getDay();

  const joursSpans = document.querySelectorAll(".liste-jours div");

  for (let i = 1; i <= 4; i++) {
    const prochainJour = (jourActuel + i) % 7;
    const spanJour = joursSpans[i - 1].querySelector("span:first-child");
    spanJour.textContent = joursSemaine[prochainJour];
  }
}

//fonction pour afficher la température des prochains jours
function afficherTemperatureProchainsJours(ville) {
  const joursSpans = document.querySelectorAll(".liste-jours div");

  const apiKey = `a3a3a0a3b9787d551def0bf9e963422c`; //

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apiKey}&units=metric`;
//requete API
  axios
    .get(url)
    .then(function (response) {
      const previsionList = response.data.list;

      for (let i = 1; i <= 4; i++) {
        const prevision = previsionList[i];
        const spanJour = joursSpans[i - 1].querySelector("span:nth-child(2)");
        const spanId = `futur_temps_${i}`;

        const temperatureProchainJour = prevision.main.temp;
        spanJour.id = spanId;
        spanJour.textContent = `${temperatureProchainJour.toFixed(1)}°C`;
      }
    })
    .catch(function (erreur) {
      console.error(erreur);
      alert("Une erreur est survenue, merci de réessayer plus tard");
    });
}

//fonction pour afficher la météo des prochains jours
function afficherMeteoProchainsJours(ville) {
  const joursSpans = document.querySelectorAll(".liste-jours div");

  const apiKey = `a3a3a0a3b9787d551def0bf9e963422c`; // Remplacez par votre clé d'API OpenWeatherMap

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apiKey}&units=metric`;
//requete API
  axios
    .get(url)
    .then(function (response) {
      const previsionList = response.data.list;

      for (let i = 1; i <= 4; i++) {
        const prevision = previsionList[i * 8 - 1].weather[0].main; // Obtenir la météo pour le même jour à 12h (index * 8 - 1)
        const spanJour = joursSpans[i - 1].querySelector("span:last-child");
        const spanId = `futur_weather_${i}`;

        spanJour.id = spanId;
        spanJour.textContent = prevision;
      }
    })
    .catch(function (erreur) {
      console.error(erreur);
      alert("Une erreur est survenue, merci de réessayer plus tard");
    });
}




//objet litéraux contenant les chemins des images
let images = {
    Clear: "url('image/beau-temps.jpg')",
    Rain: "url('image/pluie.jpg')",
    Clouds: "url('image/cloud.jpg')",
    Brouillard: "url('image/brouillard.jpg')",
};

let svg = {
  Clear: "svg/sun.svg",
  Rain : "svg/rain.svg",
  Clouds: "svg/cloud.svg",
}


//fonction pour afficher les images selon la témpérature météo.
function afficherImageMeteo(tempsActuelle) {
  var body = document.querySelector("body");

  switch (tempsActuelle) {
    case "Clear":
      body.style.backgroundImage = images.Clear;
      body.classList.add("img");
      break;

    case "Rain":
      body.style.backgroundImage = images.Rain;
      body.classList.add("img");
      break;

    case "Clouds":
      body.style.backgroundImage = images.Clouds;
      body.classList.add("img");
      break;

    case "Haze":
      body.style.backgroundImage = images.Clouds;
      body.classList.add("img");
      break;

    case "Mist":
      body.style.backgroundImage = images.Brouillard;
      body.classList.add("img");

    default:
      body.classList.remove("img");
      break;
  }
};


// Fonction pour afficher les svg de la météo. 
function afficherSvgMeteo(tempsActuelle) {
  var svgElement = document.querySelector("#svg");

  switch (tempsActuelle) {
    case "Clear":
      svgElement.innerHTML = `<img class="svg" src="${svg.Clear}" alt="Clear">`;
      break;

    case "Rain":
      svgElement.innerHTML = `<img class="svg" src="${svg.Rain}" alt="Rain">`;
      break;

    case "Clouds":
      svgElement.innerHTML = `<img class="svg" src="${svg.Clouds}" alt="Clouds">`;
      break;

    default:
      svgElement.textContent = "";
      break;
  }
}

function mobile() {
  if (window.innerWidth <= 425) {
    let villeInput = document.querySelector("#villeInput");
    let card = document.querySelector(".main-card");
    card.appendChild(villeInput);
  }
}