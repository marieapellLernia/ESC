const menuBtn = document.querySelector("#menuBtn")
const mainNav = document.querySelector("#mainNav")
const closeBtn = document.querySelector("#closeBtn")
const overlay = document.querySelector("#overlay");
const filterBtn = document.querySelector('.filterBtn');

const btn1 = document.querySelector('.btn1');
const btn2 = document.querySelector('btn2');

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

function loadChallengesPage() {
    window.location.href = 'OurChallenges.html';
}

/* --------------------- Handle Filter Challenges ------------------------- */
document.addEventListener('DOMContentLoaded', function() {
    const filterBtn = document.querySelector('.filterBtn');
    const filterContainer = document.getElementById('filterContainer');
    const cards = document.querySelectorAll('.card');
    
    filterBtn.addEventListener("click", async function() {
        // Toggle filter interface
        if (filterContainer.innerHTML !== '') {
            filterContainer.innerHTML = '';
            return;
        }
        
        // Create container
        const filterDiv = document.createElement("div");
        filterContainer.appendChild(filterDiv);
        
        try {
            // Load external HTML
            filterBtn.style.display = "none";
            const response = await fetch('filterInterface.html');
            const html = await response.text();
            filterDiv.innerHTML = html;
            
            // Add functionality
            addFilterFunctionality(filterDiv);
            
        } catch (error) {
            console.error('Error loading filter interface:', error);
            filterDiv.innerHTML = '<p>Error loading filters</p>';
        }
    });
    
    function addFilterFunctionality(container) {
        // Checkbox functionality
        const checkboxes = container.querySelectorAll('.filter-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                applyFilters(); // Apply filters immediately when checkbox changes
            });
        });
        
        // Tag buttons toggle functionality
        const tagButtons = container.querySelectorAll('.filterTags');
        tagButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                applyFilters(); // Apply filters immediately when tags change
            });
        });
        
        // Star rating functionality
        const stars = container.querySelectorAll('.star');
        let currentRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                currentRating = index + 1;
                updateStars();
                applyFilters(); // Apply filters immediately when rating changes
            });
        });
        
        function updateStars() {
            stars.forEach((star, index) => {
                if (index < currentRating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        }
        
        // Close button functionality
        container.querySelector('#closeFilter').addEventListener('click', function() {
            const closeBtns = container.querySelectorAll(".close-btn");
            filterContainer.innerHTML = '';
            closeBtn.addEventListener('click', function(){
                container.style.display = "none";});
            filterBtn.style.display = "block";
            showAllCards(); // Show all cards when closing filter
            // Get all close buttons from the loaded modal content
                
        });
        
        // Search input functionality - apply filters as user types
        const searchInput = container.querySelector('.search-input');
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters(); // Apply filters after user stops typing
            }, 300);
        });
        
        // Apply filters function
        function applyFilters() {
            const selectedTypes = Array.from(container.querySelectorAll('.filter-checkbox:checked'))
                .map(checkbox => checkbox.dataset.type);
            const selectedTags = Array.from(container.querySelectorAll('.filterTags.active'))
                .map(btn => btn.dataset.tag);
            const rating = currentRating;
            const searchTerm = container.querySelector('.search-input').value.toLowerCase();
            
            console.log('Applying filters:', {
                types: selectedTypes,
                tags: selectedTags,
                rating: rating,
                search: searchTerm
            });
            
            filterCards(selectedTypes, selectedTags, rating, searchTerm);
        }
    }
    
    function filterCards(types, tags, rating, searchTerm) {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            let shouldShow = true;
            
            // Filter by type (online/onsite)
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            if (types.length > 0) {
                const hasOnline = types.includes('online') && cardTitle.includes('online');
                const hasOnsite = types.includes('onsite') && cardTitle.includes('on-site');
                if (!hasOnline && !hasOnsite) {
                    shouldShow = false;
                }
            }
            
            // Filter by tags (you would need to add data attributes to your cards)
            if (tags.length > 0 && shouldShow) {
                // This would require adding data-tag attributes to your cards
                // For now, we'll just show all cards if tags are selected
                // shouldShow = tags.some(tag => card.dataset.tags?.includes(tag));
            }
            
            // Filter by rating
            if (rating > 0 && shouldShow) {
                const cardStars = card.querySelectorAll('.fa-solid.fa-star').length;
                if (cardStars < rating) {
                    shouldShow = false;
                }
            }
            
            // Filter by search term
            if (searchTerm && shouldShow) {
                const cardText = card.textContent.toLowerCase();
                if (!cardText.includes(searchTerm)) {
                    shouldShow = false;
                }
            }
            
            // Show or hide the card
            if (shouldShow) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function showAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

/* ----------------------- Book this room (Modal) ------------------------- */
let bookingData = {};
async function sendPostRequest(){
    try {
        const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/booking/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                challenge: parseInt(bookingData.challengeId),
                name: bookingData.fullName,
                email: bookingData.email,
                date: bookingData.date,
                time: bookingData.time,
                participants: parseInt(bookingData.participants)
            }),
        });
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error('Booking failed:', error);
    }
}

function nextPage(currentModalPage, nextModalPage) {
    // Validate current modal before proceeding
    const date = document.querySelector('#date');
    if (currentModalPage === 'modal1') {
        if (!date || !date.value) {
            alert('Please select a date');
            return;
        }
    }
    bookingData.date = date.value;
    
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const time = document.querySelector('#time');
    const participants = document.querySelector('#participants');
    if (currentModalPage === 'modal2') {
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
    }

    //Add the time section from API
    
    // Adding data input from user to the object
    bookingData.fullName = name.value;
    bookingData.email = email.value;
    bookingData.time = time.value;
    bookingData.participants = participants.value;

    // Hide current modal and show next modal
    const currentModalPageEl = document.getElementById(currentModalPage);
    const nextModalPageEl = document.getElementById(nextModalPage);
    
    if (currentModalPageEl) currentModalPageEl.style.display = "none";
    if (nextModalPageEl) nextModalPageEl.style.display = "block";
    
    // handles the POST request. 
    if (nextModalPage === 'modal3') {
        sendPostRequest();
        const backLink = document.querySelector(".back-link");
        backLink.addEventListener('click', function(){
            window.location.href = 'OurChallenges.html';
        });
        Object.keys(bookingData).forEach(key => {console.log(key, bookingData[key]);});
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Create modal container if it doesn't exist
    let modal = document.querySelector("#bookRoomModal");
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bookRoomModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    // Event delegation on the container that holds the cards
    document.addEventListener('click', async function(event) {
        const bookButton = event.target.closest('.bookThisRoom');
        
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
                modal.style.display = "block";
                
                const modal1 = document.getElementById('modal1');
                if (modal1) {
                    modal1.style.display = "block";
                } else {
                    console.error('Modal1 not found in loaded HTML');
                    return;
                }

                // Get all close buttons
                const closeBtns = modal.querySelectorAll(".close");
                
                // Close modal 
                closeBtns.forEach(closeBtn => {
                    closeBtn.addEventListener('click', function(){
                        modal.style.display = "none";
                    });
                });

                // Close modal when clicking outside
                window.addEventListener('click', function(event){
                    if(event.target == modal){
                        modal.style.display = "none";
                    }
                });

                // Handle next page
                const nextButtons = modal.querySelectorAll('.next-btn');
                nextButtons.forEach(nextBtn => {
                    nextBtn.addEventListener('click', function() {
                        const nextModalPageId = this.dataset.next;
                        const currentModalPage = this.closest('.modal').id;
                        nextPage(currentModalPage, nextModalPageId);
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
                        modal.style.display = "none";
                    });
                }
                
            } catch (error) {
                console.error('Error loading Modal:', error);
                if (modal) {
                    modal.innerHTML = '<p>Error loading booking form. Please try again.</p>';
                    modal.style.display = "block";
                }
            }
        }
    });
});