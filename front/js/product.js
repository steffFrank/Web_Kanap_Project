// Functions to display the details of the product page
import { fetchData, insertElement, createMessage } from "./helper_functions.js";
// Get the product id 
const productURL = new URL(window.location.href);
const id = productURL.searchParams.get("id");
const productName = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const img = document.createElement("img");
const qty = document.getElementById("quantity");
const cartButton = document.getElementById("addToCart");

// Url to fetch the product
const url = "http://localhost:3000/api/products";
const urlProduct = url + `/${id}`;

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

// Save data in local storage
// const cart = [[id1, color1, qty], [id1, color2, qty], [id1, color3, qty], ...[id1000, color1000, qty]];
// const cart = [{id: id1, color: color1, qty: qty}, {id: id1, color: color2, qty: qty}, {id: id1, color: color3, qty: qty}]
// const cart = {
//     id1: {
//         color1: qty1,
//         color2: qty2,
//         color3: qty3
//     },
//     id2: {
//         color1: qty1,
//         color2: qty2,
//         color3: qty3
//     }
// }
// localStorage.setItem("savedProducts", JSON.stringify(data));

// Add an event listener on the button
cartButton.addEventListener("click", () => {
    // Display an error message if the quantity is not between 0 and 100
    if (qty.value <= 0 || qty.value > 100) {
        showMessage("Insérez un numero entre 1 et 100!", qty);
        qty.value = 1;
    }
    if (colors.value == "") {
        showMessage("Sélectionnez une couleur!", colors);
    }
    setTimeout(() => {
        removeMessage();
    }, 3000);
})


const showMessage = (message, sibbling) => {
    const parent = sibbling.parentElement;
    parent.appendChild(createMessage(message));
}

const removeMessage = () => {
    const msg = document.querySelectorAll(".message");
    for (let m of msg) {
        m.remove();
    }
}