const input = document.querySelector("[data-js-id=input]");
const main = document.querySelector("[data-js-id=main]");
const buttonCompleteAll = document.querySelector("[data-js-id=completedAll]");
const radioButton = document.getElementsByName('button');

let listAll = [];
let listActive = [];
let listCompleted
input.addEventListener("keypress", (event) => add(event));
window.addEventListener("DOMContentLoaded", () => load());
main.children[0].addEventListener('change', () => toggleAll());
radioButton[0].addEventListener('change', () => view());
radioButton[1].addEventListener('change', () => view());
radioButton[2].addEventListener('change', () => view());




add = () => {
  if (event.key === "Enter" && input.value !== "") {
    createNewElement();
  }
};

del = el => {
  main.children[1].removeChild(el);
  console.log(listAll);
  listAll = listAll.filter(value => {
    console.log('value.id ', value.id, ' atribute', el.getAttribute("data-list-id"));
    return value.id != el.getAttribute("data-list-id");
  });
  localStorage.setItem("list", JSON.stringify(listAll));
  console.log(listAll);
};

load = () => {
  view();
};

createNewElement = () => {
  listAll.push({
    text: input.value,
    completed: false,
    id: Date.now()
  });
  input.value = "";
  localStorage.setItem('list', JSON.stringify(listAll));
  view();
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
    for (key in listAll){
      if (listAll[key].id == el.getAttribute("data-list-id")){
        listAll[key].text = el.children[1].innerText;
        localStorage.setItem('list', JSON.stringify(listAll));
      }
    }
  } else {
    del(el);
  }
}

toggleCheckBox = el => {
  console.log(listAll);
  if (el.children[0].checked) {
    for (key in listAll){
      if (listAll[key].id == el.getAttribute("data-list-id")){
        listAll[key].completed = true;
        console.log(listAll[key]);
      }
    }
  } else {
    for (key in listAll){
      if (listAll[key].id == el.getAttribute("data-list-id")){
        listAll[key].completed = false;
        console.log(listAll[key]);
      }
    }
  }
  console.log(listAll);
  localStorage.setItem('list', JSON.stringify(listAll));
  view();
};

viewDeleteButton = (el) => {
  el.children[2].classList.add('delete-button__view');
}

hideDeleteButton = (el) => {
  el.children[2].classList.remove('delete-button__view');
}

toggleAll = () => {
  let elements = main.children[1];
  console.log(listAll);
  if (main.children[0].checked){
    for (key in elements.children){
      elements.children[key].children[0].checked = true;
      elements.children[key].children[1].classList.add('completed');
      listAll[key].completed = true;
      localStorage.setItem('list', JSON.stringify(listAll));
    }
    view();
  } else {
    for (key in elements.children){
      elements.children[key].children[0].checked = false;
      elements.children[key].children[1].classList.remove('completed');
      listAll[key].completed = false;
      localStorage.setItem('list', JSON.stringify(listAll));
    }
  }
  view();
}

view = () =>{
  console.log(listAll);
  if (radioButton[0].checked){
    while (main.children[1].firstChild){
      main.children[1].removeChild(main.children[1].firstChild);
    }
    listAll = [];
    setElements();
  } else if (radioButton[1].checked){
    while (main.children[1].firstChild){
      main.children[1].removeChild(main.children[1].firstChild);
    }
    setCompletedElements();
  } else if (radioButton[2].checked){
    while (main.children[1].firstChild){
      main.children[1].removeChild(main.children[1].firstChild);
    }
    setActiveElements();
  }
}

setElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
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
    checkbox.checked = elements[key].completed;
    if (checkbox.checked){
      el.children[1].classList.add('completed');
    }
    label.innerText = elements[key].text;
    el.children[1].addEventListener("dblclick", () => editElement(el));
    el.classList.add("message");
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
  elements = elements.filter( (value) => {
    return value.completed === true}
  );
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement('div');

    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => del(el));
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.classList.add("item-checkbox");
    label.classList.add("label");
    label.classList.add('completed');
    label.classList.add("checked");
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
  }
};

setActiveElements = () => {
  let elements = JSON.parse(localStorage.getItem("list"));
  elements = elements.filter( (value) => {
    return value.completed === false}
  );
  for (key in elements) {
    const el = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement('div');

    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => del(el));
    checkbox.type = "checkbox";
    checkbox.checked = false;
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
  }
};