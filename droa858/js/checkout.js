document.addEventListener("DOMContentLoaded", () => {

    //This is just there to clear local storage, uncomment and reload to do so
    // localStorage.clear(); 

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const checkoutSection = document.querySelector("#sections");
    const template = document.querySelector("#cart-template");

    const shipping = document.querySelector("#shipping");
    const summary = document.querySelector("#summary");

    if (cart.length === 0) {
        checkoutSection.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach(item => {

        const clone = template.content.cloneNode(true);

        // Product Section
        clone.querySelector(".cartProductName").textContent = item.title;
        clone.querySelector("img").src = "images/placeholder_item.png";
        clone.querySelector("img").alt = item.title;

        clone.querySelector(".cartColor").textContent = item.color ?? "--";
        clone.querySelector(".cartSize").textContent = item.size ?? "--";
        clone.querySelector(".cartPrice").textContent = "$" + item.price.toFixed(2);
        
        let qty = item.quantity ?? 1;
        clone.querySelector(".cartQuantity").textContent = qty;
        clone.querySelector(".cartSubtotal").textContent = "$" + (item.price * qty).toFixed(2);

        // Insert before shipping + summary
        checkoutSection.insertBefore(clone, shipping);

    });

});
