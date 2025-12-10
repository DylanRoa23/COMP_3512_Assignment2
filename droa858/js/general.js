import { getClothing } from "./api.js";


// Functions
/**
* Displays the toast message. Creates a toast div and places it in body. However, external css is still required. 
*/
export function showToast(message) {

    // Configurable variables
    const body = document.querySelector("body");
    const TOAST_ID = "toast";
    const TOAST_TIME = 3000; // in ms

    // Create the toast.
    const toast = document.createElement("div");
    toast.setAttribute("id", TOAST_ID);
    toast.textContent = message;
    body.appendChild(toast);

    // Wait one frame
    requestAnimationFrame(() => {

        // Show the toast.
        toast.classList.add("show");

    });

    // Timeout toast
    setTimeout(() => {
        toast.classList.remove("show");
    }, TOAST_TIME);

    // Remove when transition is over.
    toast.addEventListener("transitionend", () => {
        if (!toast.classList.contains("show")) {
            toast.remove();
        }

    });

}
/**
 * Returns a random integer from min to max (inclusive).
 * @param {number} min Minimum integer (inclusive)
 * @param {number} max Maximum integer (inclusive)
 * @returns A random integer from min to max (inclusive)
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Fetches and returns a random clothing object from the clothing array.
 * @returns A Promise<ClothingObject>
 */
export async function getRandomProduct() {

    // Internal variables
    const clothingArray = await getClothing();
    const i = getRandomInt(0, clothingArray.length - 1);

    // Return
    return clothingArray[i];

}
/**
 * Fetches and returns a given number of random unique product images.
 * @param {number} amount The amount of images to fetch.
 * @returns An array containing strings containing a url to the image.
 */
export function getRandomProductImages(amount) {

    // Configurable variables
    const images = [
        "./images/product-images/denim-jacket.png",
        "./images/product-images/grey-tshirt.png",
        "./images/product-images/hoodie-white.png",
        "./images/product-images/jacket.png",
        "./images/product-images/jean-women.png",
        "./images/product-images/jeans-ripped.png",
        "./images/product-images/pink pants.png",
        "./images/product-images/strap-dress.png",
        "./images/product-images/sweater.png",
        "./images/product-images/white-cap.png",
    ]

    // Internal variables
    const result = [];

    // For every amount,
    for(let x = 0; x < amount; x++){

        // Get a random index.
        const i = getRandomInt(0, images.length - 1);

        // Add the chosen.
        result.push(images[i]);

        // Remove it from the pool.
        images.splice(i, 1);

    }

    // Return
    return result;

}