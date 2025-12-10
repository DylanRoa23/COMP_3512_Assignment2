import { getClothing } from "./api.js";
import { showToast, getRandomProduct, getRandomProductImages } from "./general.js";

document.addEventListener("DOMContentLoaded", () => {

    // Configurable Variables
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
    function setQuantity(e) {
        if (e.target.value < 1) e.target.value = 1;
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
     * Loads the breadcrumb with product data.
     * @param {ClothingObject} product The clothing object to load a breadcrumb for.
     */
    function populateBreadcrumb(product) {

        // Configurable variables
        const breadcrumb = document.querySelector("#breadcrumb");
        const SEPARATOR = " > ";
        const crumbs = [
            product.gender.charAt(0).toUpperCase() + product.gender.slice(1),
            product.category,
            product.name
        ]

        // Construct breadcrumb.
        let breadcrumbStr = "Home";
        crumbs.forEach(c => {
            breadcrumbStr += SEPARATOR + c;
        });

        // Set breadcrumb
        breadcrumb.textContent = breadcrumbStr;

    }
    /**
     * Calculates the similarity between two products.
     * @param {ClothingObject} producta The original product.
     * @param {ClothingObject} productb Another product to compare to.
     * @returns A number. The calculated similarity score.
     */
    function similarity(producta, productb){

        // Configurable variables
        const NAME_SEPARATOR = " ";
        const DESC_SEPARATOR = " ";
        const NAME_MATCH_SCORE = 100;
        const DESC_MATCH_SCORE = 50;
        const PRICE_UNMATCH_SCORE = -1;
        const CATEGORY_MATCH_SCORE = 50;
        const COLOR_MATCH_SCORE = 25;
        const MATERIAL_MATCH_SCORE = 25;

        // Initialize
        let score = 0;

        // Compare names
        const nameWordsa = producta.name.split(NAME_SEPARATOR);
        const nameWordsb = productb.name.split(NAME_SEPARATOR);

        // For every wa
        nameWordsa.forEach(wa => {

            // Compare to every wb
            nameWordsb.forEach(wb => {

                // If the words match,
                if(wa === wb){

                    // Add to score.
                    score += NAME_MATCH_SCORE;

                }

            })

        })

        // Compare descriptions
        const descWordsa = producta.description.split(DESC_SEPARATOR);
        const descWordsb = productb.description.split(DESC_SEPARATOR);

        // For every wa
        descWordsa.forEach(wa => {

            // Compare to every wb
            descWordsb.forEach(wb => {

                // If the words match,
                if(wa === wb){

                    // Add to score.
                    score += DESC_MATCH_SCORE;

                }

            })

        })

        // Compare prices
        const pricea = producta.price;
        const priceb = productb.price;
        const pricediff = Math.abs(pricea - priceb);
        score += pricediff * PRICE_UNMATCH_SCORE;

        // Compare categories
        const categorya = producta.category;
        const categoryb = productb.category;
        if(categorya === categoryb) score += CATEGORY_MATCH_SCORE;

        // Compare colors
        const colora = producta.color.name;
        const colorb = productb.color.name;
        if(colora === colorb) score += COLOR_MATCH_SCORE;

        // Return.
        return score;

    }
    /**
     * Gets an array of products sorted by ascending similarity to the given product.
     * @param {ClothingObject} product The product to produce an array of similar products to.
     * @returns An array of ClothingObjects sorted by ascending similarity.
     */
    async function getSimilarProducts(product){
        
        // Get clothing.
        let result = await getClothing();

        // Remove this product from the results.
        result = result.filter(p => p.id !== product.id);

        // Sort by ascending similarity.
        result.sort((a, b) => similarity(product, b) - similarity(product, a));
        console.log(result)

        // Return
        return result;


    }
    /**
     * Populates the related products section with similar products to the given product.
     * @param {ClothingObject} product The product to populate similar products to.
     */
    async function populateRelatedProducts(product) {

        // Configurable variables
        const grid = document.querySelector("#sp-rp-grid");
        const previous = document.querySelectorAll("#sp-rp-grid > .product");
        const template = document.querySelector("#sp-rp-template");
        const RELATED_AMOUNT = 3;
        const images = getRandomProductImages(RELATED_AMOUNT);
        const DECIMAL_PLACES = 2;
        const similarProducts = await getSimilarProducts(product);

        // Clear previous cards.
        previous.forEach(p => {
            p.remove();
        })

        // For every card,
        for (let x = 0; x < RELATED_AMOUNT; x++) {

            // Create a card. 
            const clone = template.content.cloneNode(true);

            // Configurable variables.
            const img = clone.querySelector(".product > img");
            const name = clone.querySelector(".product > .product-title");
            const price = clone.querySelector(".product > .product-price");
            const product = similarProducts[x];

            // Set the product details.
            img.style.backgroundImage = "url('" + images[x] + "')";
            name.textContent = product.name;
            price.textContent = `$${product.price.toFixed(DECIMAL_PLACES)}`;

            // Add the card.
            grid.appendChild(clone);

        }

    }
    /**
     * Builds the singleproduct page.
     */
    async function buildPage() {

        // Configurable Variables
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

        // Populate breadcrumb
        populateBreadcrumb(product);

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
            if (i === 0) sizeDiv.querySelector(".sp-size").classList.add(SELECTED_CLASSNAME);
            sizes.appendChild(sizeDiv);

        });
        product.color.forEach((c, i) => {

            // Create and append.
            const colorDiv = colorTemplate.content.cloneNode(true);
            colorDiv.querySelector(".sp-color").style.backgroundColor = c.hex;
            if (i === 0) colorDiv.querySelector(".sp-color").classList.add(SELECTED_CLASSNAME);
            colors.appendChild(colorDiv);

        });

        // Populate related products.
        populateRelatedProducts(product);

    }
    /**
     * Main function.
     */
    function main() {

        // Configurable variables
        const page = document.querySelector("#singleproduct");
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

        }).observe(page, { attributes: true }); // Observe changes including class changes

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
            showToast("'" + product.name + "' added to cart!");

        });

    }

    main();


})