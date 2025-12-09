import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

    // ---------------- Configurable variables
    const colorsDiv = document.querySelector("#color");
    const colorTemplate = document.querySelector("#color-template");
    const productContainer = document.querySelector("#product");
    const removeBtn = document.getElementById("removeBtn");
    const genderCheckboxes = document.querySelectorAll("#gender input[type='checkbox']");
    const categoryCheckboxes = document.querySelectorAll("#category input[type='checkbox']");
    const sizeCheckboxes = document.querySelectorAll("#size input[type='checkbox']");
    const colorCheckboxes = document.querySelectorAll("#color input[type='checkbox']");
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
     * Applys a checked class to a checkbox filter when clicked.
     * @param {Event} e The click event.
     */
    function activateCheckboxFilter(e) {

        // Toggle class.
        e.currentTarget.classList.toggle(CHECKED_CLASSNAME);

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

    }
    /**
     * Main function.
     */
    function main() {

        // ---------------------------- Filters
        // Set up.
        populateColorsArray();
        populateColors();

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

        // Generate the products divs
        const productTemplate = document.querySelector("#product-template");

        function renderProducts(items) {
            productContainer.innerHTML = ""; // Clear previous products
            items.forEach(item => {
                const div = productTemplate.content.cloneNode(true);
                const img = div.querySelector("img");
                img.src = "images/placeholder_item.png";
                img.alt = item.name + ".png";
                div.querySelector(".product-title").textContent = item.name;
                div.querySelector(".product-price").textContent = "$" + item.price.toFixed(2);
                productContainer.appendChild(div);
            });
        }

        //Allow's filters to work 
        function filterProducts() {

            const selectedGenders = Array.from(genderCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.name.toLowerCase());

            const selectedCategories = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.name.toLowerCase());

            const selectedSizes = Array.from(sizeCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.name.toLowerCase());

            const filtered = clothingArray.filter(item => {
                const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(item.gender.toLowerCase());
                const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category.toLowerCase());
                const sizeMatch = selectedSizes.length === 0 || item.sizes.some(s => selectedSizes.includes(s.toLowerCase()));
                return genderMatch && categoryMatch && sizeMatch;
            });

            renderProducts(filtered);
        }

        //Attach listeners 
        [...genderCheckboxes, ...categoryCheckboxes, ...sizeCheckboxes].forEach(cb => {
            cb.addEventListener("change", filterProducts);
        });

        //Removes all filters
        removeBtn.addEventListener("click", () => {
            const allCheckboxes = document.querySelectorAll("#filter input[type='checkbox']");
            allCheckboxes.forEach(cb => cb.checked = false);
            renderProducts(clothingArray);
        });

        //Base import when no filter are selected
        renderProducts(clothingArray);

    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    //Update cart number
    document.querySelector("#cartsize").textContent = cart.length;

    //Event delegation for Add to Cart buttons
    productContainer.addEventListener("click", (e) => {

        if (e.target.classList.contains("add-cart-btn")) {

            // Find the product div
            const productDiv = e.target.closest(".product");

            // Extract product information
            const title = productDiv.querySelector(".product-title").textContent;
            const price = parseFloat(
                productDiv.querySelector(".product-price").textContent.replace("$", "")
            );

            // Add to cart array
            cart.push({ title, price });

            // Save to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Update cart counter
            document.querySelector("#cartsize").textContent = cart.length;
        }
    });

    main();

});

