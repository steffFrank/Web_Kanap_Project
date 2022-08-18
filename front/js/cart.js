// Import all the needed functions and variables
import { getLocalStorage, fetchData, urlProducts, insertElement, validateField, postData, showMessage, removeElement } from "./helper_functions.js";

// Get the data from localStorage
const cart = getLocalStorage("savedProducts");

/**
 * Create an article element of the product with all its details
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
 * Display all the products in the saved in the local storage array
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
            modifyProductQuantity(item, color);
        }
        deleteArticle();
    });
}
displayCartProducts(cart);

/**
 * Modify dinamically the quantities in the cart
 * @param { Object } item 
 * @param { String } color 
 */
const modifyProductQuantity = (item, color) => {
    // Loop through the each input element
    for (const element of document.querySelectorAll(".itemQuantity")) {
        const product = element.closest(".cart__item");

        // Add an event listener to the correct element
        if (product.dataset.id === item.id && product.dataset.color === color) {
            element.addEventListener("change", event => {
                const actualNumber = Number(event.target.value);
                event.preventDefault();
                // Validate the input
                if (actualNumber < 1 || actualNumber > 100) {
                    showMessage("Entrer une valeur entre 1 et 100", "#fbbcbc", product);
                    removeElement(".message");
                } else {
                    // Modify the input if it is correct
                    item.colors = { ...item.colors, [color]: Number(event.target.value) }
                    // Modify the total displayed
                    computeTotals();
                    // Save the new values in the local storage
                    localStorage.setItem("savedProducts", JSON.stringify(cart));
                }
            })
        }
    }
}

/**
 * Delete the selected product
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



//================================= Contact Form ==============================
/**
 * Place the order and redirect to the confirmation page
 */
const placeOrder = () => {
    const order = document.getElementById("order");

    // Add a click event on the order button
    order.addEventListener("click", () => {
        let contact = {}; // To save the data of the form
        let productsId = []; // To save the ids of the product in cart

        // Form field validation
        const firstName = validateField("firstName");
        const lastName = validateField("lastName");
        const address = validateField("address");
        const city = validateField("city");
        const email = validateField("email");

        // Check if everything is correct 
        if (firstName && lastName && address && city && email && cart.length !== 0) {
            contact = { firstName, lastName, address, city, email };
            cart.map(item => {
                productsId.push(item.id);
                const data = { contact: contact, products: productsId }
                const orderUrl = urlProducts + `/order`;
                // Get the result of the order Id order 
                const result = postData(orderUrl, data);

                // Redirect to the confirmation page with orderId number
                result.then(res => document.location.href = `./confirmation.html?orderId=${res.orderId}`);

            })
        } else {
            console.log("One or more field are not correct");
        }
    })
}

placeOrder();


//================================== Helper functions ==========================

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
}
computeTotals();
