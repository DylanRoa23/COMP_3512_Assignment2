document.addEventListener("DOMContentLoaded", () => {

    //This is just there to clear local storage, uncomment and reload to do so
    // localStorage.clear(); 

    // Configurable Variables
    const CART_KEY = "cart";
    const BUTTON_INDEX_KEY = "index";

    const checkoutSection = document.querySelector("#sections");
    const template = document.querySelector("#cart-template");
    const PRODUCT_COLUMNS = 5;

    const shipping = document.querySelector("#shipping");
    const summary = document.querySelector("#summary");

    const IMAGE_SRC = "images/placeholder_item.png";

    // Functions
    /**
     * Removes an element and a given number of its following siblings.
     * @param {Element} e The starting element to remove.
     * @param {number} count The number of next siblings to remove.
     */
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
    /**
     * Removes a product
     * @param {Event} e The event.
     */
    function removeProduct(e){

        // Configurable variables
        const REMOVE_AMOUNT = 1; // Shouldn't be changed because user has no reason to group remove.
        const cartSize = document.querySelector("#cartSize");

        // Prevent the default action.
        e.preventDefault();

        // Get data.
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        const button = e.target;
        const index = button.dataset[BUTTON_INDEX_KEY];
        // Remove from cart.
        cart.splice(index, REMOVE_AMOUNT);

        // Save changes.
        localStorage.setItem(CART_KEY, JSON.stringify(cart));

        // Update cartSize
        cartSize.textContent = cart.length;

        // Re-render.
        renderCart();

    }
    /**
     * Re-renders the cart products, deleting old cart products.
     */
    function renderCart() {

        // Configurable variables
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        const previousProducts = document.querySelectorAll("#sections .cartSection");
        const empty = document.querySelector("#c-empty");

        // Internal variables
        let index = 0;

        // Display the checkoutSection.
        checkoutSection.classList.remove("hidden");
        empty.classList.add("hidden");

        // Clear the cart.
        previousProducts.forEach(p => {

            // Remove it and its columns.
            removeWithNext(p, PRODUCT_COLUMNS);

        })

        // If cart is empty, 
        if (cart.length === 0) {
            
            // Hide checkoutSection.
            checkoutSection.classList.add("hidden");
            empty.classList.remove("hidden");

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

                // Remove Button
                const button = clone.querySelector(".cartSection .cartRemoveOne");
                button.dataset[BUTTON_INDEX_KEY] = index++;
                button.addEventListener("click", removeProduct);

                // Product Section
                clone.querySelector(".cartProductName").textContent = item.title;
                clone.querySelector("img").src = IMAGE_SRC;
                clone.querySelector("img").alt = item.title;

                clone.querySelector(".cartColor > div").style.backgroundColor = item.color;
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
