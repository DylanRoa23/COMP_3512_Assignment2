// Fetches and distributes the clothing data.

// Configurable Variables
const API = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";
const CLOTHING_KEY = "clothing";

// Functions
/**
 * Fetches data from the API and saves it to localStorage
 * @param {string} api The API link.
 * @returns A Promise that resolves when this is done.
 */
function fetchApi(api) {

    // Fetch.
    const promise = fetch(api)
        .then(r => r.json())
        .then(d => {

            // Convert to string.
            const dstring = JSON.stringify(d);

            // Save.
            localStorage.setItem(CLOTHING_KEY, dstring);

        });

    // Return
    return promise;

}

/**
 * Gets the saved clothing data.
 * @returns A Promise<Array>. The array contains the clothing data.
 * @throws SyntaxError If localStorage[CLOTHING_KEY] is not valid JSON.
 */
export async function getClothing() {

    // Initialize
    let result = null;

    // Get data.
    const d = localStorage.getItem(CLOTHING_KEY);

    // If it exists,
    if (d) {

        // Parse it.
        result = JSON.parse(d);

    }
    // Otherwise,
    else {
        
        // Fetch it.
        await fetchApi(API);

        // Try again.
        result = getClothing();

    }

    // Return
    return result;

}
