document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables.
    const about = document.querySelector("#about");
    const dialog = document.querySelector("#about > dialog");
    const closeBtns = document.querySelectorAll(".closeAbout");

    // Functions
    function closeDialog() {
        dialog.close();
        about.classList.add("hidden");
    }

    // Close dialog when clicking the close button
    closeBtns.forEach(b => {

        // Attach listener.
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                closeDialog();
            }
        })
        b.addEventListener("click", closeDialog);

    });

});