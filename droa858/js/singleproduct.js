import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

    // Configurable Variables
    const page = document.querySelector("#singleproduct");
    const SELECTED_CLASSNAME = "selected";
    let product;

    // Functions
    /**
     * Retrieves and returns the product ID from localStorage, deleting it from localStorage afterwards.
     * @return {string} The product ID.
     */
    function getProductId() {

        // Get data.
        const productId = localStorage.getItem("singleproductId");

        // Delete data.
        localStorage.removeItem("singleproductId");

        // Return
        return productId;

    }
    /**
     * Validates the quantity inputted.
     * @param {Event} e The change event of the input element.
     */
    function setQuantity(e){
        if(e.target.value < 1) e.target.value = 1;
    }
    /**
     * Selects one element of a group. Uses event delegation.
     * @param {Event} e The event that triggered the selection.
     */
    function select(e) {

        // Get array of children.
        const c = Array.from(e.currentTarget.querySelectorAll("div"));

        // If the target was a child,
        if (c.includes(e.target)) {

            // Deselect all.
            c.forEach(s => {
                s.classList.remove(SELECTED_CLASSNAME);
            })

            // Select clicked.
            e.target.classList.add(SELECTED_CLASSNAME);

        }

    }
    /**
     * Builds the singleproduct page.
     */
    async function buildPage() {

        // Configuarable Variables
        const breadcrumb = document.querySelector("#breadcrumb");
        const mainImage = document.querySelector("#sp-main-image");
        const smallImages = document.querySelectorAll("#sp-small-image-container > img");
        const IMAGE_SRC = "images/placeholder_item.png";
        const title = document.querySelector("#sp-details > h2");
        const price = document.querySelector("#sp-price");
        const description = document.querySelector("#sp-desc");
        const material = document.querySelector("#sp-mat");
        const quantity = document.querySelector("#sp-quantity");
        const sizes = document.querySelector("#sp-sizes");
        const sizeTemplate = document.querySelector("#sp-size-template");
        const colors = document.querySelector("#sp-colors");
        const colorTemplate = document.querySelector("#sp-color-template");

        // ----------------------- Setup

        // Get the product id.
        const productId = getProductId();

        // Get the product data.
        const clothingArray = await getClothing();
        product = clothingArray.find(c => c.id === productId);

        // ------------------------- Reset
        quantity.removeEventListener("change", setQuantity);

        // ------------------------ Populate the page

        // Construct breadcrumb.
        const breadcrumbSep = " > ";
        const breadcrumbData = [
            product.gender.charAt(0).toUpperCase() + product.gender.slice(1),
            product.category,
            product.name
        ]
        let breadcrumbStr = "Home";
        breadcrumbData.forEach(c => {
            breadcrumbStr += breadcrumbSep + c;
        });

        // Set breadcrumb
        breadcrumb.textContent = breadcrumbStr;

        // Set image
        mainImage.setAttribute("src", IMAGE_SRC);
        smallImages.forEach(img => {
            img.setAttribute("src", IMAGE_SRC);
        });

        // Set details
        title.textContent = product.name;
        price.textContent = "$" + product.price.toFixed(2);
        description.textContent = product.description;
        material.textContent = "Material: " + product.material;

        // Set quantity listener.
        quantity.addEventListener("change", setQuantity);

        // Clear inputs.
        sizes.innerHTML = "";
        colors.innerHTML = "";

        // Populate inputs.
        product.sizes.forEach((s, i) => {

            // Create and append.
            const sizeDiv = sizeTemplate.content.cloneNode(true);
            sizeDiv.querySelector(".sp-size").textContent = s;
            if(i === 0) sizeDiv.querySelector(".sp-size").classList.add(SELECTED_CLASSNAME);
            sizes.appendChild(sizeDiv);

        });
        product.color.forEach((c, i) => {

            // Create and append.
            const colorDiv = colorTemplate.content.cloneNode(true);
            colorDiv.querySelector(".sp-color").style.backgroundColor = c.hex;
            if(i === 0) colorDiv.querySelector(".sp-color").classList.add(SELECTED_CLASSNAME);
            colors.appendChild(colorDiv);

        });

    }
    /**
     * Main function.
     */
    function main() {

        // Configurable variables
        const sizes = document.querySelector("#sp-sizes");
        const colors = document.querySelector("#sp-colors");
        const quantity = document.querySelector("#sp-quantity");
        const addToCartBtn = document.querySelector("#sp-addToCartBtn");
        const CART_KEY = "cart";
        const cartSize = document.querySelector("#cartSize");

        // Observe class changes on the page element. This page only loads when this happens.
        new MutationObserver(mutations => {

            // For every mutation,
            mutations.forEach(mutation => {

                // If the mutation was displaying the page,
                if (mutation.attributeName === "class" && mutation.target === page && !page.classList.contains('hidden')) {

                    // If the product ID is stored,
                    if (localStorage.getItem("singleproductId")) {

                        // Build the page.
                        buildPage();

                    }

                }

            });

        }).observe(page, { attributes: true });

        // Listen for size selection.
        sizes.addEventListener("click", select);

        // Listen for color selection.
        colors.addEventListener("click", select);

        // Listen for the add to cart button.
        addToCartBtn.addEventListener("click", () => {

            // Get current cart.
            const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

            // Create cart item.
            const cartItem = {
                id: product.id,
                title: product.name,
                price: product.price,
                quantity: quantity.value,
                size: sizes.querySelector(".selected").textContent,
                color: colors.querySelector(".selected").style.backgroundColor,
            };

            // Add to cart.
            cart.push(cartItem);
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            cartSize.textContent = cart.length;

            // Toast.
            console.log(cartItem);

        });

    }

    main();


})