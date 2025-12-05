document.addEventListener("DOMContentLoaded", () => {
    const browse = document.querySelector("#browse");
    const home = document.querySelector(".home");

    browse.addEventListener("click", (e) => {
        e.preventDefault();
        home.classList.add("hidden");
    });
});