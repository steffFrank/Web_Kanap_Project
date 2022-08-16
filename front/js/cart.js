// Functions to manage the cart

// Import all the needed functions
import { getLocalStorage, fetchData, urlProducts, insertElement } from "./helper_functions.js";

// Get the data from localStorage
const cart = getLocalStorage("savedProducts");

/**
 * Display all the products in the cartProducts array
 * @param { Array } cartProducts 
 */
const displayCartProducts = async cartProducts => {
    cartProducts.map( async item => {
        const urlProduct = urlProducts + `/${Object.keys(item)[0]}`
        const data = await fetchData(urlProduct);
        const colorList = Object.keys(Object.values(item)[0]);
        for (let color of colorList) {
            const itemQty = Object.values(item)[0][color];
            const article = createArticle(data, color, itemQty);
            insertElement(article, "#cart__items");
        }
        
    })
}
displayCartProducts(cart);

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
    return article
}

