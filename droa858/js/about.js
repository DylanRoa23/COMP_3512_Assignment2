document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables.
    const about = document.querySelector("#about");

    // Close dialog when clicking the close button
    about.addEventListener("click", (e) => {
        if (e.target.id === "closeAbout") {
            about.close();
        }
    });
    
});