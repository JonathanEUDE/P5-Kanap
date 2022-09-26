// Appel de la fonction principale permettant l'affichage du contenu du panier
displayCartElements();

// fonction permettant de retourner l'URL du Serveur NodeJS (back).
function getServerUrl()
{
    const SERVER_URL = "http://localhost:3000/api/"
    return SERVER_URL;
}

// Fonction permettant la récupération du contenu du panier dans le localStorage.
function getAllProductsInCart() {
  const products = JSON.parse(localStorage.getItem("cart") || "[]");
  return products;
}

// Fonction permettant de requêter un produit auprès du back via un id.
async function getProductById(id) {
  const reponse = await fetch(getServerUrl() + 'products/' + id);
  const product = await reponse.json();
  return product;
}

// Fonction permettant l'affichage des produits présents dans le panier (localStorage)
// Si le panier est vide, affichage d'un message d'information + un lien vers la page d'accueil.
async function displayCartElements() {
  /* <!--  <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
               <div class="cart__item__img">
                 <img src="../images/product01.jpg" alt="Photographie d'un canapé">
               </div>
               <div class="cart__item__content">
                 <div class="cart__item__content__description">
                   <h2>Nom du produit</h2>
                   <p>Vert</p>
                   <p>42,00 €</p>
                 </div>
                 <div class="cart__item__content__settings">
                   <div class="cart__item__content__settings__quantity">
                     <p>Qté : </p>
                     <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                   </div>
                   <div class="cart__item__content__settings__delete">
                     <p class="deleteItem">Supprimer</p>
                   </div>
                 </div>
               </div>
             </article>-->*/

  const cartItemsWrapper = document.querySelector('#cart__items');

  const products = getAllProductsInCart();

  if (products.length > 0) {
    let amount = 0.00;
    let nbItems = 0;
    for (let product of products) {

      const productObj = await getProductById(product.id);

      const articleElement = document.createElement("article");
      articleElement.className = "cart__item";
      articleElement.dataset.id = product.id;
      articleElement.dataset.color = product.color;

      const divImgElement = document.createElement("div");
      divImgElement.className = "cart__item__img";

      const imgElement = document.createElement("img");
      imgElement.src = productObj.imageUrl;
      imgElement.alt = productObj.altTxt;

      divImgElement.appendChild(imgElement);
      articleElement.appendChild(divImgElement);

      const divItemContentElement = document.createElement("div");
      divItemContentElement.className = "cart__item__content";

      const divItemContentDescElement = document.createElement("div");
      divItemContentDescElement.className = "cart__item__content__description";

      const nameElement = document.createElement("h2");
      nameElement.innerText = productObj.name;

      const colorElement = document.createElement("p");
      colorElement.innerText = product.color;

      const priceElement = document.createElement("p");
      priceElement.innerText = productObj.price;

      divItemContentDescElement.appendChild(nameElement);
      divItemContentDescElement.appendChild(colorElement);
      divItemContentDescElement.appendChild(priceElement);

      divItemContentElement.appendChild(divItemContentDescElement);

      const divItemContentSettingsElement = document.createElement("div");
      divItemContentSettingsElement.className = "cart__item__content__settings";

      const divItemContentSettingsQuantityElement = document.createElement("div");
      divItemContentSettingsQuantityElement.className = "cart__item__content__settings__quantity";

      const quantityElement = document.createElement("p");
      quantityElement.innerText = "Qté : ";

      const quantityInputElement = document.createElement("input");
      quantityInputElement.type = "number";
      quantityInputElement.className = "itemQuantity";
      quantityInputElement.name = "itemQuantity";
      quantityInputElement.min = "1";
      quantityInputElement.max = "100";
      quantityInputElement.value = product.quantity;

      amount += productObj.price * product.quantity;
      nbItems += parseInt(product.quantity);

      divItemContentSettingsQuantityElement.appendChild(quantityElement);
      divItemContentSettingsQuantityElement.appendChild(quantityInputElement);
      divItemContentSettingsElement.appendChild(divItemContentSettingsQuantityElement);

      const divItemContentSettingsDeleteElement = document.createElement("div");
      divItemContentSettingsDeleteElement.className = "cart__item__content__settings__delete";

      const deleteElement = document.createElement("p");
      deleteElement.innerText = "Supprimer";
      deleteElement.className = "deleteItem";

      divItemContentSettingsDeleteElement.appendChild(deleteElement);

      articleElement.appendChild(divImgElement);
      articleElement.appendChild(divItemContentElement);
      articleElement.appendChild(divItemContentSettingsElement);
      articleElement.appendChild(divItemContentSettingsDeleteElement);

      cartItemsWrapper.appendChild(articleElement);

    }

    const nbItemsElement = document.querySelector("#totalQuantity");
    nbItemsElement.innerText = nbItems;

    const amountElement = document.querySelector("#totalPrice");
    amountElement.innerText = amount;

    addListenerDeleteProductInCart();
    addListenerChangeQuantityInCart();
    addListenerOrderCart();
  }else {
    const cartWrapper = document.querySelector('.cart');
    cartWrapper.innerHTML = '';

    const informationElement = document.createElement("p");
    informationElement.innerText = "Votre panier est vide."

    const brElement = document.createElement("br");

    const linkElement = document.createElement("a");
    linkElement.href = "index.html";
    linkElement.innerText = "Retour à l'accueil";
    linkElement.altTxt = "Retour accueil";

    informationElement.appendChild(brElement);
    informationElement.appendChild(linkElement);

    cartWrapper.appendChild(informationElement);
    
  }
}

// fonction permettant l'ajout d'un listener sur le bouton de suppression.
function addListenerDeleteProductInCart() {
  const deleteButtons = document.getElementsByClassName("deleteItem");
  for (var i = 0; i < deleteButtons.length; i++) {
    let id = deleteButtons[i].closest(".cart__item").dataset.id;
    let color = deleteButtons[i].closest(".cart__item").dataset.color;
    deleteButtons[i].addEventListener("click", function (event) {
      deleteProductInCart(id, color);
    });
  }
}

// fonction permettant la suppression d'un article dans le panier (localStorage).
function deleteProductInCart(id, color) {
  if (window.confirm("Souhaitez-vous réellement supprimer cet article de votre panier ?")) {
    const products = getAllProductsInCart();
    let newCart = products.filter(e => {
      return e.id != id || (e.id === id && e.color != color);
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    location.reload();
  }
}

// fonction permettant l'ajout d'un listener sur l'input de changement de quantité
function addListenerChangeQuantityInCart() {
  const quantityButtons = document.getElementsByClassName("itemQuantity");

  for (var i = 0; i < quantityButtons.length; i++) {
    let id = quantityButtons[i].closest(".cart__item").dataset.id;
    let color = quantityButtons[i].closest(".cart__item").dataset.color;

    quantityButtons[i].addEventListener("input", function (event) {
      updateQuantityInCart(id, color, event.data);
    });
  }
}

// fonction permettant de mettre à jour la quantité d'un article selon son id et sa couleur.
function updateQuantityInCart(id, color, quantity) {
  const products = getAllProductsInCart();
  products.forEach(e => {
    if (e.id === id && e.color === color) {
      e.quantity = quantity;
    }
  })
  localStorage.setItem("cart", JSON.stringify(products));
  location.reload();
}

// fonction permettant l'ajout d'un listener sur le bouton permettant de commander le panier actuel.
function addListenerOrderCart() {
  const orderForm = document.querySelector(".cart__order__form");
  orderForm.addEventListener("submit", orderedCart);

}

// fonction permettant de passer commande du panier actuel, avec les informations du formulaire de contact.
function orderedCart(event) {
  const productsObj = getAllProductsInCart();
  let contact = getContact(event);
  if (productsObj.length > 0) {
    if (checkContact(contact)) {


      let products = productsObj.map(e => e.id);

      fetch(getServerUrl() + "products/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contact, products })
      })
        .then((res) => res.json())
        .then(res => {
          window.location.replace("confirmation.html?orderid=" + res.orderId);
          localStorage.setItem("cart", "");
        })
    }
  }
  else {
    alert("Votre panier est vide !");
  }
  event.preventDefault();
}

// Fonction permettant de créer un "contact" sur la base des informations présentent dans le formulaire.
function getContact(event) {
  let contact = {
    firstName: event.target.querySelector("[name=firstName]").value,
    lastName: event.target.querySelector("[name=lastName]").value,
    address: event.target.querySelector("[name=address]").value,
    city: event.target.querySelector("[name=city]").value,
    email: event.target.querySelector("[name=email]").value
  }
  return contact;
}

// Fonction permettant de vérifier que le contact respecte toutes les "normes" souhaitées.
function checkContact(contact) {
  clearErrorMessage();
  let contactIsOk = true;
  if (!checkName(contact.firstName.trim())) {
    contactIsOk = false;
    displayErrorMessage("firstName");
  }
  if (!checkName(contact.lastName.trim())) {
    contactIsOk = false;
    displayErrorMessage("lastName");
  }
  //On ne fait aucun test sur address
  //contact.address
  if (!checkName(contact.city.trim())) {
    contactIsOk = false;
    displayErrorMessage("city");
  }
  if (!checkEmail(contact.email.trim())) {
    contactIsOk = false;
    displayErrorMessage("email");
  }

  return contactIsOk;
}

// Fonction permettant de vérifier le format d'un mail.
function checkEmail(mail) {
  const emailRegEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/gi);
  return emailRegEx.test(mail);
}

// Fonction permettant de vérifier le format d'un nom (Nom, Prénom, Ville, etc.)
function checkName(name) {
  const nameRegEx = new RegExp(/^[a-zA-Z]+([-\s]?[a-zA-Z]+)*$/gi);
  return nameRegEx.test(name);
}

// Fonction permettant d'effacer les messages d'erreurs sur les élements du formulaire.
function clearErrorMessage() {
  const elementsErrorMessage = document.querySelectorAll("[id*='ErrorMsg']");
  elementsErrorMessage.forEach(e => e.innerText = "");
}

// Fonction permettant d'afficher les messages d'erreurs sur les éléments du formulaire.
function displayErrorMessage(elementName) {
  console.log(elementName);
  const elementErrorMsg = document.getElementById(elementName + "ErrorMsg");
  elementErrorMsg.innerText = (elementName === "email" ? "Merci de saisir votre email avec un format valide !" : "Ne peut contenir que des lettres avec un espace ou un tiret intermédiaire.");
}