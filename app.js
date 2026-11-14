
const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");

startBtn.addEventListener("click", () => {
    message.textContent =
        "Welcome, Earth Explorer! Your mission starts now. 🚀";

    startBtn.textContent = "Mission Started ✓";
});
