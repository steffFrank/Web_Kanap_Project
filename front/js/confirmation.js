// Display the order number

const orderElement = document.getElementById("orderId");

// Display order number
orderElement.innerText = new URLSearchParams(document.location.search).get("orderId");