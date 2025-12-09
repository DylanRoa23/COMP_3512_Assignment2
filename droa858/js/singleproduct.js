import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

    // Configurable Variables
    const page = document.querySelector("#singleproduct");
    const SELECTED_CLASSNAME = "selected";

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
     * Selects one element of a group. Uses event delegation.
     * @param {Event} e The event that triggered the selection.
     * @param {string} className The classname of the buttons you want to deselect.
     */
    function select(e, className) {

        // If the target was a sp-size,
        if (e.target.classList.contains(className)) {

            // Deselect all.
            e.currentTarget.querySelectorAll(`.${className}`).forEach(s => {
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
        const addToCartBtn = document.querySelector("#sp-addToCartBtn");

        // Internal variables

        // Get the product id.
        const productId = getProductId();

        // Get the product data.
        const clothingArray = await getClothing();
        const product = clothingArray.find(c => c.id === productId);

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

        // Listen for size selection.
        sizes.addEventListener("click", e => select(e, "sp-size"));
        // Listen for color selection.
        colors.addEventListener("click", e => select(e, "sp-color"));

        // Listen for the button.
        addToCartBtn.addEventListener("click", () => {

            // Get current cart.
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Get selected options.
            const selectedSize = sizes.querySelector(".selected").textContent;
            const selectedColorDiv = colors.querySelector(".selected");
            const selectedColor = selectedColorDiv ? selectedColorDiv.style.backgroundColor : null;
            const selectedQuantity = parseInt(quantity.value) || 1;

            // Create cart item.
            const cartItem = {
                id: product.id,
                title: product.name,
                price: product.price,
                size: selectedSize,
                color: selectedColor,
                quantity: selectedQuantity,
            };

            // Add to cart.
            cart.push(cartItem);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Item added to cart!");

        });
        console.log(product);
    }
    /**
     * Main function.
     */
    function main() {

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

    }

    main();


})