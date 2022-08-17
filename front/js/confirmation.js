// Display the order number

const orderElement = document.getElementById("orderId");

// Get the order id in the url
const params = new URLSearchParams(document.location.search);
const orderId = params.get("orderId");
orderElement.innerText = orderId;