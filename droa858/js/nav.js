document.addEventListener("DOMContentLoaded", () => {

    // Configuarable Variables
    const home = document.querySelector("#home");
    const browse = document.querySelector("#browse");
    const about = document.querySelector("#about");
    const aboutDialog = document.querySelector("#about > dialog");
    const checkout = document.querySelector("#checkout");
    const singleproduct = document.querySelector("#singleproduct");
    const navhome = document.querySelector("#navhome");
    const navbrowse = document.querySelector("#navbrowse");
    const navabout = document.querySelector("#navabout");
    const navcheckout = document.querySelector("#navcheckout");
    const cartSize = document.querySelector("#cartSize");
    const CART_KEY = "cart";
    const homeBtns = document.querySelectorAll(".homeBtn");
    const browseBtns = document.querySelectorAll(".browseBtn");
    const aboutBtns = document.querySelectorAll(".aboutBtn");
    const checkoutBtns = document.querySelectorAll(".checkoutBtn");
    const singleproductBtnContainers = document.querySelectorAll(".singleproductBtnContainer");
    const singleproductBtns = document.querySelectorAll(".singleproductBtn");

    // Internal Variables
    const Pages = {
        home: home,
        browse: browse,
        about: about,
        checkout: checkout,
        singleproduct: singleproduct,
    };
    const NavPages = {
        home: navhome,
        browse: navbrowse,
        about: navabout,
        checkout: navcheckout,
    }

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

        // For every page highlight,
        for (const key in NavPages) {

            // Initialize
            const p = NavPages[key];

            // If the page exists,
            if (p) {

                // Hide it.
                p.classList.remove("navhighlight");

            }
            // Otherwise,
            else {

                // Throw a warning in console.
                console.warn("Warning: The page \"" + key + "\" is missing.");

            }

        }

    }

    /**
     * Displays a page, cancelling the default event. Also highlights the page's div in the nav.
     * @param {PointerEvent} e The event trigger. 
     * @param {HTMLArticleElement} page The page to display.
     * @param {HTMLDivElement} navdiv The page's div in nav.
     */
    function displayPage(e, page, navdiv) {

        // Cancel default link action.
        e.preventDefault();

        // Hide all pages.
        hideAll();

        // Display this page.
        page.classList.remove("hidden");

        // Highlight the page's div in nav.
        navdiv.classList.add("navhighlight");

    }

    /**
     * Main.
     */
    function main() {

        // Update cart data.
        const cartData = localStorage.getItem(CART_KEY);
        if(cartData) {
            cartSize.textContent = JSON.parse(cartData).length;
        }
        else{
            cartSize.textContent = "0";
        }

        // Listen for buttons.
        homeBtns.forEach(b => {

            // Attach listener.
            b.addEventListener("click", e => { displayPage(e, home, navhome) });

        })
        browseBtns.forEach(b => {

            // Attach listener.
            b.addEventListener("click", e => { displayPage(e, browse, navbrowse) });

        })
        aboutBtns.forEach(b => {

            // Attach listener.
            b.addEventListener("click", e => {
                e.preventDefault();
                about.classList.remove("hidden");
                aboutDialog.showModal();
            });

        })
        checkoutBtns.forEach(b => {

            // Attach listener.
            b.addEventListener("click", e => { displayPage(e, checkout, navcheckout) });

        })
        singleproductBtns.forEach(b => {

            // Attach listener.
            b.addEventListener("click", e => { displayPage(e, singleproduct, navbrowse) });

        })
        singleproductBtnContainers.forEach(c => {

            // Attach listener.
            c.addEventListener("click", e => {

                // Stop propagation.
                e.stopPropagation();

                // If the target has the class,
                if (e.target.classList.contains("singleproductBtn")) {
                    
                    // Fetch the product data and save it to localStorage.
                    const id = e.target.parentNode.dataset.id;
                    localStorage.setItem("singleproductId", id);

                    // Display singleproduct page.
                    displayPage(e, singleproduct, navbrowse);

                }

            });

        })

    }

    main();

})