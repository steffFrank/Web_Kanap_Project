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
fetchData("http://localhost:3000/api/products");
// Create a function to load the page


// Create a function to create a card

const createCard = card => {
    const link = document.createElement("a");
    link.setAttribute("href", "#");
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