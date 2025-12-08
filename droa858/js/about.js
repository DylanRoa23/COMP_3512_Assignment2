document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables.
    const aboutBtn = document.querySelector(".aboutBtn");
    const about = document.querySelector("#about");

    // Close dialog when clicking the close button
    about.addEventListener("click", (e) => {
        if (e.target.id === "closeAbout") {
            about.close();
        }
    });
    
});