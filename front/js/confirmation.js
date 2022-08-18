// Display the order number
// Empty the cart to prepare for another order
localStorage.removeItem("savedProducts");
const orderElement = document.getElementById("orderId");
// Display order number
orderElement.innerText = new URLSearchParams(document.location.search).get("orderId");