// Helper functions

/**
 * Fetchs the data from the API
 * @param { String } url 
 * @returns Promise
 */
export const fetchData = async url => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}

/**
 * Displays the data fetched from url
 * @param { String } url 
 */
export const displayData = async url => {
    const data = await fetchData(url);
    data.map(item => {
        insertElement(createCard(item), "#items");
    })
}

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

// Create a function to insert a card
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
 * Creates a paragraph message
 * @param { String } message 
 * @returns HTMLElement
 */
export const createMessage = message => {
    const par = document.createElement("p");
    par.className = "message";
    par.innerText = `${message}`;
    par.style.color = "#ce3333";
    par.style.fontSize = "12px";
    par.style.margin = "5px auto";
    par.style.width = "fit-content";
    par.style.padding = "0 10px";
    par.style.textAlign = "center";
    return par;
}

/**
 * Inserts an Element after a choosen one
 * @param { HTMLElement } newElement 
 * @param { HTMLElement } siblingElement 
 */
export const insertAfter = (newElement, siblingElement) => {
    siblingElement.parentElement.insertBefore(newElement, siblingElement.nextSibling)
}

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
    }, 3000);
}

/**
 * Display an error message after the sibling element
 * @param { String } message 
 * @param { HTMLElement } sibling 
 */
export const showMessage = (message, sibling) => {
    insertAfter(createMessage(message), sibling);
}