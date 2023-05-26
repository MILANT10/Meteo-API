let bouton = document.querySelector("#changer");

// Appeler la fonction recevoirTemperature avec la localisation par défaut de l'utilisateur
obtenirLocalisation(recevoirTemperature);

bouton.addEventListener("click", () => {
  ville = prompt("Veuillez entrer le nom d'une ville");
  recevoirTemperature(ville);
});

function obtenirLocalisation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a3a3a0a3b9787d551def0bf9e963422c&units=metric`;

        let requete = new XMLHttpRequest();
        requete.open("GET", url);

        requete.responseType = "json";
        requete.send();

        requete.onload = function () {
          if (requete.readyState === XMLHttpRequest.DONE) {
            if (requete.status === 200) {
              let reponse = requete.response;
              let ville = reponse.name; // Récupérer le nom de la ville à partir de la réponse de l'API
              callback(ville); // Appeler la fonction de callback avec la ville par défaut
            } else {
              alert("Impossible de récupérer la localisation de l'utilisateur.");
            }
          }
        };
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

function recevoirTemperature(ville) {
  // Mettre à jour l'URL avec la nouvelle valeur de ville
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=a3a3a0a3b9787d551def0bf9e963422c&units=metric`;

  let requete = new XMLHttpRequest();
  requete.open("GET", url);

  requete.responseType = "json";
  requete.send();

  requete.onload = function () {
    if (requete.readyState === XMLHttpRequest.DONE) {
      if (requete.status === 200) {
        let reponse = requete.response;
        console.log(reponse);
        let meteoActuelle = reponse.main.temp;
        console.log(meteoActuelle);
        document.querySelector("#temperature_label").textContent =
          meteoActuelle;
        document.querySelector("#ville").textContent = ville;
      } else {
        alert("Une erreur est survenue, merci de réessayer plus tard");
      }
    }
  };
}
