const inputFieldToNewValue = document.querySelector("[data-js-id=inputFieldToNewValue]");
const main = document.querySelector("[data-js-id=main]");
const buttonToggleAll = document.querySelector("[data-js-id=completedAll]");
const buttonToggleShowItems = document.getElementsByName("buttonToggleShowItems");
const counter = document.querySelector("[data-js-id=counter]");
const buttonDeleteCompleted = document.querySelector(
  '[data-js-id="deleteCompleted"]'
);
const footer = document.querySelector("[data-js-id=footer]");

let listAll = [];
for (let i = 0; i < buttonToggleShowItems.length; i++){
  buttonToggleShowItems[i].addEventListener("change", () => reload());
}
inputFieldToNewValue.addEventListener("keypress", event => handleInputFieldOnPressEnter(event));
window.addEventListener("DOMContentLoaded", () => handleWindowLoad());
main.children[0].addEventListener("change", () => toggleAll());
buttonDeleteCompleted.addEventListener("click", () => handleButtonDeleteCompletedOnClick());

handleInputFieldOnPressEnter = (event) =>{
  if (event.key === 'Enter'){
    addNewItem();
  }
}

handleWindowLoad = () => {
  reload();
}

handleButtonDeleteCompletedOnClick = () =>{
  deleteCompleted();
}


addNewItem = () => {
  if (inputFieldToNewValue.value && inputFieldToNewValue.value[0] !== ' ' && inputFieldToNewValue.value[inputFieldToNewValue.value.length - 1] !== ' ') {
    listAll.push({
      text: inputFieldToNewValue.value,
      completed: false,
      id: Date.now()
    });
    inputFieldToNewValue.value = "";
    localStorage.setItem("list", JSON.stringify(listAll));
    reload();
  }
};

deleteItem = el => {
  listAll = listAll.filter(value => {
    return value.id != el.getAttribute("data-list-id");
  });
  localStorage.setItem("list", JSON.stringify(listAll));
  reload();
};

editElement = el => {
  let text = el.children[1].innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = text;
  input.classList.add("item__edit");
  input.addEventListener("blur", () => addNewValueToItem(el, input));
  input.addEventListener("keypress", event => {
    if (event.key === "Enter") {
      input.blur();
    }
  });
  el.appendChild(input);
  input.focus();
};

addNewValueToItem = (el, input) => {
  if (input.value && input.value[0] !== ' ') {
    el.children[1].innerText = input.value;
    el.removeChild(input);
    for (key in listAll) {
      if (listAll[key].id == el.getAttribute("data-list-id")) {
        listAll[key].text = el.children[1].innerText;
        localStorage.setItem("list", JSON.stringify(listAll));
      }
    }
  } else {
    deleteItem(el);
  }
};

toggleItemCheckBox = el => {
  for (key in listAll) {
    if (listAll[key].id == el.getAttribute("data-list-id")) {
      listAll[key].completed = el.children[0].checked;
    }
  }
  localStorage.setItem("list", JSON.stringify(listAll));
  reload();
};

showDeleteButton = el => {
  el.children[2].classList.add("item__button-delete_view");
};

hideDeleteButton = el => {
  el.children[2].classList.remove("item__button-delete_view");
};

toggleAll = () => {
  if (main.children[0].checked) {
    for (key in listAll) {
      listAll[key].completed = true;
    }
  } else {
    for (key in listAll) {
      listAll[key].completed = false;
    }
  }
  localStorage.setItem("list", JSON.stringify(listAll));
  reload();
};

reload = () => {
  let value;
  for (key in buttonToggleShowItems){
    if (buttonToggleShowItems[key].checked){
      value = buttonToggleShowItems[key].value
    }
  }
  switch (value){
    case 'all': {
      while (main.children[1].firstChild) {
        main.children[1].removeChild(main.children[1].firstChild);
      }
      listAll = [];
      showElements(value);
      break;
      }
    case 'completed': {
      while (main.children[1].firstChild) {
        main.children[1].removeChild(main.children[1].firstChild);
      }
      showCompletedElements();
      break;
      }
    case 'active': {
      while (main.children[1].firstChild) {
        main.children[1].removeChild(main.children[1].firstChild);
      }
      showActiveElements();
      break;
      }
    default: break;
    }
    handleStateApp();
    counterActive();
};

showElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement("div");

    deleteButton.classList.add("item__button-delete");
    deleteButton.addEventListener("click", () => deleteItem(el));
    checkbox.type = "checkbox";
    checkbox.name = "checkList";
    checkbox.classList.add("item__checkbox");
    label.classList.add("item__text");
    el.appendChild(checkbox);
    el.appendChild(label);
    el.appendChild(deleteButton);
    el.addEventListener("mouseover", () => showDeleteButton(el));
    el.addEventListener("mouseout", () => hideDeleteButton(el));
    checkbox.addEventListener("change", () => toggleItemCheckBox(el));
    checkbox.checked = elements[key].completed;
    if (checkbox.checked) {
      el.children[1].classList.add("item__text_completed");
    }
    label.innerText = elements[key].text;
    el.children[1].addEventListener("dblclick", () => editElement(el));
    el.classList.add("item");
    el.dataset.listId = elements[key].id;
    main.children[1].appendChild(el);

    listAll.push({
      text: elements[key].text,
      id: elements[key].id,
      completed: elements[key].completed
    });
  }
};

showCompletedElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  elements = elements.filter(value => value.completed);
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement("div");

    deleteButton.classList.add("item__button-delete");
    deleteButton.addEventListener("click", () => deleteItem(el));
    checkbox.type = "checkbox";
    checkbox.name = "checkList";
    checkbox.checked = true;
    checkbox.classList.add("item__checkbox");
    label.classList.add("item__text");
    label.classList.add("item__text_completed");
    label.classList.add("checked");
    el.appendChild(checkbox);
    el.appendChild(label);
    el.appendChild(deleteButton);
    el.addEventListener("mouseover", () => showDeleteButton(el));
    el.addEventListener("mouseout", () => hideDeleteButton(el));
    checkbox.addEventListener("change", () => toggleItemCheckBox(el));
    label.innerText = elements[key].text;
    el.children[1].addEventListener("dblclick", () => editElement(el));
    el.classList.add("item");
    el.dataset.listId = elements[key].id;
    main.children[1].appendChild(el);
  }
};

showActiveElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  elements = elements.filter(value => !value.completed);
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement("div");

    deleteButton.classList.add("item__button-delete");
    deleteButton.addEventListener("click", () => deleteItem(el));
    checkbox.type = "checkbox";
    checkbox.name = "checkList";
    checkbox.checked = false;
    checkbox.classList.add("item__checkbox");
    label.classList.add("item__text");
    el.appendChild(checkbox);
    el.appendChild(label);
    el.appendChild(deleteButton);
    el.addEventListener("mouseover", () => showDeleteButton(el));
    el.addEventListener("mouseout", () => hideDeleteButton(el));
    checkbox.addEventListener("change", () => toggleItemCheckBox(el));
    label.innerText = elements[key].text;
    el.children[1].addEventListener("dblclick", () => editElement(el));
    el.classList.add("item");
    el.dataset.listId = elements[key].id;
    main.children[1].appendChild(el);
  }
};

counterActive = () => {
  let activeItems = listAll.filter(value => !value.completed);
  counter.innerText = `items left ${activeItems.length}`;
};

handleStateApp = () => {
  if (listAll.length > 0) {
    main.children[0].style.display = "block";
  } else {
    main.children[0].style.display = "none";
  }
  let completedList = listAll.filter(value => {
    return value.completed == true;
  });
  if (completedList.length === listAll.length) {
    main.children[0].checked = true;
  } else {
    main.children[0].checked = false;
  }
  if (completedList.length > 0) {
    buttonDeleteCompleted.classList.add("footer__delete-completed_view");
  } else {
    buttonDeleteCompleted.classList.remove("footer__delete-completed_view");
  }
  if (listAll.length > 0){
    footer.classList.add('footer_view');
    inputFieldToNewValue.classList.remove('header__input_primal');
  } else {
    footer.classList.remove('footer_view');
    inputFieldToNewValue.classList.add('header__input_primal');
  }
};

deleteCompleted = () => {
  listAll = listAll.filter(value => {
    return value.completed == false;
  });
  localStorage.setItem("list", JSON.stringify(listAll));
  reload();
};