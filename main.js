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
/*export async function toggleModal(buttonID) {
    try {
        const modal = document.querySelector("#bookRoomModal");

        // Load external HTML for modal
        const response = await fetch('bookThisRoomModal.html');
        const html = await response.text();
        modal.innerHTML = html;

        // Show the modal
        modal.style.display = "block";

        // Get the close button from the newly loaded modal content
        const closeBtn = modal.querySelector(".close");

        // Close modal when X is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                modal.style.display = "none";
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

        // Handle form submission
        const bookingForm = modal.querySelector('#bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', function (e) {
                e.preventDefault();
                // Handle form submission here
                alert('Booking submitted!');
                modal.style.display = "none";
            });
        }

    } catch (error) {
        console.error('Error loading Modal:', error);
        modal.innerHTML = '<p>Error loading booking form</p>';
    }
}*/

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