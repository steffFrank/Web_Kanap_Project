// Functions to display the details of the product page
import { fetchData, insertElement, showMessage, getLocalStorage, urlProducts, saveToLocalStorage } from "./helper_functions.js";
// Get the actual products in the cart
const cart = getLocalStorage("savedProducts");

// Get the needed elements
const productName = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const img = document.createElement("img");
const productQty = document.getElementById("quantity");
const cartButton = document.getElementById("addToCart");
const divButton = document.querySelector(".item__content__addButton");

// Get the Url to fetch the product
const productURL = new URL(window.location.href); // Get the url of the page
const id = productURL.searchParams.get("id");     // Get the id from the url
const urlProduct = urlProducts + `/${id}`;        // Construct the endpoint

/**
 * Insert the product data fetched from the url
 * @param { String } url 
 */
const insertDetails = async (url) => {
	const data = await fetchData(url);

	insertProductData(data);
	insertElement(img, ".item__img");
	insertOptions("#colors", data.colors);
}
insertDetails(urlProduct);

/**
 * Validate and add the product to the cart
 */
const addProductToCart = () => {
	if (validateInputs()) {
		addToCart(id);
		showMessage("Produit ajouté au panier", "#15f296", divButton);
		saveToLocalStorage("savedProducts", cart);
		resetInputs();
	}
}
// Add the product to the cart after a click on the cart button
cartButton.addEventListener("click", addProductToCart);


// Helpers Functions
/**
 * Insert the details of the product
 * @param {Object} data 
 */
const insertProductData = data => {
	document.title = data.name;
	productName.innerText = data.name;
	price.innerText = data.price;
	description.innerText = data.description;
	img.setAttribute("src", data.imageUrl);
	img.setAttribute("alt", data.altTxt);
}

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

/**
 * Add product to the cart
 * @param { String } id of the product
 * @returns void
 */
const addToCart = id => {
	for (let item of cart) {
		if (item.id === id) {
			if (Object.keys(item.colors).includes(colors.value)) {
				item.colors[colors.value] += Number(productQty.value);
			} else {
				item.colors[colors.value] = Number(productQty.value);
			}
			return;
		}
	}
	// If the id is not in the cart we add it with the color and quantity values
	cart.push({ id: id, colors: { [colors.value]: Number(productQty.value) } });
}

/**
 * Reset all the inputs
 */
const resetInputs = () => {
	productQty.value = 0;
	colors.value = "";
}

const validateInputs = () => {
	const textColor = "#fbbcbc";
	if (productQty.value <= 0 || productQty.value > 100 || colors.value == "") {
		if (productQty.value <= 0 || productQty.value > 100) {
			showMessage("Insérez un numero entre 1 et 100!", textColor, productQty);
		}
		if (colors.value == "") {
			showMessage("Sélectionnez une couleur!", textColor, colors);
		}
		return false;
	}
	return true;
}