// Récupération de l'id de commande + affichage de la confirmation
let id = getOrderIdParamater()
id == -1 ? displayError() : displayOrderInformations(id);

// Fonction permettant de récupérer le paramétre "orderid" de l'url
function getOrderIdParamater() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    const orderId = params.has('orderid') ? params.get('orderid') : -1;
    return orderId;
}

// Fonction permettant d'afficher le numéro de confirmation.
function displayOrderInformations(id)
{
    const articleElement = document.querySelector("#orderId");
    articleElement.innerText = id;
}

// Fonction permettant d'afficher un message d'erreur et un lien vers le panier.
function displayError() {
    const confirmationElement = document.querySelector(".confirmation");
    confirmationElement.innerHTML = ''

    const messageElement = document.createElement("p");
    messageElement.innerText = "Il semble y avoir un problème avec le numéro de commande...";

    const brElement = document.createElement("br");

    const linkElement = document.createElement("a");
    linkElement.href = "cart.html";
    linkElement.innerText = "Retour à votre panier";
    linkElement.altTxt = "Retour au panier";

    messageElement.appendChild(brElement);
    messageElement.appendChild(linkElement);

    confirmationElement.appendChild(messageElement);
   
}
