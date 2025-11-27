import { getAvailableTimes } from "./api.js";
import { postBooking } from "./api.js";
import { bookingData, renderSlotsToHTML, nextPage, bookingRoomReservation } from "./modal.js";

const logo = document.querySelector(".logo");
const buttonGroups = document.querySelectorAll(".buttons");
const menuBtn = document.querySelector("#menuBtn")
const mainNav = document.querySelector("#mainNav")
const closeBtn = document.querySelector("#closeBtn")
const overlay = document.querySelector("#overlay");
const filterBtn = document.querySelector('.filterBtn');

menuBtn.addEventListener("click",
    function () {
        mainNav.classList.add("active");
        overlay.classList.add("active");
    }
)

closeBtn.addEventListener("click",
    function () {
        mainNav.classList.remove("active");
        overlay.classList.remove("active");
    }
)

buttonGroups.forEach(buttonGroup => {
    const buttons = buttonGroup.children;
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", () => {
            window.location.href = 'OurChallenges.html';
        });
    }
});

/* ----------------------- Book this room (Modal) ------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    // Create modal container if it doesn't exist
    let modal = document.querySelector("#BookRoomModal");
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bookRoomModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    // Event delegation on the container that holds the cards
    document.addEventListener('click', (event) => bookingRoomReservation(event, modal));
});
