// Helper functions

/**
 * Fetch the data from the API
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
 * Display the data fetched from url
 * @param { String } url 
 */
export const displayData = async url => {
    const data = await fetchData(url);
    data.map(item => {
        insertElement(createCard(item), "#items");
    })
}

/**
* Create a card element
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
 * Append an element in the parent element
 * @param { HTMLElement } child
 * @param { String } parent class or id
 */
export const insertElement = (child, parent) => {
    const parentElement = document.querySelector(parent);
    parentElement.appendChild(child);
}