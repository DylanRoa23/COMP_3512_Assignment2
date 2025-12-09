import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

    // ---------------- Configurable variables
    const productContainer = document.querySelector("#product");
    const productTemplate = document.querySelector("#product-template");
    const removeBtn = document.getElementById("removeBtn");

    const clothingArray = await getClothing(); // Array of clothing objects

    const CHECKED_CLASSNAME = "checked";

    // Internal variables
    let colorsArray = [];

    // --------------- Functions
    /**
     * Populates the colorsArray with unique colors from clothingArray. Sorted by color name.
     */
    function populateColorsArray() {

        // // Get all colors.
        let c1 = clothingArray.map(clothing => clothing.color[0]);

        // // Get all unique colors.
        let c2 = [];
        c1.forEach(color => {

            // If not already in c2,
            if (!c2.find(c => c.name === color.name)) {

                // Add it.
                c2.push(color);

            }

        });

        // // Sort colors by name
        colorsArray = c2.sort((a, b) => a.name.localeCompare(b.name));

    }


    /**
     * Populates the colors filter section.
     */
    function populateColors() {

        // Configurable variables
        const colorsDiv = document.querySelector("#color");
        const colorTemplate = document.querySelector("#color-template");

        // For every clothing, get unique colors.
        colorsArray.forEach(c => {

            // Clone and insert.
            const div = colorTemplate.content.cloneNode(true);
            div.querySelector(".color-box").style.backgroundColor = c.hex;
            div.querySelector(".color-text").textContent = c.name;
            colorsDiv.appendChild(div);

        })

    }


    /**
     * Prepares all the necessary variables required before any work is done in this file.
     */
    function setup() {

        // Populate.
        populateColorsArray();
        populateColors();

    }


    /**
     * Applys a checked class to a checkbox filter when clicked.
     * @param {Event} e The click event.
     */
    function activateCheckboxFilter(e) {

        // Toggle class.
        e.currentTarget.classList.toggle(CHECKED_CLASSNAME);

        // Filter.
        filterProducts();

    }


    /**
     * Applys a checked class to radio filter when clicked. Removes checked from siblings.
     * @param {Event} e The click event.
     */
    function activateRadioFilter(e) {

        // Get children.
        const children = e.currentTarget.parentNode.querySelectorAll("div");

        // Remove from children.
        children.forEach(s => {
            s.classList.remove(CHECKED_CLASSNAME);
        })

        // Toggle class.
        e.currentTarget.classList.toggle(CHECKED_CLASSNAME);

        // Filter.
        filterProducts();

    }

    /**
     * Generates the products divs based on the given items.
     * @param {Array<ClothingObject>} items Array of clothing objects to render.
     */
    function renderProducts(items) {

        // Clear previous products.
        productContainer.innerHTML = "";

        // If empty,
        if (items.length === 0) {
            productContainer.textContent = "No items match the selected filters.";
        }

        // For every item,
        items.forEach(item => {

            // Clone and insert.
            const div = productTemplate.content.cloneNode(true);
            const img = div.querySelector("img");
            img.src = "images/placeholder_item.png";
            img.alt = item.name + ".png";
            div.querySelector(".product-title").textContent = item.name;
            div.querySelector(".product-price").textContent = "$" + item.price.toFixed(2);
            productContainer.appendChild(div);

        });
    }


    /**
     * Filters products based on selected filters and renders them.
     */
    function filterProducts() {

        // Configurable variables
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
        ]

        // Get selected filters in arrays.
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

        const filtered = clothingArray.filter(item => {

            // Check matches for each filter type.
            const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(item.gender.toLowerCase());
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category.toLowerCase());
            const sizeMatch = selectedSizes.length === 0 || item.sizes.some(s => selectedSizes.includes(s));
            const colorMatch = selectedColors.length === 0 || selectedColors.includes(item.color[0].name.toLowerCase());

            // Return true if matches all selected filters.
            return genderMatch && categoryMatch && sizeMatch && colorMatch;
        });

        // Render
        renderProducts(filtered);
    }


    /**
     * Main function.
     */
    function main() {

        // ---------------------------- Filters
        // Set up.
        setup();

        // Configurable variables.
        const checkboxFilters = document.querySelectorAll("#filter > .checkbox > div");
        const radioFilters = document.querySelectorAll("#filter > .radio > div");

        // For every checkbox filter,
        checkboxFilters.forEach(f => {

            // Attach event listener.
            f.addEventListener("click", activateCheckboxFilter);

        })
        // For every radio filter,
        radioFilters.forEach(f => {

            // Attach event listener.
            f.addEventListener("click", activateRadioFilter);

        })

        // ------------------------------ Products
        //Removes all filters
        removeBtn.addEventListener("click", () => {
            const allCheckboxes = document.querySelectorAll("#filter input[type='checkbox']");
            allCheckboxes.forEach(cb => cb.checked = false);
            renderProducts(clothingArray);
        });

        //Base import when no filter are selected
        renderProducts(clothingArray);

    }

    main();

});

