import { getRandomProduct } from "./general.js";

document.addEventListener("DOMContentLoaded", () => {

    // Configurable variables
    const slides = document.querySelectorAll(".banner");
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
        
        //code taken from https://www.w3schools.com/howto/howto_js_slideshow.asp

    }
    /**
     * Populates the featured products section with product cards.
     */
    async function populateFeatured(){
        
        // Configurable variables
        const template = document.querySelector("#f-card-template");
        const FEATURED_AMOUNT = 3;

        // For every card,
        for(let x = 0; x < FEATURED_AMOUNT; x++){

            // Create a card. 
            const clone = template.content.cloneNode(true);
            
            // Configurable variables.
            const img = clone.querySelector(".f-card > .f-img");
            const name = clone.querySelector(".f-card > div > h3");
            const desc = clone.querySelector(".f-card > div > p");
            const product = await getRandomProduct();

            // Set the product details.
            name.textContent = product.name;
            desc.textContent = product.description;

            // Add the card.
            template.after(clone);

        }



    }
    /**
     * Main function.
     */
    function main(){

        // Start slideshow.
        showSlides();

        // Populate featured products.
        populateFeatured();

    }
    
    main();
    

    

});