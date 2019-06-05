const input = document.querySelector("[data-js-id=input]");
const main = document.querySelector("[data-js-id=main]");
const buttonCompleteAll = document.querySelector("[data-js-id=completedAll]");
const radioButton = document.getElementsByName("button");
const counter = document.querySelector("[data-js-id=counter]");
const buttonDeleteCompleted = document.querySelector(
  '[data-js-id="deleteCompleted"]'
);

let listAll = [];

input.addEventListener("keypress", event => addItem(event));
window.addEventListener("DOMContentLoaded", () => view());
main.children[0].addEventListener("change", () => toggleAll());
radioButton[0].addEventListener("change", () => view());
radioButton[1].addEventListener("change", () => view());
radioButton[2].addEventListener("change", () => view());
buttonDeleteCompleted.addEventListener("click", () => deleteCompleted());

addItem = () => {
  if (event.key === "Enter" && input.value !== "") {
    listAll.push({
      text: input.value,
      completed: false,
      id: Date.now()
    });
    input.value = "";
    localStorage.setItem("list", JSON.stringify(listAll));
    view();
  }
};

deleteItem = el => {
  listAll = listAll.filter(value => {
    return value.id != el.getAttribute("data-list-id");
  });
  localStorage.setItem("list", JSON.stringify(listAll));
  view();
};

editElement = el => {
  let text = el.children[1].innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = text;
  input.classList.add("item__edit");
  input.addEventListener("focusout", () => addNewValueToMessage(el, input));
  input.addEventListener("keypress", event => {
    if (event.key === "Enter") {
      input.blur();
    }
  });
  el.appendChild(input);
  input.focus();
};

addNewValueToMessage = (el, input) => {
  if (input.value) {
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
  if (el.children[0].checked) {
    for (key in listAll) {
      if (listAll[key].id == el.getAttribute("data-list-id")) {
        listAll[key].completed = true;
      }
    }
  } else {
    for (key in listAll) {
      if (listAll[key].id == el.getAttribute("data-list-id")) {
        listAll[key].completed = false;
      }
    }
  }
  localStorage.setItem("list", JSON.stringify(listAll));
  view();
};

viewDeleteButton = el => {
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
  view();
};

view = () => {
  console.log(listAll);
  if (radioButton[0].checked) {
    while (main.children[1].firstChild) {
      main.children[1].removeChild(main.children[1].firstChild);
    }
    listAll = [];
    setElements();
  } else if (radioButton[1].checked) {
    while (main.children[1].firstChild) {
      main.children[1].removeChild(main.children[1].firstChild);
    }
    setCompletedElements();
  } else if (radioButton[2].checked) {
    while (main.children[1].firstChild) {
      main.children[1].removeChild(main.children[1].firstChild);
    }
    setActiveElements();
  }
  handleCompleted();
  counterActive();
};

setElements = () => {
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
    el.addEventListener("mouseover", () => viewDeleteButton(el));
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

setCompletedElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  elements = elements.filter(value => {
    return value.completed === true;
  });
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
    el.addEventListener("mouseover", () => viewDeleteButton(el));
    el.addEventListener("mouseout", () => hideDeleteButton(el));
    checkbox.addEventListener("change", () => toggleItemCheckBox(el));
    label.innerText = elements[key].text;
    el.children[1].addEventListener("dblclick", () => editElement(el));
    el.classList.add("item");
    el.dataset.listId = elements[key].id;
    main.children[1].appendChild(el);
  }
};

setActiveElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  elements = elements.filter(value => {
    return value.completed === false;
  });
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
    el.addEventListener("mouseover", () => viewDeleteButton(el));
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
  let activeItems = listAll.filter(value => {
    return value.completed !== true;
  });
  counter.innerText = `items left ${activeItems.length}`;
};

handleCompleted = () => {
  if (main.children[1].firstChild) {
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
};

deleteCompleted = () => {
  listAll = listAll.filter( value => {
    return value.completed == false;
  })
  localStorage.setItem('list', JSON.stringify(listAll));
  view();
};
