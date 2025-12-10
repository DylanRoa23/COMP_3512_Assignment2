import { getClothing } from "./api.js";

// Configurable variables
const body = document.querySelector("body")
const TOAST_ID = "toast";
const TOAST_TIME = 3000; // in ms

// Functions
/**
* Displays the toast message. Creates a toast div and places it in body. However, external css is still required. 
*/
export function showToast(message) {

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
export async function getRandomProduct(){
    
    // Internal variables
    const clothingArray = await getClothing();
    const i = getRandomInt(0, clothingArray.length - 1);

    // Return
    return clothingArray[i];

}