// Helper functions

//================================= Data =======================================
// Url of all the products in the API
export const urlProducts = "http://localhost:3000/api/products";

/**
 * Fetchs the data from the API
 * @param { String } url 
 * @returns Promise
 */
export const fetchData = async url => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        // throw new Error("Request failed!");
        
    } catch (error) {
        console.log(error);
    }
}
/**
 * Post the data to the server
 * @param { String } url 
 * @param { Object } data 
 * @returns Promise that resolves an Object 
 */
export const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return response.json();
        }
        throw new Error("Request Failed!");
    } catch (error) {
        console.log(error);
    }
}
/**
 * Get the data in the local storage of a specific id
 * @param { String } id 
 * @returns Array
 */
export const getLocalStorage = id => {
    return JSON.parse(localStorage.getItem(id)) || [];
}

/**
 * Save the storage in the local storage with the id
 * @param {String} id 
 * @param {Array} storage 
 */
export const saveToLocalStorage = (id, storage) => {
    localStorage.setItem(id, JSON.stringify(storage));
}
//================================= Display ====================================
/**
 * Displays the data fetched from url
 * @param { String } url 
 */
export const displayData = async url => {
    const data = await fetchData(url);
    data.map(item => {
        insertElement(createCard(item), "#items");
    });
}

/**
 * Display an error message after the sibling element
 * @param { String } message 
 * @param { HTMLElement } sibling 
 */
export const showMessage = (message, color, sibling) => {
    insertAfter(createMessage(message, color), sibling);
    removeElement(".message");
}

//================================== Create Element ============================
/**
* Creates a card element
* @param { Object } card 
* @returns { HTMLElement }
*/
export const createCard = card => {
    const link = document.createElement("a");
    // Create the url of the product page by using the actual url
    const url = new URL("product.html", window.location.href);
    url.searchParams.set("id", card._id); // Set the id param for the card
    link.setAttribute("href", url);
    link.innerHTML = `<article>
                        <img src="${card.imageUrl}" alt=${card.altTxt} />
                        <h3 class="productName">${card.name}</h3>
                            <p class="productDescription">${card.description}</p>
                      </article>`;
    return link;
}

/**
 * Creates a paragraph message
 * @param { String } message 
 * @returns HTMLElement
 */
export const createMessage = (message, color) => {
    const par = document.createElement("p");
    par.className = "message";
    par.innerText = `${message}`;
    par.style.color = `${color}`;
    par.style.fontSize = "15px";
    par.style.margin = "10px auto";
    par.style.width = "fit-content";
    par.style.padding = "0 10px";
    par.style.textAlign = "center";
    return par;
}

//================================== Insertion =================================
/**
 * Appends an element in the parent element
 * @param { HTMLElement } child
 * @param { String } parent class or id
 */
export const insertElement = (child, parent) => {
    const parentElement = document.querySelector(parent);
    parentElement.appendChild(child);
}

/**
 * Inserts an Element after a choosen one
 * @param { HTMLElement } newElement 
 * @param { HTMLElement } siblingElement 
 */
export const insertAfter = (newElement, siblingElement) => {
    siblingElement.parentElement.insertBefore(newElement, siblingElement.nextSibling);
}

//================================= Deletion ==================================
/**
 * Remove the choosen element after a delay
 * @param { String } element class or id
 */
export const removeElement = (element) => {
    setTimeout(() => {
        const msg = document.querySelectorAll(element);
        for (let m of msg) {
            m.remove();
        }
    }, 2000);
}


//================================= Form Validation ============================
/**
 * Display the error message of the input
 * @param { String } message 
 * @param { String } id id of the element 
 */
const DisplayErrorMessage = (message, id) => {
    const element = document.getElementById(id);
    element.innerText = message;
    setTimeout(() => {
        element.innerText = "";
    }, 2000);
}

/**
 * Validate an input
 * @param { String } field input to validate
 * @param { String } displayId id of the element where to display
 * @returns the value of the validated input
 */
const validateName = (field, displayId) => {
    let message = "";
    const name = document.getElementById(field);
    const regex = new RegExp("[^a-zA-Z ]+");
    if (regex.test(name.value)) {
        message = "Les nombres et caracteres speciaux ne sont pas permis";
    } else if (name.value.length > 18) {
        message = "Juste 18 caracteres permis";
    } else if (name.value.split(" ").length >= 3) {
        message = "Juste deux noms sont permis";
    } else {
        return name.value;
    }
    DisplayErrorMessage(message, displayId);
    return;
}

/**
 * Validate an input
 * @param { String } field input to validate
 * @param { String } displayId id of the element where to display
 * @returns the value of the validated input
 */
const validateAddress = (field, displayId) => {
    let message = "";
    const regex = new RegExp("^[1-9]?[\\d]?[\\d]?[\\d]{1} \\w.+ \\d{5}");
    const address = document.getElementById(field);
    if (!regex.test(address.value)) {
        message = "Format non valide. Example: 17 rue de la vallee 90212";
        DisplayErrorMessage(message, displayId);
        return;
    } else {
        return address.value;
    }
}

/**
 * Validate an input
 * @param { String } field input to validate
 * @param { String } displayId id of the element where to display
 * @returns the value of the validated input
 */
const validateCity = (field, displayId) => {
    let message = "";
    const regex = new RegExp("[\\d]");
    const city = document.getElementById(field);
    if (regex.test(city.value)) {
        message = "Auncun nombre n'est admis";
        DisplayErrorMessage(message, displayId);
        return;
    } else {
        return city.value;
    }
}

/**
 * Validate an input
 * @param { String } field input to validate
 * @param { String } displayId id of the element where to display
 * @returns the value of the validated input
 */
const validateEmail = (field, displayId) => {
    let message = "";
    const regex = new RegExp("\\w+[.\\-_]?\\w+@\\w+\\.\\w?\\w{2}");
    const email = document.getElementById(field);
    if (!regex.test(email.value)) {
        message = "Entrez un email valide. Example jacopo@yahoo.fr";
        DisplayErrorMessage(message, displayId);
        return;
    } else {
        return email.value;
    }
}

/**
 * Validate a field
 * @param { String} field 
 * @returns the input value validated
 */
export const validateField = (field) => {
    switch (field) {
        case "firstName":
            return validateName(field, "firstNameErrorMsg");
        case "lastName":
            return validateName(field, "lastNameErrorMsg");
        case "address":
            return validateAddress(field, "addressErrorMsg");
        case "city":
            return validateCity(field, "cityErrorMsg");
        case "email":
            return validateEmail(field, "emailErrorMsg");
        default:
            return;
    }
}