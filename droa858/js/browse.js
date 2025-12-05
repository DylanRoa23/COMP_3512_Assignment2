document.addEventListener("DOMContentLoaded", () => {

    // Initialize
    const browseBtn = document.querySelector("#browse");
    const homeBtn = document.querySelector("#home");
    const browse = document.querySelector(".browse");
    const home = document.querySelector(".home");
    const colorsDiv = document.querySelector("#color");
    const colorTemplate = document.querySelector("#color-template");
    const colorURL = "json/colors.json";

    // Navigate pages
    browseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        home.classList.add("hidden");
        browse.classList.remove("hidden");
    });
    homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        browse.classList.add("hidden");
        home.classList.remove("hidden");
    });

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
