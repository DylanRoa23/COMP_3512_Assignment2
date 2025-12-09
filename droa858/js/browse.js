import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

    // ---------------- Configurable variables ----------------
    const productContainer = document.querySelector("#product");
    const productTemplate = document.querySelector("#product-template");

    const clothingArray = await getClothing(); // Array of clothing objects

    const CHECKED_CLASSNAME = "checked";

    let colorsArray = []; // Stores unique colors

    /**
     * Populates colorsArray with unique colors from clothingArray and sorts alphabetically.
     */
    function populateColorsArray() {
        // Get first color of each clothing item
        const c1 = clothingArray.map(clothing => clothing.color[0]);

        // Keep only unique colors
        const c2 = [];
        c1.forEach(color => {
            if (!c2.find(c => c.name === color.name)) {
                c2.push(color);
            }
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

        colorsArray.forEach(c => {
            const div = colorTemplate.content.cloneNode(true); // Clone template
            div.querySelector(".color-box").style.backgroundColor = c.hex; // Set color box
            div.querySelector(".color-text").textContent = c.name; // Set color name
            colorsDiv.appendChild(div); // Add to DOM
        });
    }

    /**
     * Sets up initial variables and renders filter sections.
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

        if (items.length === 0) {
            productContainer.textContent = "No items match the selected filters."; // Show message if empty
            return;
        }

        items.forEach(item => {

            // Clone and insert.
            const div = productTemplate.content.cloneNode(true);
            div.querySelector(".product").dataset.id = item.id;
            const img = div.querySelector("img");
            img.src = "images/placeholder_item.png";
            img.alt = item.name + ".png";
            div.querySelector(".product-title").textContent = item.name;
            div.querySelector(".product-price").textContent = "$" + item.price.toFixed(2);
            productContainer.appendChild(div); // Add product to DOM
        });
    }

    /**
     * Filters products based on selected filters and renders them.
     */
    function filterProducts() {
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

        // Get selected filters
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

        // Filter products
        const filtered = clothingArray.filter(item => {
            const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(item.gender.toLowerCase());
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category.toLowerCase());
            const sizeMatch = selectedSizes.length === 0 || item.sizes.some(s => selectedSizes.includes(s));
            const colorMatch = selectedColors.length === 0 || selectedColors.includes(item.color[0].name.toLowerCase());
            return genderMatch && categoryMatch && sizeMatch && colorMatch;
        });

        renderProducts(filtered); // Render filtered products
    }

    /**
     * Handles clicks on checkbox filters.
     */
    function activateCheckboxFilter(e) {
        e.currentTarget.classList.toggle(CHECKED_CLASSNAME); // Toggle selection
        filterProducts(); // Update products
    }

    /**
     * Handles clicks on radio filters (only one can be active per group).
     */
    function activateRadioFilter(e) {
        const children = e.currentTarget.parentNode.querySelectorAll("div");
        children.forEach(s => s.classList.remove(CHECKED_CLASSNAME)); // Remove selection from siblings
        e.currentTarget.classList.toggle(CHECKED_CLASSNAME); // Toggle current
        filterProducts(); // Update products
    }

    /**
     * Removes all filters and shows all products.
     */
    function removeAllFilters() {
        const allFilters = document.querySelectorAll("#filter > div > div");
        allFilters.forEach(div => div.classList.remove(CHECKED_CLASSNAME));
        renderProducts(clothingArray);
    }

    /**
     * Main function: sets up filters, attaches events, and renders products.
     */
    function main() {

        // Setup
        setup();

        // Configurable variables
        const checkboxFilters = document.querySelectorAll("#filter > .checkbox > div");
        const radioFilters = document.querySelectorAll("#filter > .radio > div");
        const removeFiltersBtns = document.querySelectorAll(".removeFiltersBtn");
        const cartSize = document.querySelector("#cartSize");

        // Attach event listeners
        checkboxFilters.forEach(f => f.addEventListener("click", activateCheckboxFilter));
        radioFilters.forEach(f => f.addEventListener("click", activateRadioFilter));
        removeFiltersBtns.forEach(b => b.addEventListener("click", removeAllFilters));

        // Initial render.
        renderProducts(clothingArray);

        //Cart System 
        let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage
        cartSize.textContent = cart.length; // Update cart count

        // Event delegation for "Add to Cart" buttons
        productContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-cart-btn")) {
                const productDiv = e.target.closest(".product");
                const title = productDiv.querySelector(".product-title").textContent;
                const price = parseFloat(productDiv.querySelector(".product-price").textContent.replace("$", ""));

                // Add to cart array
                cart.push({ title, price });

                // Save to localStorage
                localStorage.setItem("cart", JSON.stringify(cart));

                // Update cart counter
                document.querySelector("#cartSize").textContent = cart.length;
            }
        });

    }

    main(); // Initialize page
});
