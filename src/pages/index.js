import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

const cardPreview = document.querySelector("#preview-modal");
const cardPreviewCaption = cardPreview.querySelector(".modal__caption");
const previewImage = cardPreview.querySelector(".modal__image");
const cardPreviewClose = cardPreview.querySelector(
  ".modal__close-button_type_preview"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardTrashButton = cardElement.querySelector(".card__trash-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    cardPreviewCaption.textContent = data.name;
    previewImage.src = data.link;
    previewImage.alt = data.name;
    openModal(cardPreview);
  });

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardTrashButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = document.forms["profile-form"];
const profileEditCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const profileEditSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button"
);
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const profileAddModal = document.querySelector("#add-card-modal");
const cardFormElement = profileAddModal.querySelector(".modal__form");
const profileAddButton = document.querySelector(".profile__add-button");
const profileAddCloseButton = profileAddModal.querySelector(
  ".modal__close-button"
);
const profileAddSubmitButton = profileAddModal.querySelector(
  ".modal__submit-button"
);

const cardNameInput = profileAddModal.querySelector("#add-card-name-input");
const cardLinkInput = profileAddModal.querySelector("#add-card-link-input");

let currentModal = null;

function onKeyDown(evt) {
  if (evt.key === "Escape" && currentModal) {
    closeModal(currentModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  currentModal = modal;
  document.addEventListener("keydown", onKeyDown);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  currentModal = null;
  document.removeEventListener("keydown", onKeyDown);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editProfileModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const cardInputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  const cardElement = getCardElement(cardInputValues);
  cardsList.prepend(cardElement);
  cardNameInput.value = "";
  cardLinkInput.value = "";
  closeModal(profileAddModal);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editProfileModal);
  resetValidation(editFormElement, settings);
});

profileEditCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(profileAddModal);
});

profileAddCloseButton.addEventListener("click", () => {
  closeModal(profileAddModal);
});

cardPreviewClose.addEventListener("click", () => {
  closeModal(cardPreview);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

enableValidation(settings);
