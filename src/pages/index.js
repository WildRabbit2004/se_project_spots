import "./index.css";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";
import logoImage from "../images/logo.svg";
import editIcon from "../images/edit-profile-icon.svg";
import plusIcon from "../images/plus-icon.svg";
import closeIcon from "../images/close-icon.svg";
import closePreviewIcon from "../images/close-icon_preview.svg";
import Api from "../utils/Api.js";

document.querySelector(".header__logo").src = logoImage;
document.querySelector(".profile__edit-button img").src = editIcon;
document.querySelector(".profile__add-button img").src = plusIcon;
document.querySelector("#edit-profile-modal .modal__close-button img").src =
  closeIcon;
document.querySelector("#add-card-modal .modal__close-button img").src =
  closeIcon;
document.querySelector("#avatar-modal .modal__close-button img").src =
  closeIcon;
document
  .querySelectorAll(".modal__close-button_type_preview img")
  .forEach((img) => {
    img.src = closePreviewIcon;
  });

const cardPreview = document.querySelector("#preview-modal");
const cardPreviewCaption = cardPreview.querySelector(".modal__caption");
const previewImage = cardPreview.querySelector(".modal__image");
const cardPreviewClose = cardPreview.querySelector(
  ".modal__close-button_type_preview",
);

const avatarContainer = document.querySelector(".profile__avatar-container");
const avatarModalButton = avatarContainer.querySelector(
  ".profile__avatar-button",
);

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalSubmitButton = avatarModal.querySelector(
  ".modal__submit-button",
);
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button",
);
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = document.forms["profile-form"];
const profileEditCloseButton = editProfileModal.querySelector(
  ".modal__close-button",
);
const profileEditSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button",
);
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const profileAddModal = document.querySelector("#add-card-modal");
const cardFormElement = profileAddModal.querySelector(".modal__form");
const profileAddButton = document.querySelector(".profile__add-button");
const profileAddCloseButton = profileAddModal.querySelector(
  ".modal__close-button",
);
const profileAddSubmitButton = profileAddModal.querySelector(
  ".modal__submit-button",
);

const cardNameInput = profileAddModal.querySelector("#add-card-name-input");
const cardLinkInput = profileAddModal.querySelector("#add-card-link-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const deleteCardModal = document.querySelector("#delete-modal");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");
const deleteCardSubmitButton = deleteCardModal.querySelector(
  ".modal__submit-button",
);
const deleteCardCancelButton = deleteCardModal.querySelector(
  ".modal__cancel-button",
);
const deleteCardCloseButton = deleteCardModal.querySelector(
  ".modal__close-button",
);
const selectedCardData = { card: null, id: null };

function renderLoading(
  isLoading,
  button,
  loadingText = "Saving...",
  defaultText = "Save",
) {
  button.textContent = isLoading ? loadingText : defaultText;
}

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6ed89521-55e0-4da1-97ae-409c7e51de20",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    document.querySelector(".profile__avatar").src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch((err) => {
    console.error(err);
  });

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

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

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardImageEl.addEventListener("click", () => {
    cardPreviewCaption.textContent = data.name;
    previewImage.src = data.link;
    previewImage.alt = data.name;
    openModal(cardPreview);
  });

  cardLikeButton.addEventListener("click", () => {
    const isLiked = cardLikeButton.classList.contains(
      "card__like-button_liked",
    );
    const apiCall = isLiked ? api.unlikeCard(data._id) : api.likeCard(data._id);

    apiCall
      .then(() => {
        cardLikeButton.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  });

  cardTrashButton.addEventListener("click", () => {
    selectedCardData.card = cardElement;
    selectedCardData.id = data._id;
    openModal(deleteCardModal);
  });

  return cardElement;
}

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
  renderLoading(true, profileEditSubmitButton);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, profileEditSubmitButton));
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, profileAddSubmitButton);
  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      cardFormElement.reset();
      closeModal(profileAddModal);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, profileAddSubmitButton));
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, avatarModalSubmitButton);
  api
    .editAvatar({ avatar: avatarInput.value })
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, avatarModalSubmitButton));
}

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, deleteCardSubmitButton, "Deleting...", "Delete");
  api
    .deleteCard(selectedCardData.id)
    .then(() => {
      selectedCardData.card.remove();
      selectedCardData.card = null;
      selectedCardData.id = null;
      closeModal(deleteCardModal);
    })
    .catch(console.error)
    .finally(() =>
      renderLoading(false, deleteCardSubmitButton, "Deleting...", "Delete"),
    );
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
  cardFormElement.reset();
  resetValidation(cardFormElement, settings);
  openModal(profileAddModal);
});

profileAddCloseButton.addEventListener("click", () => {
  closeModal(profileAddModal);
});

cardPreviewClose.addEventListener("click", () => {
  closeModal(cardPreview);
});

avatarModalButton.addEventListener("click", () => {
  avatarForm.reset();
  resetValidation(avatarForm, settings);
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteCardCloseButton.addEventListener("click", () => {
  closeModal(deleteCardModal);
});

deleteCardCancelButton.addEventListener("click", () => {
  closeModal(deleteCardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
deleteCardForm.addEventListener("submit", handleDeleteCardSubmit);

enableValidation(settings);
