const inputFieldToNewValue = document.querySelector("[data-js-id=inputFieldToNewValue]");
const buttonToggleAll = document.querySelector("[data-js-id=buttonToggleAll]");
const buttonToggleShowItems = document.getElementsByName("buttonToggleShowItems");
const counter = document.querySelector("[data-js-id=counter]");
const itemList = document.querySelector("[data-js-id=itemList]");
const buttonDeleteCompleted = document.querySelector(
  '[data-js-id="deleteCompleted"]'
);
const footer = document.querySelector("[data-js-id=footer]");

let listAll = [];
for (let i = 0; i < buttonToggleShowItems.length; i++){
  buttonToggleShowItems[i].addEventListener("change", () => handleButtonToggleShowItemsOnChange());
}
inputFieldToNewValue.addEventListener("keypress", event => handleInputFieldOnPressEnter(event));
window.addEventListener("DOMContentLoaded", () => handleWindowLoad());
buttonToggleAll.addEventListener("change", () => handleButtonToggleAllOnChange());
buttonDeleteCompleted.addEventListener("click", () => handleButtonDeleteCompletedOnClick());

handleButtonToggleShowItemsOnChange = () =>{
  reload();
}

handleButtonToggleAllOnChange = () => {
  toggleAll();
}

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
  listAll = listAll.filter(value => value.id !== +el.getAttribute("data-list-id"));
  localStorage.setItem("list", JSON.stringify(listAll));
  reload();
};

editElement = ( el, label ) => {
  let text = label.innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = text;
  input.classList.add("item__edit");
  input.addEventListener("blur", () => handleEditElementOnBlur(el, input, label));
  input.addEventListener("keypress", event => handleEditElementPressEnter(event, input));
  el.appendChild(input);
  input.focus();
};

handleEditElementPressEnter = (event, input) => {
  if (event.key === "Enter") {
    input.blur();
  }
};

handleEditElementOnBlur = (el, input, label) =>{
  addNewValueToItem(el, input, label);
}

addNewValueToItem = (el, input, label) => {
  if (input.value && input.value[0] !== ' ') {
    label.innerText = input.value;
    el.removeChild(input);
    for (key in listAll) {
      if (listAll[key].id == el.getAttribute("data-list-id")) {
        listAll[key].text = label.innerText;
        localStorage.setItem("list", JSON.stringify(listAll));
      }
    }
  } else {
    deleteItem(el);
  }
};

toggleItemCheckBox = ( el, checkbox ) => {
  for (key in listAll) {
    if (listAll[key].id === +el.getAttribute("data-list-id")) {
      listAll[key].completed = checkbox.checked;
    }
  }
  localStorage.setItem("list", JSON.stringify(listAll));
  reload();
};

showDeleteButton = deleteButton => {
  deleteButton.classList.add("item__button-delete_view");
};

hideDeleteButton = deleteButton => {
  deleteButton.classList.remove("item__button-delete_view");
};

toggleAll = () => {
  if (buttonToggleAll.checked) {
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
      while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
      }
      listAll = [];
      showElements(value);
      break;
      }
    case 'completed': {
      while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
      }
      showCompletedElements();
      break;
      }
    case 'active': {
      while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
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
    deleteButton.addEventListener("click", () => handleDeleteButtonOnCLick(el));
    checkbox.type = "checkbox";
    checkbox.name = "checkList";
    checkbox.classList.add("item__checkbox");
    label.classList.add("item__text");
    el.appendChild(checkbox);
    el.appendChild(label);
    el.appendChild(deleteButton);
    el.addEventListener("mouseover", () => handleElementMouseOver(deleteButton));
    el.addEventListener("mouseout", () => handleElementMouseOut(deleteButton));
    checkbox.addEventListener("change", () => handleElementCheckboxOnChange(el, checkbox));
    checkbox.checked = elements[key].completed;
    if (checkbox.checked) {
      label.classList.add("item__text_completed");
    }
    label.innerText = elements[key].text;
    label.addEventListener("dblclick", () => handleElementOnDblClick(el,label));
    el.classList.add("item");
    el.dataset.listId = elements[key].id;
    itemList.appendChild(el);

    listAll.push({
      text: elements[key].text,
      id: elements[key].id,
      completed: elements[key].completed
    });
  }
};
handleElementCheckboxOnChange = (el, checkbox) => {
  toggleItemCheckBox(el, checkbox);
}

handleElementMouseOver = deleteButton => {
  showDeleteButton(deleteButton);
};

handleElementMouseOut = deleteButton => {
  hideDeleteButton(deleteButton);
}

showCompletedElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  elements = elements.filter(value => value.completed);
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement("div");

    deleteButton.classList.add("item__button-delete");
    deleteButton.addEventListener("click", () => handleDeleteButtonOnCLick(el));
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
    el.addEventListener("mouseover", () => handleElementMouseOver(deleteButton));
    el.addEventListener("mouseout", () => handleElementMouseOut(deleteButton));
    checkbox.addEventListener("change", () => handleElementCheckboxOnChange(el, checkbox));
    label.innerText = elements[key].text;
    label.addEventListener("dblclick", () => handleElementOnDblClick(el,label));
    el.classList.add("item");
    el.dataset.listId = elements[key].id;
    itemList.appendChild(el);
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
    deleteButton.addEventListener("click", () => handleDeleteButtonOnCLick(el));
    checkbox.type = "checkbox";
    checkbox.name = "checkList";
    checkbox.checked = false;
    checkbox.classList.add("item__checkbox");
    label.classList.add("item__text");
    el.appendChild(checkbox);
    el.appendChild(label);
    el.appendChild(deleteButton);
    el.addEventListener("mouseover", () => handleElementMouseOver(deleteButton));
    el.addEventListener("mouseout", () => handleElementMouseOut(deleteButton));
    checkbox.addEventListener("change", () => handleElementCheckboxOnChange(el, checkbox));
    label.innerText = elements[key].text;
    label.addEventListener("dblclick", () => handleElementOnDblClick(el,label));
    el.classList.add("item");
    el.dataset.listId = elements[key].id;
    itemList.appendChild(el);
  }
};


handleDeleteButtonOnCLick = el => {
  deleteItem(el);
};


handleElementOnDblClick = (el, label) => {
  editElement(el,label);
}

counterActive = () => {
  let activeItems = listAll.filter(value => !value.completed);
  counter.innerText = `items left ${activeItems.length}`;
};

handleStateApp = () => {
  if (listAll.length > 0) {
    buttonToggleAll.style.display = "block";
    footer.classList.add('footer_view');
    inputFieldToNewValue.classList.remove('header__input_primal');
  } else {
    buttonToggleAll.style.display = "none";
    footer.classList.remove('footer_view');
    inputFieldToNewValue.classList.add('header__input_primal');
  }
  let completedList = listAll.filter(value => value.completed);
  if (completedList.length === listAll.length) {
    buttonToggleAll.checked = true;
  } else {
    buttonToggleAll.checked = false;
  }
  if (completedList.length > 0) {
    buttonDeleteCompleted.classList.add("footer__delete-completed_view");
  } else {
    buttonDeleteCompleted.classList.remove("footer__delete-completed_view");
  }
};

deleteCompleted = () => {
  listAll = listAll.filter(value => !value.completed);
  localStorage.setItem("list", JSON.stringify(listAll));
  reload();
};