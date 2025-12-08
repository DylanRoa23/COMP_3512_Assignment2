document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables.
    const aboutBtn = document.querySelector(".aboutBtn");
    const about = document.querySelector("#about");

    // Open dialog box when clicking the About button
    aboutBtn.addEventListener("click", (event) => {
        event.preventDefault();   // Prevent the <a> tag from reloading the page
        about.showModal();
    });

    // Close dialog when clicking the close button
    about.addEventListener("click", (e) => {
        if (e.target.id === "closeAbout") {
            about.close();
        }
    });
});