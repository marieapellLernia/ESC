import { getAvailableTimes } from "./api.js";
import { postBooking } from "./api.js";

//Data is stored in this object for further use
const bookingData = {
    challengeId: null,
    date: null,
    fullName: null,
    email: null,
    time: null,
    participants: null
};

//Function takes care of the time Slots in the HTML form.
async function renderSlotsToHTML(date, slots, challengeID){
    try {
            const data = await getAvailableTimes(date, challengeID);
            
            // Clear loading message
            slots.innerHTML = '';
            
            // Adding each Slot as an option in the html
            data.slots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                slots.appendChild(option);
            });
            
            
        } catch (error) {
            // Error message
            slots.innerHTML = '';
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = 'Error loading time slots';
            errorOption.className = 'error';
            slots.appendChild(errorOption);
            console.error('Error fetching time slots:', error);
        }
}

//Function takes care of the modal and form submission
function nextPage(currentModalPage, nextModalPage, challengeId) {
    // Validate current modal before proceeding
    const date = document.querySelector('#date');
    if (currentModalPage === 'modal1') {
        if (!date || !date.value) {
            alert('Please select a date');
            return;
        }
    }
    bookingData.date = date.value;
    //Add the time slots section from API
    const timeSelect = document.querySelector("#time");

    if(timeSelect){renderSlotsToHTML(bookingData.date, timeSelect, challengeId)};
    
    if (currentModalPage === 'modal2') {
        const name = document.querySelector('#name');
        const email = document.querySelector('#email');
        const time = document.querySelector('#time');
        const participants = document.querySelector('#participants');
        if (!name || !name.value) {
            alert('Please enter your name');
            return;
        }
        
        if (!email || !email.value) {
            alert('Please enter your email');
            return;
        }
        
        if (!time || !time.value) {
            alert('Please select a time');
            return;
        }   
        
        if (!participants || !participants.value) {
            alert('Please enter number of participants');
            return;
        }

        // Adding data input from user to the object
        bookingData.fullName = name.value;
        bookingData.email = email.value;
        bookingData.time = time.value;
        bookingData.participants = participants.value;
    }
    
    // Hide current modal and show next modal
    const currentModalPageEl = document.getElementById(currentModalPage);
    const nextModalPageEl = document.getElementById(nextModalPage);
    
    if (currentModalPageEl) currentModalPageEl.style.display = "none";
    if (nextModalPageEl) nextModalPageEl.style.display = "block";
    
    // handles the POST request. 
    if (nextModalPage === 'modal3') {
        postBooking(bookingData);
        const backLink = document.querySelector(".back-link");
        backLink.addEventListener('click', function(){
            window.location.href = 'OurChallenges.html';
        });
        //Object.keys(bookingData).forEach(key => {console.log(key, bookingData[key]);});
    }
}

//Export the object and the functions for further use
export {bookingData, renderSlotsToHTML, nextPage};