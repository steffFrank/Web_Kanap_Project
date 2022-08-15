// Functions to display the details of the product page

// Get the product id 
const productURL = new URL(window.location.href);
const id = productURL.searchParams.get("id");
const productName = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const divImg = document.querySelector(".item__img");
const img = document.createElement("img");

// Fetch data
const fetchData = async url => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}
const url = "http://localhost:3000/api/products"
const urlProduct = url + `/${id}`;

const insertDetails = async () => {
    const data = await fetchData(urlProduct);
    // Change the title of the page
    console.log(data);
    document.title = data.name;
    
    // Insert data
    productName.innerText = data.name;
    price.innerText = data.price;
    description.innerText = data.description;
    img.setAttribute("src", data.imageUrl);
    img.setAttribute("alt", data.altTxt);
    divImg.appendChild(img);
    insertOptions("#colors", data.colors);
}
insertDetails();

// insert options in select

const insertOptions = (parent, list) => {
    const selectParent = document.querySelector(parent);
    for (let val of list) {
        const optionElement = document.createElement("option");
        optionElement.value = val;
        optionElement.text = val;
        selectParent.add(optionElement);
    }
}