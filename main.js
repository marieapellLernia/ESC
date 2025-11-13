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
document.addEventListener('DOMContentLoaded', function() {
    // Get all "Book this room" buttons - use class instead of ID since there are multiple
    const bookButtons = document.querySelectorAll('.bookThisRoom');
    const modal = document.querySelector("#bookRoomModal");
    
    function nextPage(currentModalPage, nextModalPage) {
         // Validate current modal before proceeding
        if (currentModalPage === 'modal1') {
            const date = document.querySelector('#date');
            if (!date || !date.value) {
                alert('Please select a date');
                return;
            }
        }
        
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
        }
        // Hide current modal and show next modal
        const currentModalPageEl = document.getElementById(currentModalPage);
        const nextModalPageEl = document.getElementById(nextModalPage);
        
        if (currentModalPageEl) currentModalPageEl.style.display = "none";
        if (nextModalPageEl) nextModalPageEl.style.display = "block";
        
        if (nextModalPage === 'modal3') {
            alert("Booking completed! Adding data to an object to be store in a DataBase");
        }
    }
    
    // Add click event to each "Book this room" button
    bookButtons.forEach(button => {
        button.addEventListener("click", async function() {
            try {
                // Load external HTML for modal
                const response = await fetch('bookThisRoomModal.html');
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                const html = await response.text();
                modal.innerHTML = html;
                
                modal.style.display = "block";
                const modal1 = modal.querySelector('#modal1');
                if (modal1) modal1.style.display = "block";

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
                const bookingForm1 = modal.querySelector('#bookingForm');
                if (bookingForm1) {
                    bookingForm1.addEventListener('submit', function(e) {
                        e.preventDefault();
                        // Don't submit yet
                    });
                }

                const bookingForm2 = modal.querySelector('#bookingForm2');
                if (bookingForm2) {
                    bookingForm2.addEventListener('submit', function(e) {
                        e.preventDefault();
                        // Handle final form submission here
                        alert('Booking submitted! Add the date to the Database');
                        modal.style.display = "none";
                    });
                }
                
            } catch (error) {
                console.error('Error loading Modal:', error);
                modal.innerHTML = '<p>Error loading booking form. Please try again.</p>';
                modal.style.display = "block";
            }
        });
    });
});