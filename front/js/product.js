// Functions to display the details of the product page
import { fetchData, insertElement, removeElement, showMessage, getLocalStorage, urlProducts } from "./helper_functions.js";

const cart = getLocalStorage("savedProducts");
// localStorage.removeItem("savedProducts");
console.log(cart);
// Get the product id 
const productURL = new URL(window.location.href); // Get the url of the page
const id = productURL.searchParams.get("id");     // Get the id from the url
const productName = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const img = document.createElement("img");
const qty = document.getElementById("quantity");
const cartButton = document.getElementById("addToCart");
const divButton = document.querySelector(".item__content__addButton");

// Url to fetch the product
const urlProduct = urlProducts + `/${id}`;

/**
 * Insert the product data fetched from the url
 * @param { String } url 
 */
const insertDetails = async (url) => {
    const data = await fetchData(url);
    // Change the title of the page
    document.title = data.name;
    
    // Insert data
    productName.innerText = data.name;
    price.innerText = data.price;
    description.innerText = data.description;
    img.setAttribute("src", data.imageUrl);
    img.setAttribute("alt", data.altTxt);
    insertElement(img, ".item__img");
    insertOptions("#colors", data.colors);
}
insertDetails(urlProduct);

/**
 * Insert new options in an existing select input
 * @param { String } parent, class or Id 
 * @param { Array } list 
 */
const insertOptions = (parent, list) => {
    const selectParent = document.querySelector(parent);
    for (let val of list) {
        const optionElement = document.createElement("option");
        optionElement.value = val;
        optionElement.text = val;
        selectParent.add(optionElement);
    }
}

// Add an event listener on the button
cartButton.addEventListener("click", () => {
    // const product = {};
    // Display an error message if the quantity is not between 0 and 100
    const textColor = "#770e0e";
    if (qty.value <= 0 || qty.value > 100 || colors.value == "") {
        if (qty.value <= 0 || qty.value > 100) {
            showMessage("Insérez un numero entre 1 et 100!",textColor, qty);
        }
        if (colors.value == "") {
            showMessage("Sélectionnez une couleur!", textColor, colors);
        }
    } else {
        addToCart(id);
        showMessage("Produit ajouté au panier", "#15f296", divButton);
    }
    removeElement(".message");
    localStorage.setItem("savedProducts", JSON.stringify(cart));
    qty.value = 1;
    colors.value = "";
})

/**
 * Adds products to the cart
 * @param { String } id 
 * @returns void
 */
const addToCart = id => {
    for (let item of cart) {
        if (item.id === id) {
            for (let color of Object.keys(item.colors)) {
                if (color === colors.value) {
                    item.colors[color] += Number(qty.value);
                    return;
                } else {
                    item.colors = {...item.colors, [colors.value]: Number(qty.value)};
                    return;
                }
            }
        }
    }
    cart.push({id: id, colors: {[colors.value]:Number(qty.value)}});
}

