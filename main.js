import { getAvailableTimes } from "./api.js";
import { bookingData, renderSlotsToHTML, nextPage, bookingRoomReservation } from "./modal.js";
import { postBooking } from "./api.js";

const logo = document.querySelector(".logo");
const buttonGroups = document.querySelectorAll(".buttons");
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

buttonGroups.forEach(buttonGroup => {
    const buttons = buttonGroup.children;
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", () => {
            window.location.href = 'OurChallenges.html';
        });
    }
});

logo.addEventListener("click", () => {
    window.location.href = 'index.html';
});

/* --------------------- Handle Filter Challenges ------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    let bookingData = {};
    const filterBtn = document.querySelector('.filterBtn');
    const filterContainer = document.getElementById('filterContainer');
    const cards = document.querySelectorAll('.card');

    filterBtn.addEventListener("click", async function () {
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
            checkbox.addEventListener('change', function () {
                applyFilters(); // Apply filters immediately when checkbox changes
            });
        });

        // Tag buttons toggle functionality
        const tagButtons = container.querySelectorAll('.filterTags');
        tagButtons.forEach(button => {
            button.addEventListener('click', function () {
                this.classList.toggle('active');
                applyFilters(); // Apply filters immediately when tags change
            });
        });

        // Star rating functionality
        const stars = container.querySelectorAll('.star');
        let currentRating = 0;

        stars.forEach((star, index) => {
            star.addEventListener('click', function () {
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
        container.querySelector('#closeFilter').addEventListener('click', function () {
            filterContainer.innerHTML = '';
            filterBtn.style.display = "block";
            showAllCards(); // Show all cards when closing filter
        });

        // Search input functionality - apply filters as user types
        const searchInput = container.querySelector('.search-input');
        let searchTimeout;
        searchInput.addEventListener('input', function (e) {
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