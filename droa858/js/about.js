document.addEventListener("DOMContentLoaded", () => {

    const aboutBtn = document.querySelector(".aboutBtn");
    const aboutDialog = document.querySelector("#about");

    // Insert the about text inside the dialog
    aboutDialog.innerHTML = `
        <h2>About This Website</h2>
        <p>
            This website is an online clothing store with a vast variety of items available for selection.
            With various filters to help shoppers find items that match their taste more easily.
        </p>
        <p>
            This website was made using HTML/CSS for the basic layout + styling, while most of the website 
            was dynamically generated using JavaScript.
        </p>
        <p>
            This website was built by <strong>Dylan Roa</strong> and <strong>Kyle Chen</strong>.  
            Our work can be found on our 
            <a href="https://github.com/DylanRoa23/COMP_3512_Assignment2" target="_blank">
                GitHub Repository
            </a>
        </p>
        <button id="closeAbout">Close</button>
    `;

    // Open dialog box when clicking the About button
    aboutBtn.addEventListener("click", (event) => {
        event.preventDefault();   // Prevent the <a> tag from reloading the page
        aboutDialog.showModal();
    });

    // Close dialog when clicking the close button
    aboutDialog.addEventListener("click", (e) => {
        if (e.target.id === "closeAbout") {
            aboutDialog.close();
        }
    });
});