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
const modal = document.getElementById("modal");

const stopPropagation = function (event) {
  event.stopPropagation();
};

// Fonction ouverture Modale //
const openModale = function (modalToOpen, event) {
  event.preventDefault();
  modalToOpen.removeAttribute("style");
  modalToOpen.removeAttribute("aria-hidden");
  modalToOpen.setAttribute("aria-modal", "true");

  modalToOpen.addEventListener("click", function (event) {
    if (event.target === modalToOpen) {
      closeModal(modalToOpen, event);
    }
  });

  const modalWrapper = modalToOpen.querySelector(".modal-wrapper");
  modalWrapper.addEventListener("click", stopPropagation);

  modalToOpen.addEventListener("click", closeModal);
};

//Fermeture modale //
const closeModal = function (modalToClose, event) {
  if (modalToClose === null) return;
  event.preventDefault();
  modalToClose.style.display = "none";
  modalToClose.setAttribute("aria-hidden", "true");
  modalToClose.setAttribute("aria-modal", "false");

  const modalWrapper = modalToClose.querySelector(".modal-wrapper");
  modalWrapper.removeEventListener("click", stopPropagation);
  modalToClose.removeEventListener("click", closeModal);
};

// Récupération des boutons //
const modifierPhotos = document
  .getElementById("modifierPhotos")
  .addEventListener("click", function (event) {
    openModale(modal, event);
  });
const btnCloseModal = document
  .getElementById("croix")
  .addEventListener("click", function (event) {
    closeModal(modal, event);
  });

// Fermeture modale avec échap //

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(modal, event);
    closeModal(modalAjoutPhoto, event);
  }
});

const btnPhoto = document.getElementById("btnPhoto");
const modalAjoutPhoto = document.getElementById("modalAjoutPhoto");

//Changement de modale //

btnPhoto.addEventListener("click", function (event) {
  closeModal(modal, event);
  openModale(modalAjoutPhoto, event);
});

const btnCloseModalAjout = document
  .getElementById("croixAjoutPhoto")
  .addEventListener("click", function (event) {
    closeModal(modalAjoutPhoto, event);
  });

const btnRetour = document.getElementById("btnRetour");

btnRetour.addEventListener("click", function (event) {
  event.preventDefault();
  closeModal(modalAjoutPhoto, event);
  openModale(modal, event);
});
