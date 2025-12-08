document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables.
    const about = document.querySelector("#about");
    const dialog = document.querySelector("#about > dialog");
    const closeBtns = document.querySelectorAll(".closeAbout");

    // Close dialog when clicking the close button
    closeBtns.forEach(b => {

        // Attach listener.
        b.addEventListener("click", e => {
            dialog.close();
            about.classList.add("hidden");
        })

    });

});