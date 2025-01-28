const travaux = await fetch("http://localhost:5678/api/works").then((travaux) =>
  travaux.json()
);
const categories = await fetch("http://localhost:5678/api/categories").then(
  (categories) => categories.json()
);
// Création dynamiquement de la galerie avec tous les projets//

const gallery = document.querySelector(".gallery");

function afficherProjets(projets) {
  gallery.innerHTML = "";
  for (let i = 0; i < projets.length; i++) {
    const figure = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = projets[i].imageUrl;
    const titreElement = document.createElement("figcaption");
    titreElement.innerText = projets[i].title;
    figure.appendChild(imageElement);
    figure.appendChild(titreElement);
    gallery.appendChild(figure);
  }
}
afficherProjets(travaux);

const projetsCategories = document.querySelector(".projetsCategories");

//Création du bouton "Tous"//

const boutonTous = document.createElement("button");
boutonTous.innerText = "Tous";
boutonTous.classList.add("filtres");
projetsCategories.appendChild(boutonTous);

boutonTous.addEventListener("click", function () {
  afficherProjets(travaux);
});
// Boucle for pour assigner les nom de catégories aux boutons //

for (let i = 0; i < categories.length; i++) {
  const boutonFiltres = document.createElement("button");
  boutonFiltres.innerText = categories[i].name;
  boutonFiltres.classList.add("filtres");
  projetsCategories.appendChild(boutonFiltres);
  // fonctionnement boutons filtre //
  boutonFiltres.addEventListener("click", function () {
    const projetsFiltres = travaux.filter(function (projet) {
      return projet.categoryId === categories[i].id;
    });
    afficherProjets(projetsFiltres);
  });
}
// Modification du bouton login lorsqu'un token est présent //
const btnLogout = document.getElementById("btnLogout");
const token = window.localStorage.getItem("token");
if (token) {
  btnLogout.innerText = "logout";
  projetsCategories.innerHTML = "";
}
// Retrait du token lorsque logout est cliqué //
btnLogout.addEventListener("click", function () {
  window.localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Fonction ouverture Modale //
const openModale = function (event) {
  event.preventDefault();
  const modal = document.getElementById("modal");
  modal.removeAttribute("style");
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
};

document.getElementById("modifierPhotos").addEventListener("click", openModale);

const btnCloseModal = document.getElementById("croix");

//Fermeture modale //

btnCloseModal.addEventListener("click", function () {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-modal", "false");
});
