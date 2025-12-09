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
        product.sizes.forEach(s => {
            const sizeDiv = sizeTemplate.content.cloneNode(true);
            sizeDiv.querySelector(".sp-size").textContent = s;
            sizes.appendChild(sizeDiv);
        });
        product.color.forEach(c => {
            const colorDiv = colorTemplate.content.cloneNode(true);
            colorDiv.querySelector(".sp-color").style.backgroundColor = c.hex;
            colors.appendChild(colorDiv);
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