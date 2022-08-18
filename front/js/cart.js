// Functions to manage the cart

// Import all the needed functions
import { getLocalStorage, fetchData, urlProducts, insertElement, validateField, postData, showMessage, removeElement } from "./helper_functions.js";

// Get the data from localStorage
const cart = getLocalStorage("savedProducts");
// localStorage.removeItem("savedProducts");

/**
 * Display all the products in the cartProducts array
 * @param { Array } cartProducts 
 */
const displayCartProducts = cartProducts => {
    cartProducts.map(async item => {
        // Url of the specific product
        const urlProduct = urlProducts + `/${item.id}`;
        const data = await fetchData(urlProduct);
        for (let color of Object.keys(item.colors)) {
            const itemQty = item.colors[color];
            createArticle(data, color, itemQty);
        }
        modifyProductQuantity();
        deleteArticle();
    });
}
displayCartProducts(cart);

/**
 * Modify the quantity of the input
 */
const modifyProductQuantity = () => {
    for (const element of document.querySelectorAll(".itemQuantity")) {
        element.addEventListener("change", event => {
            const actualValue = Number(event.target.value);
        
            const product = element.closest(".cart__item");
            const result = cart.map(item => {
                for (let color of Object.keys(item.colors)) {
                    if (item.id === product.dataset.id && product.dataset.color === color) {
                        if (actualValue <= 0 || actualValue > 100) {
                            showMessage("Insérez un numero entre 1 et 100!", "#fbbcbc", product);
                            removeElement(".message");
                        } else {
                            item.colors = { ...item.colors, [color]: actualValue }
                        }
                    }
                }
                return item;
            });
            localStorage.setItem("savedProducts", JSON.stringify(result));
            computeTotals();
        })
    }
}

/**
 * Delete the selected products
 */
const deleteArticle = () => {
    //  Loop through the delete button to add a listener
    for (const element of document.querySelectorAll(".deleteItem")) {
        element.addEventListener("click", () => {
            const product = element.closest(".cart__item");
            // Loop through the item of the cart to remove the specific product
            const newCart = (cart.map(item => {
                if (item.id === product.dataset.id) {
                    for (let color of Object.keys(item.colors)) {
                        if (color === product.dataset.color) {
                            product.remove();
                            // If there is a match remove the specific color product
                            delete item.colors[color];
                        }
                    }
                }
                return item;
                // Remove  all items with empty colors list
            })).filter(item => Object.keys(item.colors).length !== 0)
            // Save the new products
            localStorage.setItem("savedProducts", JSON.stringify(newCart));
            // Compute the new totals
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
        displayTotals(totalPrice, totalQuantity);
    });
    displayTotals(totalPrice, totalQuantity);
}
computeTotals();



//================================= Contact Form ==============================
const order = document.getElementById("order");
// Add a click event on the order button
order.addEventListener("click", () => {
    let contact = {};
    let productsId = [];
    let result;
    const firstName = validateField("firstName");
    const lastName = validateField("lastName");
    const address = validateField("address");
    const city = validateField("city");
    const email = validateField("email");
    if (firstName && lastName && address && city && email && cart.length !== 0) {
        contact = { firstName, lastName, address, city, email };
        cart.map(item => {
            productsId.push(item.id);
            const data = { contact: contact, products: productsId }
            const orderUrl = urlProducts + `/order`;
            // Get the result of the order Id order 
            result = postData(orderUrl, data);
            
            // Redirect to the confirmation page with orderId number
            result.then(res => document.location.href = `./confirmation.html?orderId=${res.orderId}`);

        })
    } else {
        console.log("One or more field are not correct");
    }
})

