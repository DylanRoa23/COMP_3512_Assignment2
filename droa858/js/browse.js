import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

    // ---------------- Configurable variables ----------------
    const productContainer = document.querySelector("#product");
    const productTemplate = document.querySelector("#product-template");
    const cartSize = document.querySelector("#cartSize");
    const sortSelect = document.querySelector("#sort");

    const clothingArray = await getClothing(); // Array of clothing objects
    const CHECKED_CLASSNAME = "checked";

    // Internal variables
    let colorsArray = []; // Stores unique colors

    // --------------- Functions ----------------------------

    /**
     * Populates colorsArray with unique colors from clothingArray and sorts alphabetically.
     */
    function populateColorsArray() {
        // Get first color of each clothing item
        const c1 = clothingArray.map(clothing => clothing.color[0]);

        // Keep only unique colors
        const c2 = [];
        c1.forEach(color => {
            if (!c2.find(c => c.name === color.name)) c2.push(color);
        });

        // Sort by color name
        colorsArray = c2.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Populates the color filter section in the DOM.
     */
    function populateColors() {
        const colorsDiv = document.querySelector("#color"); // Container for color filters
        const colorTemplate = document.querySelector("#color-template"); // Template for a single color filter

        // For every unique color, clone template and insert into DOM
        colorsArray.forEach(c => {
            const div = colorTemplate.content.cloneNode(true);
            div.querySelector(".color-box").style.backgroundColor = c.hex; // Set color box
            div.querySelector(".color-text").textContent = c.name; // Set color name
            colorsDiv.appendChild(div); // Add to DOM
        });
    }

    /**
     * Sets up initial filters and variables.
     */
    function setup() {
        populateColorsArray(); // Prepare colors array
        populateColors();      // Render color filters
    }

    /**
     * Renders products in the DOM based on the provided array.
     * @param {Array} items Array of clothing objects to render
     */
    function renderProducts(items) {
        productContainer.innerHTML = ""; // Clear previous products

        // If no items match, show message
        if (items.length === 0) {
            productContainer.textContent = "No items match the selected filters.";
            return;
        }

        // For every item, clone template and populate product info
        items.forEach(item => {
            const div = productTemplate.content.cloneNode(true);
            const productDiv = div.querySelector(".product");
            productDiv.dataset.id = item.id; // Set product ID for reference
            const img = div.querySelector("img");
            img.src = "images/placeholder_item.png"; // Default placeholder image
            img.alt = item.name + ".png";           // Alt text
            div.querySelector(".product-title").textContent = item.name;
            div.querySelector(".product-price").textContent = "$" + item.price.toFixed(2);
            productContainer.appendChild(div); // Insert product into DOM
        });
    }

    /**
     * Returns an array of products filtered by currently selected filters.
     */
    function getFilteredArray() {
        const genderCheckboxes = document.querySelectorAll("#gender div");
        const categoryCheckboxes = document.querySelectorAll("#category div");
        const sizeCheckboxes = document.querySelectorAll("#size div");
        const colorCheckboxes = document.querySelectorAll("#color div");

        const sizeValues = [
            { name: "Extra Small", abbr: "XS" },
            { name: "Small", abbr: "S" },
            { name: "Medium", abbr: "M" },
            { name: "Large", abbr: "L" },
            { name: "Extra Large", abbr: "XL" },
        ];

        // Get selected filter values
        const selectedGenders = Array.from(genderCheckboxes)
            .filter(div => div.classList.contains(CHECKED_CLASSNAME))
            .map(div => div.textContent.toLowerCase());

        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(div => div.classList.contains(CHECKED_CLASSNAME))
            .map(div => div.textContent.toLowerCase());

        const selectedSizes = Array.from(sizeCheckboxes)
            .filter(div => div.classList.contains(CHECKED_CLASSNAME))
            .map(div => sizeValues.find(s => s.name === div.textContent).abbr);

        const selectedColors = Array.from(colorCheckboxes)
            .filter(div => div.classList.contains(CHECKED_CLASSNAME))
            .map(div => div.querySelector(".color-text").textContent.toLowerCase());

        // Filter clothingArray based on selected filters
        return clothingArray.filter(item => {
            const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(item.gender.toLowerCase());
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category.toLowerCase());
            const sizeMatch = selectedSizes.length === 0 || item.sizes.some(s => selectedSizes.includes(s));
            const colorMatch = selectedColors.length === 0 || selectedColors.includes(item.color[0].name.toLowerCase());
            return genderMatch && categoryMatch && sizeMatch && colorMatch;
        });
    }

    /**
     * Sorts an array based on the selected sort option.
     * @param {Array} arr Array of clothing objects to sort
     * @returns {Array} Sorted array
     */
    function sortArray(arr) {
        const value = sortSelect.value;
        return arr.sort((a, b) => {
            if (value === "name") return a.name.localeCompare(b.name);
            if (value === "price") return a.price - b.price;
            if (value.toLowerCase() === "category") return a.category.localeCompare(b.category);
        });
    }

    /**
     * Combines filtering and sorting, then renders products.
     */
    function filterAndRender() {
        const filtered = getFilteredArray();
        const sorted = sortArray(filtered);
        renderProducts(sorted);
    }

    /**
     * Handles clicks on checkbox filters.
     */
    function activateCheckboxFilter(e) {
        e.currentTarget.classList.toggle(CHECKED_CLASSNAME); // Toggle selection
        filterAndRender(); // Re-filter and render
    }

    /**
     * Handles clicks on radio filters (only one active per group).
     */
    function activateRadioFilter(e) {
        const children = e.currentTarget.parentNode.querySelectorAll("div");
        children.forEach(s => s.classList.remove(CHECKED_CLASSNAME)); // Remove active from siblings
        e.currentTarget.classList.toggle(CHECKED_CLASSNAME); // Activate clicked
        filterAndRender(); // Re-filter and render
    }

    /**
     * Removes all filters and re-renders products.
     */
    function removeAllFilters() {
        const allFilters = document.querySelectorAll("#filter > div > div");
        allFilters.forEach(div => div.classList.remove(CHECKED_CLASSNAME));
        filterAndRender();
    }

    /**
     * Main function: initializes filters, sorting, cart, and renders products.
     */
    function main() {

        // Configurable variables
        const cardContainers = document.querySelectorAll(".card-container");

        // Prepare filters
        setup();

        // Get filter elements
        const checkboxFilters = document.querySelectorAll("#filter > .checkbox > div");
        const radioFilters = document.querySelectorAll("#filter > .radio > div");
        const removeFiltersBtns = document.querySelectorAll(".removeFiltersBtn");

        // Attach event listeners
        checkboxFilters.forEach(f => f.addEventListener("click", activateCheckboxFilter));
        radioFilters.forEach(f => f.addEventListener("click", activateRadioFilter));
        removeFiltersBtns.forEach(b => b.addEventListener("click", removeAllFilters));

        // Sorting event listener
        sortSelect.addEventListener("change", filterAndRender);

        // Initial render
        filterAndRender();

        // ------------------ Cart System ------------------
        
        // For every card container,
        cardContainers.forEach(cc => {

            // Event delegation for Add to Cart buttons
            cc.addEventListener("click", (e) => {

                // Initialize
                const cart = JSON.parse(localStorage.getItem("cart")) || [];

                // If an add cart button was clicked,
                if (e.target.classList.contains("add-cart-btn")) {

                    // Get data.
                    const productDiv = e.target.closest(".product");
                    const product = clothingArray.find(c => c.name === productDiv.querySelector(".product-title").textContent);

                    // Create cart item.
                    const cartItem = {
                        id: product.id,
                        title: productDiv.querySelector(".product-title").textContent,
                        price: parseFloat(productDiv.querySelector(".product-price").textContent.replace("$", "")),
                        quantity: 1,
                        size: product.sizes[0],
                        color: product.color[0].hex,
                    };


                    // Add to cart.
                    cart.push(cartItem);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    cartSize.textContent = cart.length;
                }
            });

        })

    }

    main(); // Initialize page
});
