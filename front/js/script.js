
import {getServerUrl} from './parameter.js';

// Fonction principale de la page d'accueil. Requêtage des produits via le back, transformation en JSON, puis appel de l'affichage des produits.
fetch(getServerUrl() + 'api/products')
.then(reponse => reponse.json())
.then(products => displayAllProducts(products));


// Fonction permettant l'affichage des produits. Création de la structure HTML et remplissage des informations liées aux produits.
function displayAllProducts(products) {
    /*
    Exemple HTML:
    <a href="./product.html?id=42">
        <article>
            <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
            <h3 class="productName">Kanap name1</h3>
            <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
        </article>
    </a> 
    */
    console.log(products);
    const itemsWrapper = document.querySelector('#items');

    for (let product of products) {
        //console.log("Produit : ", product);
        const anchorElement = document.createElement("a");
        anchorElement.href = './product.html?id=' + product._id;

        const articleElement = document.createElement("article");

        const imageElement = document.createElement("img");
        imageElement.src = product.imageUrl;
        imageElement.alt = product.altTxt;

        const nameElement = document.createElement("h3");
        nameElement.className = "productName";
        nameElement.innerText = product.name;

        const descriptionElement = document.createElement("p");
        descriptionElement.className = "productDescription";
        descriptionElement.innerText = product.description;

        articleElement.appendChild(imageElement);
        articleElement.appendChild(nameElement);
        articleElement.appendChild(descriptionElement);

        anchorElement.appendChild(articleElement);

        itemsWrapper.appendChild(anchorElement);
    }
}