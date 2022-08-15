// Functions to display the details of the product page
import { fetchData, insertElement } from "./helper_functions.js";
// Get the product id 
const productURL = new URL(window.location.href);
const id = productURL.searchParams.get("id");
const productName = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const img = document.createElement("img");
const qty = document.getElementById("quantity");

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

// const cartButton = document.getElementById("addToCart");
// cartButton.addEventListener("click", () => {
//     if (qty.value <= 0) {
//         showMessage("Please insert a number between 1 and 100", qty)
//     }
//     if (colors.value == "") {
//         showMessage("Please select a color", colors);
//     }
// })

// const showMessage = (message, sibbling) => {
//     const div = document.createElement("div");
//     div.className = "message";
//     div.innerHTML = `<p>${message}</p>`;
//     div.style.color = "#911818";
//     div.style.fontSize = "12px";
//     div.style.margin = "5px";
//     div.style.width = "fit-content";
//     div.style.padding = "0 10px";
//     div.style.textAlign = "center";
//     const parent = sibbling.parentElement;
//     parent.appendChild(div);
// }