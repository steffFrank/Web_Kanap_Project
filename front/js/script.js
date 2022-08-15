// Functions of the main page



// Helper functions
const fetchData = async url => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        data.map(item => {
            insertCard(item);
        })
    } catch(error) {
        console.log(error);
    }
}
const url = "http://localhost:3000/api/products"
fetchData(url);
// Create a function to load the page


/**
 * Create a card element
 * @param { Object } card 
 * @returns { HTMLElement }
 */
const createCard = card => {
    const link = document.createElement("a");
    // Create the url of the product page by using the actual url
    const productURL = window.location.href + "product.html";
    const url = new URL("product.html", window.location.href);
    url.searchParams.set("id", card._id);
    link.setAttribute("href", url);
    link.innerHTML = `<article>
                        <img src="${card.imageUrl}" alt=${card.altTxt} />
                        <h3 class="productName">${card.name}</h3>
                            <p class="productDescription">${card.description}</p>
                      </article>`;
    return link;
                
}

// Create a function to insert a card

const insertCard = child => {
    const itemsSection = document.getElementById("items");
    itemsSection.appendChild(createCard(child));
}