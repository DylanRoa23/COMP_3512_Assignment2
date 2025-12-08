document.addEventListener("DOMContentLoaded", () => {

    // Configuarable Variables
    const home = document.querySelector("#home");
    const browse = document.querySelector("#browse");
    const about = document.querySelector("#about");
    const homeBtns = document.querySelectorAll(".homeBtn");
    const browseBtns = document.querySelectorAll(".browseBtn");
    const aboutBtns = document.querySelectorAll(".aboutBtn");

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

        // Listen for buttons.
        homeBtns.forEach(b => {

            // Attach listener.
            b.addEventListener("click", e => { displayPage(e, home) });

        })
        browseBtns.forEach(b => {

            // Attach listener.
            b.addEventListener("click", e => { displayPage(e, browse) });

        })

    }

    main();

})