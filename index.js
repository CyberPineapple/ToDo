const input = document.querySelector("[data-js-id=input]");
const main = document.querySelector("[data-js-id=main]");
const buttonAll = document.querySelector("[data-js-id=buttonAll]");
const buttonCompleted = document.querySelector("[data-js-id=buttonCompleted]");
const buttonActive = document.querySelector("[data-js-id=buttonActive]");
const buttonCompleteAll = document.querySelector("[data-js-id=completedAll]");

let list = [];
input.addEventListener("keypress", (event) => add(event));
window.addEventListener("DOMContentLoaded", () => load());
main.children[0].addEventListener('change', () => toggleAll());


add = () => {
  if (event.key === "Enter" && input.value !== "") {
    createNewElement();
  }
};

del = el => {
  main.children[1].removeChild(el);
  list = list.filter(value => {
    return value.id !== el.getAttribute("data-list-id");
  });
  localStorage.setItem("list", JSON.stringify(list));
};

load = () => {
  setElements();
};

createNewElement = () => {
  const el = document.createElement("li");
  const checkbox = document.createElement("input");
  const id = Date.now();
  const label = document.createElement("label");
  const deleteButton = document.createElement('div');

  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => del(el));
  checkbox.type = "checkbox";
  checkbox.classList.add("item-checkbox");
  label.classList.add("label");
  el.appendChild(checkbox);
  el.appendChild(label);
  el.appendChild(deleteButton);
  el.addEventListener('mouseover', () => viewDeleteButton(el))
  el.addEventListener('mouseout', () => hideDeleteButton(el))
  checkbox.addEventListener("change", () => toggleCheckBox(el));
  label.innerText = input.value;
  el.children[1].addEventListener("dblclick", () => editElement(el));
  el.classList.add("message");
  el.dataset.listId = id;
  main.children[1].appendChild(el);
  input.value = "";
  list.push({
    text: el.innerText,
    completed: false,
    id: el.getAttribute('data-list-id')

  });
  localStorage.setItem('list', JSON.stringify(list));
};

setElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
    const id = Date.now();
    const label = document.createElement("label");
    const deleteButton = document.createElement('div');

    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => del(el));
    checkbox.type = "checkbox";
    checkbox.classList.add("item-checkbox");
    label.classList.add("label");
    el.appendChild(checkbox);
    el.appendChild(label);
    el.appendChild(deleteButton);
    el.addEventListener('mouseover', () => viewDeleteButton(el))
    el.addEventListener('mouseout', () => hideDeleteButton(el))
    checkbox.addEventListener("change", () => toggleCheckBox(el));
    label.innerText = elements[key].text;
    el.children[1].addEventListener("dblclick", () => editElement(el));
    el.classList.add("message");
    el.dataset.listId = elements[key].id;
    main.children[1].appendChild(el);

    list.push({
      text: elements[key].text,
      id: elements[key].id,
      completed: elements[key].completed
    });
  }
};

editElement = el => {
  let text = el.children[1].innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = text;
  input.classList.add('edit')
  input.addEventListener('focusout', () => addNewValueToMessage(el, input));
  input.addEventListener('keypress', (event) =>{
    if (event.key === 'Enter'){
      input.blur();
    }
  });
  el.appendChild(input);
  input.focus();
};

addNewValueToMessage = (el, input) =>{
  if (input.value){
    el.children[1].innerText = input.value;
    el.removeChild(input);
  } else {
    el.parentNode.removeChild(el);
  }
}

toggleCheckBox = el => {
  if (el.children[0].checked) {
    el.children[1].classList.add('completed');
  } else {
    el.children[1].classList.remove('completed');
  }
};

viewDeleteButton = (el) => {
  el.children[2].classList.add('delete-button__view');
}

hideDeleteButton = (el) => {
  el.children[2].classList.remove('delete-button__view');
}

toggleAll = () => {
  let list = main.children[1];
  console.log(list);
  if (main.children[0].checked){
    for (key in list.children){
      list.children[key].children[0].checked = true;
      list.children[key].children[1].classList.add('completed');
    }
  } else {
    for (key in list.children){
      list.children[key].children[0].checked = false;
      list.children[key].children[1].classList.remove('completed');
    }
  }
}