document.addEventListener("DOMContentLoaded", () => {

    const browseBtn = document.querySelector("#browse");
    const browse = document.querySelector(".browse")
    const home = document.querySelector(".home");

    browseBtn.addEventListener("click", (e) => {

        e.preventDefault();
        home.classList.add("hidden");
        browse.classList.remove("hidden");

    });
    
});