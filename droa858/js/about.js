document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables.
    const about = document.querySelector("#about");
    const dialog = document.querySelector("#about > dialog");
    const closeBtns = document.querySelectorAll(".closeAbout");

    // Functions
    /**
     * Close the about dialog.
     */
    function closeDialog() {
        dialog.close();
        about.classList.add("hidden");
    }

    /**
     * Main function
     */
    function main() {

        // Attach escape key listener
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                closeDialog();
            }
        })

        // Close dialog when clicking the close button
        closeBtns.forEach(b => {

            // Attach event listener
            b.addEventListener("click", closeDialog);

        });

    }

    main();

});