document.addEventListener("DOMContentLoaded", () => {

    // Configuarable Variables
    const home = document.querySelector("#home");
    const browse = document.querySelector("#browse");
    const about = document.querySelector("#about");
    const homeBtn = document.querySelector(".homeBtn");
    const browseBtn = document.querySelector(".browseBtn");
    const aboutBtn = document.querySelector(".aboutBtn");

    // System Variables
    const Pages = {
        home: home,
        browse: browse,
        about: about,
    };

    // Functions
    /**
     * Hides all pages.
     */
    function hideAll() {

        // For every page,
        for (const key in Pages) {

            // Initialize
            const p = Pages[key];

            // If the page exists,
            if (p) {

                // Hide it.
                p.classList.add("hidden");

            }
            // Otherwise,
            else {

                // Throw a warning in console.
                console.warn("Warning: The page \"" + key + "\" is missing.");

            }

        }

    }

    /**
     * Displays a page, cancelling the default event. Event handler function.
     * @param {PointerEvent} e The event trigger. 
     * @param {HTMLArticleElement} page The page to display.
     */
    function displayPage(e, page) {

        // Cancel default link action.
        e.preventDefault();

        // Hide all pages.
        hideAll();

        // Display this page.
        page.classList.remove("hidden");

    }

    /**
     * Main.
     */
    function main() {

        // Navigate pages.
        homeBtn.addEventListener("click", e => { displayPage(e, home) });
        browseBtn.addEventListener("click", e => { displayPage(e, browse) });

    }

    main();

})