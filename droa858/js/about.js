document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables.
    const about = document.querySelector("#about");
    const dialog = document.querySelector("#about > dialog");

    // Close dialog when clicking the close button
    dialog.addEventListener("click", (e) => {
        if (e.target.id === "closeAbout") {
            dialog.close();
            about.classList.add("hidden");
        }
    });
    
});