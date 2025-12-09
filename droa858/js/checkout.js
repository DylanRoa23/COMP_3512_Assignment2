document.addEventListener("DOMContentLoaded", () => {

    //This is just there to clear local storage, uncomment and reload to do so
    // localStorage.clear(); 

    // Configurable Variables
    const checkoutSection = document.querySelector("#sections");
    const template = document.querySelector("#cart-template");
    const PRODUCT_COLUMNS = 5;

    const shipping = document.querySelector("#shipping");
    const summary = document.querySelector("#summary");

    const IMAGE_SRC = "images/placeholder_item.png";

    // Functions
    function removeWithNext(e, count) {

        // Initialize
        let current = e;

        // For every next column,
        for (let i = 0; i <= count; i++) {

            // Advance
            let next = current.nextElementSibling;

            // Remove
            current.remove();

            // Advance
            current = next;
        }

    }
    function renderCart() {

        // Configurable variables
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const previousProducts = document.querySelectorAll("#sections .cartSection");
        
        // Clear the cart.
        previousProducts.forEach(p => {

            // Remove it and its columns.
            removeWithNext(p, PRODUCT_COLUMNS);

        })

        // If cart is empty, 
        if (cart.length === 0) {

            // Display message.
            checkoutSection.textContent = "Your cart is empty.";

        }
        // Otherwise,
        else {

            // For every cart item,
            cart.forEach(item => {

                // Each item has:
                //     id: product.id,
                //     title: product.name,
                //     price: float,
                //     quantity: number,
                //     size: string,
                //     color: rgb, 

                // Clone and insert.
                const clone = template.content.cloneNode(true);

                // Product Section
                clone.querySelector(".cartProductName").textContent = item.title;
                clone.querySelector("img").src = IMAGE_SRC;
                clone.querySelector("img").alt = item.title;

                clone.querySelector(".cartColor").textContent = item.color;
                clone.querySelector(".cartSize").textContent = item.size;
                clone.querySelector(".cartPrice").textContent = "$" + item.price.toFixed(2);

                let qty = item.quantity ?? 1;
                clone.querySelector(".cartQuantity").textContent = qty;
                clone.querySelector(".cartSubtotal").textContent = "$" + (item.price * qty).toFixed(2);

                // Insert before shipping + summary
                checkoutSection.insertBefore(clone, shipping);

            });

        }

    }
    function main() {

        // Configurable variables
        const page = document.querySelector("#checkout");

        // Observe class changes on the page element. This page only loads when this happens.
        new MutationObserver(mutations => {

            // For every mutation,
            mutations.forEach(mutation => {

                // If the mutation was displaying the page,
                if (mutation.attributeName === "class" && mutation.target === page && !page.classList.contains('hidden')) {

                    // Render the cart.
                    renderCart();

                }

            });

        }).observe(page, { attributes: true }); // Observe changes including class changes

    }

    main();


});
