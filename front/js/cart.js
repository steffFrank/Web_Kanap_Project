// Functions to manage the cart

// Import all the needed functions
import { getLocalStorage, fetchData, urlProducts, insertElement } from "./helper_functions.js";

// Get the data from localStorage
const cart = getLocalStorage("savedProducts");
// localStorage.removeItem("savedProducts");

/**
 * Display all the products in the cartProducts array
 * @param { Array } cartProducts 
 */
const displayCartProducts = cartProducts => {
    cartProducts.map( async item => {
        // Url of the specific product
        const urlProduct = urlProducts + `/${item.id}`;
        const data = await fetchData(urlProduct);
        for (let color of Object.keys(item.colors)) {
            const itemQty = item.colors[color];
            createArticle(data, color, itemQty);
        }
        modifyProduct(data);
    });
}
displayCartProducts(cart);
const modifyProduct = () => {
    for (const element of document.querySelectorAll(".itemQuantity")) {
        element.addEventListener("change", event => {
            const product = element.closest(".cart__item");                
            const result = cart.map(item => {
                for (let color of Object.keys(item.colors)) {
                    if (item.id === product.dataset.id && product.dataset.color === color) {
                        item.colors = {...item.colors, [color]: Number(event.target.value)}
                    }
                }
                return item;
            });
            localStorage.setItem("savedProducts", JSON.stringify(result));
            computeTotals();  
        })
    }
}

// Helper function
/**
 * Create an article element with all the details
 * @param { Object } cata data fetched from the id 
 * @param { String } color color of the actual product 
 * @param { Number } qty Qty of the actual product 
 * @returns HTMLElement article
 */
const createArticle = (data, color, qty) => {
    const article = document.createElement("article");
    article.className = "cart__item";
    article.setAttribute("data-id", data._id);
    article.setAttribute("data-color", color);
    article.innerHTML = `<div class="cart__item__img">
                            <img src="${data.imageUrl}" alt="${data.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${data.name}</h2>
                                <p>${color}</p>
                                <p>${data.price}</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">   <p>Qté : </p>
                                   <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>`
    insertElement(article, "#cart__items");
    // Loop through the delete button to add a listener, try to remove the duplication with input
    // for (const element of document.querySelectorAll(".deleteItem")) {
    //         element.addEventListener("click", () => {
    //             const product = element.closest(".cart__item");                
    //             if (product.dataset.id == data._id && product.dataset.color === color) {
    //                 const result = cart.filter(item => {
    //                     const colorList = Object.keys(Object.values(item)[0]);
    //                     for (let color of colorList) {
    //                         return color !== product.dataset.color && product.dataset.id !== Object.keys(item)[0];
    //                     }
    //                     return item
    //                 })
    //                 localStorage.setItem("savedProducts", JSON.stringify(result));
    //                 product.remove();
    //                 computeTotals();
    //             }
    //         })
    // }
    // Loop througn the input to add event listener, try to remove the duplication with delete
}



const computeTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    const cart = getLocalStorage("savedProducts");
    cart.map(async item => {
        const urlProduct = urlProducts + `/${item.id}`;
        const data = await fetchData(urlProduct);
        for (let color of Object.keys(item.colors)) {
            const itemQty = item.colors[color];
            console.log(data._id);
            console.log(itemQty, data.price);
            totalPrice += itemQty * data.price;
            totalQuantity += itemQty;
        }
        document.getElementById("totalPrice").innerText = totalPrice;
        document.getElementById("totalQuantity").innerText = totalQuantity;
    })
}
computeTotals();