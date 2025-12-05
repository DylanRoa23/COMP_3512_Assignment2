document.addEventListener("DOMContentLoaded", () => {

    // Initialize
    const browseBtn = document.querySelector("#browse");
    const homeBtn = document.querySelector("#home");
    const browse = document.querySelector(".browse");
    const home = document.querySelector(".home");
    const colorsDiv = document.querySelector("#color");

    const colorURL = "json/colors.json";

    // Default state
    home.classList.remove("hidden");
    browse.classList.add("hidden");

    // Toggle pages
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

    //Fetch colors.json which has basic colors plus equivalents 
    //So yellow will show gold colored clothes and black will show charcoal
    fetch(colorURL)
        .then(response => response.json())
        .then(colorData => {
            const colorHexMap = colorData.hex;

            // Only use the grouped color names from hex map
            const groupedColors = Object.keys(colorHexMap).sort(); // sorted alphabetically

            // Makes a checkbox for the colors
            for (let i = 0; i < groupedColors.length; i++) {
                const color = groupedColors[i];
                const div = document.createElement("div");
                div.classList.add("color-option");

                div.innerHTML = `
                    <input type="checkbox" id="color-${color.toLowerCase()}" name="color-${color.toLowerCase()}">
                    <label for="color-${color.toLowerCase()}">
                        <span class="color-box"></span>
                        ${color}
                    </label>
                `;
                colorsDiv.appendChild(div);

                // Fill the color box with the approriate color
                const span = div.querySelector(".color-box");
                span.style.backgroundColor = colorHexMap[color];
            }
        })
        .catch(err => console.error("Error loading colors:", err));

});
