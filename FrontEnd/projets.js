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

//Retour vers la première modale//

const btnRetour = document.getElementById("btnRetour");

btnRetour.addEventListener("click", function (event) {
  event.preventDefault();
  closeModal(modalAjoutPhoto, event);
  openModale(modal, event);
});
// Insertion et suppression des images dans la première modale//
const divPhotosModale = document.getElementById("divPhotosModale");

for (const projet of travaux) {
  const figureModale = document.createElement("figure");
  const photoModale = document.createElement("img");
  photoModale.src = projet.imageUrl;
  const iconeSuppression = document.createElement("i");
  iconeSuppression.classList.add("fa-solid", "fa-trash-can", "iconeSuppr");
  iconeSuppression.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `http://localhost:5678/api/works/${projet.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        photoModale.remove();
        iconeSuppression.remove();
      }
    } catch (error) {
      console.error("Erreur réseau", error);
    }
  });

  figureModale.appendChild(photoModale);
  figureModale.appendChild(iconeSuppression);
  divPhotosModale.appendChild(figureModale);
}
// Insertion des catégories dans l'input Ajout photo //
const categorieSelect = document.getElementById("categorieAjout");
for (let i = 0; i < categories.length; i++) {
  const optionCategorie = document.createElement("option");
  optionCategorie.innerText = categories[i].name;
  optionCategorie.setAttribute("value", categories[i].id);
  categorieSelect.appendChild(optionCategorie);
}

// Vérification si tous les champs du form sont remplis //

const formAjout = document.querySelector("#inputAjoutModale form");
const btnvaliderPhoto = document.getElementById("btnValiderPhoto");
const inputFichier = document.getElementById("inputAjoutFichier");
const inputTitre = document.getElementById("titreAjout");
const selectCategorie = document.getElementById("categorieAjout");

function verifierForm() {
  const verifierFichier = inputFichier.files.length > 0;
  const verifierTitre = inputTitre.value.trim() !== "";
  const verifierCategorie = selectCategorie.value !== "";

  if (verifierFichier && verifierTitre && verifierCategorie) {
    btnvaliderPhoto.classList.remove("disabled");
  } else {
    btnvaliderPhoto.classList.add("disabled");
  }

  inputFichier.addEventListener("change", verifierForm);
  inputTitre.addEventListener("input", verifierForm);
  selectCategorie.addEventListener("change", verifierForm);
}

verifierForm();

// Ajout d'un fichier depuis la modale //
formAjout.addEventListener("submit", async function (event) {
  event.preventDefault();

  const image = inputFichier.files[0];
  const titre = inputTitre.value;
  const categorie = selectCategorie.value;

  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", titre);
  formData.append("category", categorie);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status} `);
    }
    const data = await response.json();
    console.log("Ajout effectué:", data);
  } catch (error) {
    console.error("Erreur lors de l'ajout", error);
  }
});
