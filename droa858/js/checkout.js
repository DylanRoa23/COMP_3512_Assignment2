import { showToast } from "./general.js";

document.addEventListener("DOMContentLoaded", () => {

    //This is just there to clear local storage, uncomment and reload to do so
    // localStorage.clear(); 

    // Configurable Variables
    const CART_KEY = "cart";
    const BUTTON_INDEX_KEY = "index";

    const cartSize = document.querySelector("#cartSize");
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
     * Updates the summary with cart information.
     */
    function updateSummary(){
        
        // Configurable variables
        const shippingChoice = document.querySelector("#shipping-speed");
        const countryChoice = document.querySelector("#country");
        const sv = shippingChoice.value;
        const cv = countryChoice.value;
        const TAX = { // percent
            can: 0.050,
            usa: 0.065,
            int: 0.160,
        }; 
        const SHIPPING_COST = { // in dollars
            standard: {
                can: 10, usa: 15, int: 20,
            },
            express: {
                can: 25, usa: 25, int: 30,
            },
            priority: {
                can: 35, usa: 50, int: 50
            },
        }
        const SHIPPING_FREE_THRESHOLD = 500.0; // in dollars of merchandise
        const merchCostDisplay = document.querySelector("#c-merchandise-cost");
        const shipCostDisplay = document.querySelector("#c-shipping-cost");
        const taxCostDisplay = document.querySelector("#c-tax-cost");
        const totalCostDisplay = document.querySelector("#c-total-cost");
        const DECIMAL_PLACES = 2

        // Calculate.

        // Get the cart.
        const cart = localStorage.getItem(CART_KEY);

        // If the cart exists,
        if(cart){

            // Get data.
            const cartData = JSON.parse(cart);

            // Calculate merchandise cost.
            let merchandiseCost = 0.0;
            cartData.forEach(p => {

                // Each item has:
                //     id: product.id,
                //     title: product.name,
                //     price: float,
                //     quantity: number,
                //     size: string,
                //     color: rgb, 

                merchandiseCost += p.quantity * p.price;

            })

            // Set merchCost.
            merchCostDisplay.textContent = `$${merchandiseCost.toFixed(DECIMAL_PLACES)}`;

            // Calculate shipping cost.
            let shippingCost = 0.0;
            if(merchandiseCost < SHIPPING_FREE_THRESHOLD){

                // Set based on choices.
                shippingCost = SHIPPING_COST[sv][cv];

            }

            // Set shipCost.
            shipCostDisplay.textContent = `$${shippingCost.toFixed(DECIMAL_PLACES)}`;

            // Calculate tax cost.
            const taxCost = (merchandiseCost + shippingCost) * TAX[cv];
            
            // Set taxCost.
            taxCostDisplay.textContent = `$${taxCost.toFixed(DECIMAL_PLACES)}`;

            // Calculate total cost.
            const totalCost = merchandiseCost + shippingCost + taxCost;

            // Set totalCost.
            totalCostDisplay.textContent = `$${totalCost.toFixed(DECIMAL_PLACES)}`;

        }


    }
    /**
     * Re-renders the cart products, deleting old cart products.
     */
    function renderCart() {

        // Configurable variables
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        const previousProducts = document.querySelectorAll("#sections .cartSection");
        const empty = document.querySelector("#c-empty");
        const shippingSummary = document.querySelector("#c-ss");

        // Internal variables
        let index = 0;

        // Display the checkoutSection.
        checkoutSection.classList.remove("hidden");
        shippingSummary.classList.remove("hidden");
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
            shippingSummary.classList.add("hidden");
            empty.classList.remove("hidden");

        }
        // Otherwise,
        else {

            // ------------------------------ Display products in cart.

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
                template.after(clone);

            });

            // ------------------------------ Update summary.
            updateSummary();          

        }

    }
    function main() {

        // Configurable variables
        const page = document.querySelector("#checkout");
        const checkoutBtn = document.querySelector("#c-pay-button");

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

        // Listen for checkout button.
        checkoutBtn.addEventListener("click", () => {

            // Show toast.
            showToast("Order confirmed! Redirecting to home page...");

            // Clear cart.
            localStorage.removeItem(CART_KEY);

            // Update cartSize.
            cartSize.textContent = "0";

        })

    }

    main();


});
