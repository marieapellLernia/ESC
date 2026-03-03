import { getAvailableTimes } from "./api.js";
import { postBooking } from "./api.js";
import { fetchChallenges } from "./api.js";

//Data is stored in this object for further use
const bookingData = {
    challengeId: null,
    challengeTitle: null,
    date: null,
    fullName: null,
    email: null,
    tel: null,
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
async function nextPage(currentModalPage, nextModalPage, challengeId) {
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
        const tel = document.querySelector('#tel');
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

        const phoneRegex = /^\d{10}$/;

        // If tel is a string/number that isn't 10 digits, show error
        if (!phoneRegex.test(String(tel.value))) {
            alert('Please enter a valid 10-digit telephone number');
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
        bookingData.tel = tel.value;
        bookingData.time = time.value;
        bookingData.participants = participants.value;
    }
    
    // Hide current modal and show next modal
    const currentModalPageEl = document.getElementById(currentModalPage);
    const nextModalPageEl = document.getElementById(nextModalPage);

    if (currentModalPageEl) {
        currentModalPageEl.style.visibility = "hidden";
        currentModalPageEl.style.opacity = "0";
    }

    if (nextModalPageEl) {
        nextModalPageEl.style.visibility = "visible";
        nextModalPageEl.style.opacity = "1";
    }
    
    // handles the POST request. 
    if (nextModalPage === 'modal3') {
        postBooking(bookingData);
        const backLink = document.querySelector(".back-link");
        backLink.addEventListener('click', function(){
            window.location.href = 'OurChallenges.html';
        });
    }
}

//Handle modal pages
async function bookingRoomReservation(event, modal) {
        const bookButton = event.target.closest('.BookThisRoom');
        
        if (bookButton) {
            event.preventDefault();
            
            try {
                bookingData.challengeId = bookButton.dataset.id;
                
                // Load external HTML for modal
                const response = await fetch('bookThisRoomModal.html');
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                const html = await response.text();
                
                if (!modal) {
                    console.error('Modal container not found');
                    return;
                }    
                modal.innerHTML = html;
                modal.classList.remove("show");
                void modal.offsetWidth;
                modal.classList.add("show");

               const modal1 = document.getElementById('modal1');
            if (modal1) {
              modal1.style.opacity="1";
              modal1.style.visibility="visible";
                
                // User cant select a past date
                const dateInput = modal1.querySelector("#date");
                if (dateInput) {
                    dateInput.min = new Date().toISOString().split("T")[0];
                }

                // Limit participants
                const participantsInput = modal1.querySelector("#participants");
                if (participantsInput) {
                    participantsInput.min = 1;
                    participantsInput.value = 1;
                }

                // Set room title in ALL modals
                const roomTitles = modal.querySelectorAll('.bookedRoom-title');
                if (roomTitles.length > 0) {
                    try {
                        const fetchTitle = await fetchChallenges();
                        const challengeTitle = fetchTitle.find(challenge => 
                            challenge.id === parseInt(bookingData.challengeId)
                        );
                        
                        roomTitles.forEach(titleElement => {
                            const modalElement = titleElement.closest('.modal');
                            if (modalElement && modalElement.id == 'modal1') {
                                if(challengeTitle.type == "onsite"){
                                    titleElement.innerHTML = `Book room "${challengeTitle.title}" (step 1)`;
                                } else {
                                    titleElement.innerHTML = `Take challenge online "${challengeTitle.title}" (step 1)`;
                                }
                            } else if (modalElement && modalElement.id == 'modal2') {
                                if(challengeTitle.type == "onsite"){
                                    titleElement.innerHTML = `Book room "${challengeTitle.title}" (step 2)`;
                                } else {
                                    titleElement.innerHTML = `Take challenge online "${challengeTitle.title}" (step 2)`;
                                }
                            }
                        });

                        // Participants based on min/max from API
                        const participantsInput = modal.querySelector("#participants");
                        if (participantsInput && challengeTitle) {
                            const min = challengeTitle.minParticipants;
                            const max = challengeTitle.maxParticipants;

                            participantsInput.min = min;
                            participantsInput.max = max;
                            participantsInput.value = min;

                            participantsInput.addEventListener("input", () => {
                                if (participantsInput.value > max) participantsInput.value = max;
                                if (participantsInput.value < min) participantsInput.value = min;
                            });
                        }

                        bookingData.challengeTitle = challengeTitle;
                    } catch (error) {
                        console.error('Error fetching challenge title:', error);
                        
                    }
                }
                    
                }else {
                console.error('Modal1 not found in loaded HTML');
                return;
                }

                // Get all close buttons
                const closeBtns = modal.querySelectorAll(".close");
                
                // Close modal 
                closeBtns.forEach(closeBtn => {
                    closeBtn.addEventListener('click', function(){
                       modal.classList.remove("show");
                       setTimeout(() => {modal.innerHTML = "";}, 300);
                    });
                });

                // Handle next page
                const nextButtons = modal.querySelectorAll('.next-btn');
                nextButtons.forEach(nextBtn => {
                    nextBtn.addEventListener('click', function() {
                        const nextModalPageId = this.dataset.next;
                        const currentModalPage = this.closest('.modal').id;
                        nextPage(currentModalPage, nextModalPageId, bookingData.challengeId);
                    });
                });

                // Handle form submissions
                const bookingForm1 = document.getElementById('bookingForm');
                if (bookingForm1) {
                    bookingForm1.addEventListener('submit', function(e) {
                        e.preventDefault();
                    });
                }

                const bookingForm2 = document.getElementById('bookingForm2');
                if (bookingForm2) {
                    bookingForm2.addEventListener('submit', function(e) {
                        e.preventDefault();
                        modal.style.visibility = "hidden";
                        modal.style.opacity="0";
                    });
                }
                
            } catch (error) {
                console.error('Error loading Modal:', error);
                if (modal) {
                    modal.innerHTML = '<p>Error loading booking form. Please try again.</p>';
                    modal.style.visibility = "visible";
                    modal.style.opacity="1";
                }
            }
        }
    }

//Export the object and the functions for further use
export {bookingData, renderSlotsToHTML, nextPage, bookingRoomReservation};