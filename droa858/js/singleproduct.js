import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

    // Configurable Variables
    const page = document.querySelector("#singleproduct");

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
     * Builds the singleproduct page.
     */
    async function buildPage() {

        // Get the product id.
        const productId = getProductId();

        // Get the product data.
        const clothingArray = await getClothing();
        const product = clothingArray.find(c => c.id === productId);

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