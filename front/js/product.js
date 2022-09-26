// Fonction principale de la page produit. Requêtage depuis le back de la fiche produit en utilisant le paramétre contenu dans l'url.
// Si la requête est OK, on transforme en JSON, sinon NULL
// Affichage des informations du produit, sinon affichage de l'erreur avec l'id récupéré.
fetch(getServerUrl() + 'products/' + getIdParamater())
    .then(reponse => { if (!reponse.ok) { throw Error(reponse.statusText) } return reponse.json() })
    .then(product => product ? displayProductInformations(product) : displayError(getIdParamater()))
    .catch((error) => { displayError(getIdParamater()); console.log(error); });

// Fonction permettant de retourner l'URL du Serveur NodeJS (back).
function getServerUrl() {
    const SERVER_URL = "http://localhost:3000/api/"
    return SERVER_URL;
}

// Fonction permettant de récupérer le paramétre id de l'url du produit (pro)
function getIdParamater() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    const productId = params.has('id') ? params.get('id') : -1;
    return productId;
}

// Fonction permettant d'afficher l'erreur indiquant que l'id passé en paramétre n'existe pas.
function displayError(badId) {
    const articleElement = document.querySelector("article");
    articleElement.innerHTML = ''

    const messageElement = document.createElement("p");
    messageElement.innerText = "L'identifiant " + badId + " n'existe pas dans notre base d'articles.";

    const linkElement = document.createElement("a");
    linkElement.href = "index.html";
    linkElement.innerText = "Retour à la liste des produits";
    linkElement.altTxt = "Retour à l'accueil";

    articleElement.appendChild(messageElement);
    articleElement.appendChild(linkElement);
}

// Fonction permettant d'afficher la fiche article et ses données.
function displayProductInformations(product) {
    // Image
    const itemImage = document.querySelector('.item__img');

    const imageElement = document.createElement("img");
    imageElement.src = product.imageUrl;
    imageElement.alt = product.altTxt;

    itemImage.appendChild(imageElement);

    // Titre
    const titleElement = document.querySelector("#title");
    titleElement.innerText = product.name;

    const titlePageElement = document.querySelector("title");
    titlePageElement.innerText = product.name;


    // Prix
    const priceElement = document.querySelector("#price");
    priceElement.innerText = product.price;

    // Description
    const descriptionElement = document.querySelector("#description");
    descriptionElement.innerText = product.description;

    const colorsElement = document.querySelector("#colors");

    for (let color of product.colors) {
        const colorOption = document.createElement("option");
        colorOption.value = color;
        colorOption.innerText = color;
        colorsElement.appendChild(colorOption);
    }

    addListenerAddToCart();
}

// Fonction permettant l'ajout d'un article dans le panier.
function addToCart() {
    const nb = parseInt(document.querySelector("#quantity").value);
    const color = document.querySelector("#colors").value;
    const productId = getIdParamater()

    if (nb > 0 && color && productId) {
        let product = {
            id: productId,
            color: color,
            quantity: nb
        }

        let cart = JSON.parse(localStorage.getItem("cart") || "[]");

        let productIdInCart = -1;
        for (let p in cart) {
            if (cart[p].id === productId && cart[p].color === color) {
                productIdInCart = p;
                break;
            }
        }
        if (productIdInCart === -1) {
            cart.push(product);
        }
        else {
            cart[productIdInCart].quantity = parseInt(cart[productIdInCart].quantity) + nb;
        }
        localStorage.setItem("cart", JSON.stringify(cart));

        alert('Article(s) ajouté(s) au panier !')

    } else {
        alert("Merci de vérifier votre choix de couleur et la quantité !");
    }
}

// Fonction permettant d'ajouter un listener sur le bouton d'ajout.
function addListenerAddToCart() {
    const addToCartButton = document.querySelector("#addToCart");
    addToCartButton.addEventListener("click", function (event) {
        addToCart();
    });
}