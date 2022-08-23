// Import all the needed functions and variables
import { getLocalStorage, fetchData, urlProducts, insertElement, validateField, postData, showMessage, saveToLocalStorage } from "./helper_functions.js";

// Get the data from localStorage
const cart = getLocalStorage("savedProducts");

/**
 * Display all the products in the saved in the local storage array
 * @param { Array } cartProducts 
 */
const displayCartProducts = cartProducts => {
    cartProducts.map(async item => {
        // Url of the specific product
        const urlProduct = urlProducts + `/${item.id}`;
        const data = await fetchData(urlProduct);
        for (let model of item.models) {
            // const itemQty = model.qty;
            createArticle(data, model);
            modifyProductQuantity(item, model);
        }
        deleteArticle();
    });
}
displayCartProducts(cart);


//================================= Contact Form ==============================

// Get the button element to add the event listener to
const order = document.getElementById("order");
// Place the order after clicking the button
order.addEventListener("click", (event) => {
    event.preventDefault();
    placeOrder();
});



//================================== Helper functions ==========================

/**
 * Modify dinamically the quantities in the cart
 * @param { Object } item 
 * @param { String } color 
 */
 const modifyProductQuantity = (item, model) => {
    // Loop through the each input element
    for (const element of document.querySelectorAll(".itemQuantity")) {
        const product = element.closest(".cart__item");

        // Add an event listener to the correct element
        if (product.dataset.id === item.id && product.dataset.color === model.color) {
            element.addEventListener("change", event => {
                const actualNumber = Number(event.target.value);
                event.preventDefault();
                // Validate the input
                if (actualNumber < 1 || actualNumber > 100) {
                    showMessage("Entrer une valeur entre 1 et 100", "#fbbcbc", product);
                } else {
                    model.qty = actualNumber;
                    // Modify the total displayed
                    computeTotals();
                    // Save the new values in the local storage
                    saveToLocalStorage("savedProducts", cart);
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
                    for (let model of item.models) {
                        if (model.color === product.dataset.color) {
                            product.remove();
                            // If there is a match remove the specific color product
                            item.models = removeItemFromList(item.models, model);
                        }
                    }
                }
                return item;
                // Remove  all items with empty colors list
            })).filter(item => item.models.length !== 0)
            // Save the new products
            saveToLocalStorage("savedProducts", newCart);
            // Compute the new totals
            computeTotals();
        });
    }
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
    // Loop through each item of the cart and sum up the quantities and prices
    cart.map(async item => {
        const urlProduct = urlProducts + `/${item.id}`;
        const data = await fetchData(urlProduct);
        for (let model of item.models) {
            
            totalPrice += model.qty * data.price;
            totalQuantity += model.qty;
        }
        displayTotals(totalPrice, totalQuantity);
    });
    // Show zeros if the cart is empty
    displayTotals(totalPrice, totalQuantity);
}
// When we enter the cart
computeTotals();


/**
 * Place the order and redirect to the confirmation page
 */
 const placeOrder = async () => {
    // Show an error message if the cart is empty 
    if (isEmptyCart()) {
        return;
    }
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
        });

        const data = { contact: contact, products: productsId }
        const orderUrl = urlProducts + `/order`;
        // Get the result of the order Id order 
        const result = await postData(orderUrl, data);
        // Redirect to the confirmation page with orderId number
        window.location.replace(`./confirmation.html?orderId=${result.orderId}`);
    } else {
        console.log("One or more field are not correct");
    }
}


/**
 * Create an article element of the product with all its details
 * @param { Object } data data fetched from the id 
 * @param { Object } model Object of color and quantity values of the actual product 
 */
const createArticle = (data, model) => {
    const article = document.createElement("article");
    article.className = "cart__item";
    article.setAttribute("data-id", data._id);
    article.setAttribute("data-color", model.color);
    article.innerHTML = `<div class="cart__item__img">
                            <img src="${data.imageUrl}" alt="${data.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${data.name}</h2>
                                <p>${model.color}</p>
                                <p>${data.price}</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">   <p>Qté : </p>
                                   <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${model.qty}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>`
    insertElement(article, "#cart__items");
}


const isEmptyCart = () => {
    // Get the actual value of the cart
    const cart = getLocalStorage("savedProducts");
    if (cart.length === 0) {
        const totalQty = document.querySelector(".cart__price");
        showMessage("Le panier est vide! Veuillez choisir au moins un article", "#fbbcbc", totalQty);
        return true;
    } else {
        return false;
    }
}

const removeItemFromList = (list, item) => {
    return list.splice(0, list.indexOf(item)).concat(list.splice(list.indexOf(item) + 1));
}