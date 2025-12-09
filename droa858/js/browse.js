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

    //Load the clothes
    const clothing = await getClothing(); // Array of clothing objects

    //Load the colors checkboxes
    const colorURL = "json/colors.json";
    try {
        const response = await fetch(colorURL);
        const colorData = await response.json();
        const colorHexMap = colorData.hex;
        const groupedColors = Object.keys(colorHexMap).sort();

        groupedColors.forEach(color => {
            const div = colorTemplate.content.cloneNode(true);
            const input = div.querySelector("input");
            input.id = "color-" + color.toLowerCase();
            input.name = "color-" + color.toLowerCase();
            const label = div.querySelector("label");
            label.setAttribute("for", input.id);
            const span = div.querySelector(".color-box");
            span.style.backgroundColor = colorHexMap[color];
            const text = div.querySelector("#color-text");
            text.textContent = color;
            colorsDiv.appendChild(div);
        });

    } catch (err) {
        console.error("Error loading colors:", err);
    }

    //Genrate the products divs
    const productTemplate = document.querySelector("#product-template");

    function renderProducts(items) {
        productContainer.innerHTML = ""; // Clear previous products
        items.forEach(item => {
            const div = productTemplate.content.cloneNode(true);
            const img = div.querySelector("img");
            img.src = item.image;
            img.alt = item.title;
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

        const filtered = clothing.filter(item => {
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
        renderProducts(clothing);
    });

    //Base import when no filter are selected
    renderProducts(clothing);

});

