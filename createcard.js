
//import { toggleModal } from "./main.js";
import {fetchChallenges} from './api.js';

//-------------------Create card-------------------//
function createCard(challenge, container) {
  if (!container) return;

  // --- All elements ---
  const card = document.createElement("article");
  const cardImage = document.createElement("img");
  const cardContent = document.createElement("div");
  const cardHeader = document.createElement("h3");
  const rating = document.createElement("div");
  const participants = document.createElement("span");
  const description = document.createElement("p");
  const bookButton = document.createElement("button");
  const typeIcon = document.createElement("span");

  // --- Add classes, src, attributes ---
  card.classList.add("card");
  cardImage.src = challenge.image;
  cardContent.classList.add("cardContent");
  cardHeader.innerText = challenge.title;
  rating.classList.add("rating");
  typeIcon.classList.add("cardTypeIcon");
  participants.classList.add("participants");

let min = challenge.minParticipants;
let max = challenge.maxParticipants;

participants.innerText =
  min === max
    ? min + " participants"
    : min + "-" + max + " participants";

  description.innerText = challenge.description;

  bookButton.classList.add("BookThisRoom","bookBtn");
  bookButton.dataset.id = challenge.id;
  bookButton.innerText = "Book this room";

  // --- Create stars depending on rating from API---
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("span");
    star.classList.add(
      i < challenge.rating ? "fa-solid" : "fa-regular",
      "fa-star"
    );
    rating.appendChild(star);
  }

  // --- Add card elements ---
  container.appendChild(card);
  card.appendChild(cardImage);
  card.appendChild(cardContent);
  card.appendChild(typeIcon);
  cardContent.appendChild(cardHeader);
  rating.appendChild(participants);
  cardContent.appendChild(rating);
  cardContent.appendChild(description);
  cardContent.appendChild(bookButton);

  // --- Add label/image depending on online/on-site ---
  if (challenge.type === "online") {

    participants.innerText += " (networked)";
    typeIcon.classList.add("fa-solid", "fa-display");
    bookButton.innerText = "Take challenge online";

  } else {

    cardHeader.innerText += " (on-site)";
    typeIcon.classList.add("fa-solid", "fa-house");
    bookButton.innerText = "Book this room";
  }
}

//-------------------Render list (top 3 / all)-------------------//
export function renderList(container, list) {
  if (!container) return;

  container.innerHTML = '';

  if (!list.length) {
    container.innerHTML = '<p>No challenges found.</p>';
    return;
  }

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = "bookRoomModal";
  container.appendChild(modal);
  list.forEach(challenge => {
    createCard(challenge, container);
  });
}


//-------------------Init when DOM is built-------------------//
document.addEventListener('DOMContentLoaded', async () => {
  const popularCh = document.getElementById('popularChallenges');
  const allCh = document.getElementById('allChallenges');

  // Loading text
  if (popularCh) popularCh.innerHTML = '<p>Loading…</p>';
  if (allCh) allCh.innerHTML = '<p>Loading…</p>';

  try {
    const challenges = await fetchChallenges();

    // Top 3 challenges
    if (popularCh) {
      const top3 = [...challenges]
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 3);

      renderList(popularCh, top3);
    }

    // All challenges
    if (allCh) {
      renderList(allCh, challenges);
    }

    

  } catch (err) {
    console.error(err);
    const errorText = 'Could not fetch data. ' + err.message;

    if (popularCh) {
      popularCh.innerHTML = '<p class="error">' + errorText + '</p>';
    }
    if (allCh) {
      allCh.innerHTML = '<p class="error">' + errorText + '</p>';
    }
  }
});
