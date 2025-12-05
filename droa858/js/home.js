document.addEventListener("DOMContentLoaded", () => {

    // Initialize
    const home = document.querySelector(".home");
    const browse = document.querySelector(".browse");
    const slides = document.getElementsByClassName("banner");

    // Configurable variables
    const SLIDESHOW_DELAY = 5000; // in ms.

    // Internal variables
    let slideIndex = 0;

    // Functions
    /**
     * Begins playing the slideshow.
     */
    function showSlides() {

        // ------------------ Hide all slides.

        // For every slide, 
        for (let i = 0; i < slides.length; i++) {

            // Hide the slide.
            slides[i].style.display = "none";

        }

        // ------------------- Display the next slide.

        // Wrap around the slide index.
        if (slideIndex === slides.length) { slideIndex = 0 }

        // Display the slide.
        slides[slideIndex].style.display = "block";

        // Increment the slide.
        slideIndex++;

        // Change image every 2 seconds
        setTimeout(showSlides, SLIDESHOW_DELAY); 
    }
    
    showSlides();

    //code taken from https://www.w3schools.com/howto/howto_js_slideshow.asp

});