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
        modifyProduct();
        deleteArticle(item);
    });
}
displayCartProducts(cart);

/**
 * Modify the quantity of the input
 */
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

const deleteArticle = () => {
    //  Loop through the delete button to add a listener
    for (const element of document.querySelectorAll(".deleteItem")) {
            element.addEventListener("click", () => {
                const product = element.closest(".cart__item");
                const newCart = (cart.map(item => {
                    if (item.id === product.dataset.id) {
                        for (let color of Object.keys(item.colors)) {
                            if (color === product.dataset.color) {
                                product.remove();
                                delete item.colors[color];
                            }
                        }
                    }
                    return item;

                })).filter(item => Object.keys(item.colors).length !== 0)
                    localStorage.setItem("savedProducts", JSON.stringify(newCart));
                    computeTotals();
            });
    }
}
// Helper function
/**
 * Create an article element with all the details
 * @param { Object } data data fetched from the id 
 * @param { String } color color of the actual product 
 * @param { Number } qty Qty of the actual product 
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
}
/**
 * Display the totals
 * @param { Number } totalPrice 
 * @param { Number } totalQuantity 
 */
const displayTotals = (totalPrice, totalQuantity) => {
    document.getElementById("totalPrice").innerText = totalPrice;
    document.getElementById("totalQuantity").innerText = totalQuantity;
}

/**
 * Compute the totals of the products
 */
const computeTotals = () => {
    // Declare and initialize each total
    let totalPrice = 0;
    let totalQuantity = 0;
    // Get the actual items in the cart
    const cart = getLocalStorage("savedProducts");
    // Loop through each item of the cart and sum up the quantities and prices
    cart.map(async item => {
        const urlProduct = urlProducts + `/${item.id}`;
        const data = await fetchData(urlProduct);
        for (let color of Object.keys(item.colors)) {
            const itemQty = item.colors[color];
            totalPrice += itemQty * data.price;
            totalQuantity += itemQty;
        }
        displayTotals(totalPrice,totalQuantity);
    });
    displayTotals(totalPrice, totalQuantity);
}
computeTotals();

