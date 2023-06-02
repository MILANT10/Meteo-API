let bouton = document.querySelector(".change_button");
afficherProchainsJours();
obtenirLocalisation(recevoirTemps);

bouton.addEventListener("click", () => {
  const ville = prompt("Veuillez entrer le nom d'une ville");
  recevoirTemps(ville);
  afficherMeteoProchainsJours(ville);
  afficherTemperatureProchainsJours(ville);
});

function obtenirLocalisation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a3a3a0a3b9787d551def0bf9e963422c&units=metric`;

        axios
          .get(url)
          .then(function (response) {
            const ville = response.data.name; // Récupérer le nom de la ville à partir de la réponse de l'API
            callback(ville); // Appeler la fonction de callback avec la ville par défaut
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

      afficherTemperatureProchainsJours(ville, tempsActuelle); // Passer le paramètre tempsActuelle
      afficherImageMeteo(tempsActuelle); // Passer le paramètre tempsActuelle
    })
    .catch(function (erreur) {
      console.error(erreur);
      alert("Une erreur est survenue, merci de réessayer plus tard");
    });
}


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

function afficherTemperatureProchainsJours(ville) {
  const joursSpans = document.querySelectorAll(".liste-jours div");

  const apiKey = `a3a3a0a3b9787d551def0bf9e963422c`; // Remplacez par votre clé d'API OpenWeatherMap

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apiKey}&units=metric`;

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

function afficherMeteoProchainsJours(ville) {
  const joursSpans = document.querySelectorAll(".liste-jours div");

  const apiKey = `a3a3a0a3b9787d551def0bf9e963422c`; // Remplacez par votre clé d'API OpenWeatherMap

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apiKey}&units=metric`;

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



function afficherImageMeteo(tempsActuelle) {
    var body = document.querySelector("body");

    switch (tempsActuelle) {
        case "Clear":
            body.style.backgroundImage = "url('image/beau-temps.jpg')";
            body.classList.add("img");
            break;

        case "Rain":
            body.style.backgroundImage = "url('image/pluie.jpg')";
            body.classList.add("img");
            break;

        case "Clouds":
            body.style.backgroundImage = "url('image/cloud.jpg')";
            body.classList.add("img");
            break;
    
        default:
            body.classList.remove("img");
            break;
    }
}




// let images = {
//   Clear : "url('image/beau-temps.jpg')",
//   Rain : "('image\pluie.jpg')",


// };

