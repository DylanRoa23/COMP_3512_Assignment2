import { getClothing } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

    // Initialize
    const colorsDiv = document.querySelector("#color");
    const colorTemplate = document.querySelector("#color-template");
    const colorURL = "json/colors.json";

    // Fetch colors.json which has basic colors plus equivalents 
    // So yellow will show gold colored clothes and black will show charcoal
    fetch(colorURL)
        .then(response => response.json())
        .then(colorData => {

            // Initialize
            const colorHexMap = colorData.hex;

            // Only use the grouped color names from hex map
            const groupedColors = Object.keys(colorHexMap).sort(); // sorted alphabetically
            
            // Makes a checkbox for the colors
            for (let i = 0; i < groupedColors.length; i++) {

                // Initialize
                const color = groupedColors[i];
                
                // Create the div.
                const div = colorTemplate.content.cloneNode(true);

                const input = div.querySelector("input");
                input.setAttribute("id", "color-" + color.toLowerCase());
                input.setAttribute("name", "color-" + color.toLowerCase());

                const label = div.querySelector("label");
                label.setAttribute("for", "color-" + color.toLowerCase());

                const span = div.querySelector(".color-box");
                span.style.backgroundColor = colorHexMap[color];

                const text = div.querySelector("#color-text");
                text.textContent = color;

                // Append it.
                colorsDiv.appendChild(div);

            }
        })
        .catch(err => console.error("Error loading colors:", err));

});
