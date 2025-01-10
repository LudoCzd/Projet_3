const travaux = await fetch("http://localhost:5678/api/works").then((travaux) =>
  travaux.json()
);
const categories = await fetch("http://localhost:5678/api/categories").then(
  (categories) => categories.json()
);

const gallery = document.querySelector(".gallery");
gallery.innerHTML = "";
for (let i = 0; i < travaux.length; i++) {
  const figure = document.createElement("figure");

  const imageElement = document.createElement("img");
  imageElement.src = travaux[i].imageUrl;
  const titreElement = document.createElement("figcaption");
  titreElement.innerText = travaux[i].title;
  figure.appendChild(titreElement);
  figure.appendChild(imageElement);

  gallery.appendChild(figure);
}

const portfolio = document.querySelector("#porfolio");
const divFiltres = document.createElement("div");
