import { renderList } from './createcard.js';
import { fetchChallenges } from './api.js';


const allChallenges = await fetchChallenges();
const container = document.querySelector('#allChallenges');

renderList(container, allChallenges);

/* All variables from DOM */
const cbOnline = document.querySelector('.checkbox-online');
const cbOnsite = document.querySelector('.checkbox-onsite');
const textInput = document.querySelector('.search-input')
const filterBtn = document.querySelector('.filterBtn');
const filterInterface = document.querySelector('.filter-interface');
const closeBtn = document.querySelector('.close-btn');
const filterTags = document.querySelectorAll('.filterTags');
const starMin = document.querySelectorAll('.rating .star-container:first-of-type .star');
const starMax = document.querySelectorAll('.rating .star-container:last-of-type .star');
let minRating = 0;
let maxRating = 5;
markStars(starMax, maxRating);
const radioAnd = document.querySelector('#and');
const radioOr = document.querySelector('#or');
const globalAnd = document.querySelector('#filterAnd');
const globalOr = document.querySelector('#filterOr');


/* Eventlisteners */
cbOnline.addEventListener('change', filter);
cbOnsite.addEventListener('change', filter);
textInput.addEventListener('input', filter);
radioAnd.addEventListener('change', filter);
radioOr.addEventListener('change', filter);
globalAnd.addEventListener('change', filter);
globalOr.addEventListener('change', filter);
filterBtn.addEventListener('click', () => {
    filterInterface.classList.add('active');
});
closeBtn.addEventListener('click', () => {
    filterInterface.classList.remove('active');
});
filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        filter();
    });
});
starMin.forEach((star, index) => {
    star.addEventListener('click', () => {
        const newValue = index + 1;

        if (minRating === newValue) {
            minRating = 0;
        }
        else {
            minRating = newValue;

            if (minRating > maxRating) {
                maxRating = minRating;
                markStars(starMax, maxRating);
            }
        }

        markStars(starMin, minRating);
        filter();
    });
});
starMax.forEach((star, index) => {
    star.addEventListener('click', () => {
        const newValue = index + 1;

        if (maxRating === newValue) {
            maxRating = 0;
        }
        else {
            maxRating = newValue;
            if (maxRating < minRating) {
                minRating = maxRating;
                markStars(starMin, minRating);
            }
        }
        markStars(starMax, maxRating);
        filter();
    });
});
function markStars(stars, count) {
    stars.forEach((star, i) => {
        star.classList.toggle('active', i < count);
    });
}

/* Main filter function */
function filter() {
    const showOnline = cbOnline.checked;
    const showOnsite = cbOnsite.checked;
    const searchText = textInput.value.toLowerCase().trim();

    const activeTags = [];
    const activeElements = document.querySelectorAll('.filterTags.active');
    activeElements.forEach(tag => {
        activeTags.push(tag.dataset.tag);
    });

    const tagMode = radioAnd.checked ? 'and' : 'or';

    // --- Global AND/OR ---
    const globalMode = globalAnd.checked ? 'and' : 'or';

    // Check active filters
    const hasTypeFilter = showOnline || showOnsite;
    const hasTextFilter = searchText.length >= 3;
    const hasTagFilter = activeTags.length > 0;
    const hasRatingFilter = !(minRating === 0 && maxRating === 5);

    const filtered = allChallenges.filter(challenge => {
        const tests = [];

        // Checkbox filter
        if (hasTypeFilter) {
            let matchType = true;

            if (showOnline && !showOnsite) {
                matchType = challenge.type === 'online';
            } else if (!showOnline && showOnsite) {
                matchType = challenge.type === 'onsite';
            } else if (showOnline && showOnsite) {
                matchType = true;
            }

            tests.push(matchType);
        }

        // Text-filter
        if (hasTextFilter) {
            const title = challenge.title.toLowerCase();
            const desc = challenge.description.toLowerCase();
            const matchText = title.includes(searchText) || desc.includes(searchText);
            tests.push(matchText);
        }

        //Tag-filter
        if (hasTagFilter) {
            if (!challenge.labels || !Array.isArray(challenge.labels)) {
                tests.push(false);
            } else {
                if (tagMode === 'and') {
                    
                    const matchTags = activeTags.every(tag =>
                        challenge.labels.includes(tag)
                    );
                    tests.push(matchTags);
                } else {
            
                    const matchTags = activeTags.some(tag =>
                        challenge.labels.includes(tag)
                    );
                    tests.push(matchTags);
                }
            }
        }

        // star-filter
        if (hasRatingFilter) {
            const ratingRounded = Math.round(challenge.rating);
            const matchRating =
                ratingRounded >= minRating &&
                ratingRounded <= maxRating;

            tests.push(matchRating);
        }

        if (tests.length === 0) {
            return true;
        }

        if (globalMode === 'and') {
       
            return tests.every(Boolean);
        } else {
            return tests.some(Boolean);
        }
    });

    renderList(container, filtered);
}










