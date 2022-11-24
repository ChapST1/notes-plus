//variables
const notesContainer = document.querySelector(".notes-container");
let fragment = document.createDocumentFragment();
let allNotes = [
  {
    id: crypto.randomUUID(),
    note: "Hello World 👋🌍",
    date: "12-12-2020",
    color: "rgb(155, 233, 177)",
  },
  {
    id: crypto.randomUUID(),
    note: "This is an impressive note for everyone 📝",
    date: "12-12-2020",
    color: "rgb(255, 132, 177)",
  },
  {
    id: crypto.randomUUID(),
    note: "Delete me if you can 🤬",
    date: "12-12-2020",
    color: "rgb(89, 126, 238)",
  },
];
//Dark Mode
const body = document.getElementById("body");
const btnDark = document.getElementById("btnDark");
const btnDarkIcon = document.querySelector(".header__button-img");
//search
const search = document.getElementById("search");
/* open modal btn */
const createNote = document.getElementById("createNote");
const createColors = document.getElementById("createColors");
const colors = document.querySelectorAll(".create__color");
const customColor = document.getElementById("customColor");
/* modal */
const modal = document.getElementById("modal");
const modalNote = document.getElementById("modalNote");
const modalText = document.getElementById("modalText");
const modalDate = document.getElementById("modalDate");
/* form */
const form = document.getElementById("modalForm");
const input = document.getElementById("modalInput");
const btnCreate = document.getElementById("btnCreate");

showSaveNotes();

//functions
function showNotes(arr) {
  notesContainer.innerHTML = "";
  arr.map((e) => {
    const div = document.createElement("div");
    div.classList.add("notes__item");
    div.setAttribute("id", e.id);
    div.style.background = e.color;

    div.innerHTML = `
      <aside class="notes__options" id="notesOptions">
        <span class="notes__options-ball"></span>
        <span class="notes__options-ball"></span>
        <span class="notes__options-ball"></span>
      </aside>
     <!-- notes__options-active click>> -->
       <nav class="nav">
        <i class="fa-solid fa-trash"></i>
        <i class="fa-solid fa-pen-to-square fa-edit"></i>
        <i class="fa-solid fa-palette"></i>
      </nav>
      <p class="notes__text" id="notesText">${e.note}</p>
      <span class="notes__date">${e.date}</span>
    `;
    fragment.appendChild(div);
  });
  notesContainer.appendChild(fragment);

  //show notes saved
  handleOptions();
  handleDelete();
  handleEdit();
  selectColor();
  handleSearch();
}
createNewNote();

function handleOptions() {
  //variables
  const btnOptions = document.querySelectorAll(".notes__options"); //options ...
  return btnOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.nextElementSibling.classList.toggle("navActive");
      btn.nextElementSibling.style.background =
        btn.parentElement.style.background;
    });
  });
}
function selectColor() {
  colors.forEach((color) => {
    color.addEventListener("click", () => {
      const cssObj = window.getComputedStyle(color); //get color
      modalNote.style.background = cssObj.getPropertyValue("background-color");
    });
  });
  //custom color
  customColor.addEventListener("input", () => {
    modalNote.style.background = customColor.value;
  });
}
function createNewNote() {
  input.addEventListener("keyup", () => {
    modalText.textContent = input.value;
  });
  let now = new Date();
  modalDate.textContent = `${now.getDate()}-${
    now.getMonth() + 1
  }-${now.getFullYear()}`;
  //function
  handleSubmit();
}
function handleSubmit() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value !== "") {
      //create note
      const newNote = {
        id: crypto.randomUUID(),
        note: modalText.textContent,
        date: modalDate.textContent,
        color: window
          .getComputedStyle(modalNote)
          .getPropertyValue("background-color"),
      };

      allNotes.unshift(newNote);
      showNotes(allNotes);
      saveNotes();
      createNote.classList.remove("create-note-active");
      createColors.classList.remove("create-colorsActive");
      modal.classList.remove("modalActive");
      input.value = "";
      modalText.textContent = "";
      modalNote.style.background = "#ffe9b1";
    }
  });
}
function handleDelete() {
  const iconDelete = document.querySelectorAll(".fa-trash");
  iconDelete.forEach((icon) => {
    icon.addEventListener("click", () => {
      const id = icon.parentElement.parentElement.id;
      allNotes = allNotes.filter((element) => element.id !== id);
      saveNotes();
      if (allNotes.length === 0) {
        notesContainer.innerHTML = `
        <div class="no-notes-container">
          <img src="../public/Rmx_Notes.svg" alt="icon" class="no-notes__img">
          <p class="no-notes__title">No notes</p>
        </div>
        `;
      }
    });
  });
}
function handleEdit() {
  const iconsEdit = document.querySelectorAll(".fa-edit");
  miniEdit(iconsEdit, "edit", "formInput", "note");

  const iconsPalette = document.querySelectorAll(".fa-palette");
  miniEdit(iconsPalette, "palette", "formColor", "color");
}
//edits function
function miniEdit(icons, is, idInput, change) {
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      let item = icon.parentElement.parentElement;
      //html
      const editHtml = `
      <input type="text" class="form-edit__input" id=${idInput} value="${item.children[2].textContent.trim()}" placeholder="edit" autocomplete="off">
      <button class="form-edit__btn" id="formEditBtn">Save</button>
      `;
      const editPalette = `<input type="color" class="form-edit__color" id=${idInput} value="${item.style.background}">
      <button class="form-edit__btn" id="formEditBtn">Save</button>
      `;

      item.innerHTML = `<form class="form-edit">
        ${is == "edit" ? editHtml : editPalette}
      </form>`;

      const form = document.querySelector(".form-edit");
      const formEditInput = document.getElementById(idInput);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        allNotes.map((e) => {
          if (e.id === item.getAttribute("id")) {
            e[change] = formEditInput.value;
          }
        });
        saveNotes();
      });
    });
  });
}
function handleSearch() {
  const allTextNotes = document.querySelectorAll("#notesText");
  search.addEventListener("keydown", () => {
    allTextNotes.forEach((e) => {
      if (search.value.length === 1) {
        e.parentElement.classList.remove("filterActive");
      } else if (
        !e.textContent
          .toString()
          .toLowerCase()
          .includes(search.value.toLowerCase())
      ) {
        e.parentElement.classList.add("filterActive");
      } else {
        e.parentElement.classList.remove("filterActive");
      }
    });
  });
}
//events
//Active dark mode
btnDark.addEventListener("click", () => {
  btnDark.classList.toggle("header__buttonActive");
  body.classList.toggle("body-dark");
  if (body.className == "body-dark") {
    localStorage.setItem("DarkMode", "true");
    btnDarkIcon.setAttribute("src", "../public/icons/ph_moon-fill.png");
  } else {
    localStorage.setItem("DarkMode", "false");
    btnDarkIcon.setAttribute("src", "../public/icons/ph_sun-fill.png");
  }
});
//using local storage
if (localStorage.getItem("DarkMode") == "true") {
  btnDark.classList.toggle("header__buttonActive");
  body.classList.toggle("body-dark");
  btnDarkIcon.setAttribute("src", "../public/icons/ph_moon-fill.png");
}
//open modal
createNote.addEventListener("click", () => {
  createNote.classList.toggle("create-note-active");
  createColors.classList.toggle("create-colorsActive");
  modal.classList.toggle("modalActive");
});

//save notes to local storage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(allNotes));
  showSaveNotes();
}
function showSaveNotes() {
  showNotes(JSON.parse(localStorage.getItem("notes")) || allNotes);
}
