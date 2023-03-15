let $addMessage = document.querySelector(".message");
let $addButton = document.querySelector(".add");
let $todo = document.querySelector(".todo");
let $delete = document.querySelector(".delete");
let $removeAll = document.querySelector(".remove_all");
let $removeFinish = document.querySelector(".remove_finish");
let $countTask = document.querySelector("#count");
let $countFinish = document.querySelector("#count-finish");

let todoList = [];

const toDay = () => {
  let today = new Date().toLocaleString();
  return today;
};

const addNewTodo = () => {
  let newTodo = {
    id: null,
    todo: $addMessage.value,
    category: null,
    checked: false,
    important: false,
    time: toDay(),
  };

  todoList.push(newTodo);

  renderMessages();

  localStorage.setItem("todo", JSON.stringify(todoList));

  $addMessage.value = "";
  disableButton($addButton);
};

$addMessage.addEventListener("input", (event) => {
  let allInputsFilled = false;

  if (!!event.target.value.trim().length) {
    allInputsFilled = true;
  }

  if (allInputsFilled) {
    enableButton($addButton);
  } else {
    disableButton($addButton);
  }
});

$addButton.addEventListener("click", () => {
  addNewTodo();
});

const renderMessages = () => {
  let message = "";
  let countTask = 0;

  if (todoList.length === 0) $todo.innerHTML = "";
  todoList.forEach((item, i) => {
    item.id = i;
    message += `
        <li class=${item.checked ? "checked" : ""}>
        <label for="item_${i}" class="checkbox ${
      item.important ? "important" : ""
    }">
        <input class="checkbox-input" type="checkbox" id="item_${i}" ${
      item.checked ? "checked" : ""
    }>
        <span class="checkbox-check"></span>
        <div class="checkbox-text">
        ${item.todo}
        </div>
      </label>
      <div class="delete" data-id="delete-${i}"></div>
      <time>${item.time}</time>
      </li>
        `;

    $todo.innerHTML = message;
  });

  countTask = todoList.length;

  let countFinish = () => {
    const arryFinish = todoList.filter((item) => {
      return item.checked === false;
    });
    return todoList.length - arryFinish.length;
  };

  $countTask.innerHTML = `${countTask}`;
  $countFinish.innerHTML = `${countFinish()}`

  if (countTask >= 3) {
    enableButton($removeAll);
  } else {
    disableButton($removeAll);
  }

  if (countFinish() >= 1) {
    enableButton($removeFinish);
  } else {
    disableButton($removeFinish);
  }
};

$todo.addEventListener("change", (event) => {
  let inputId = parseInt(event.target.getAttribute("id").match(/\d+/));

  todoList.forEach((item) => {
    if (item.id === inputId) {
      item.checked = !item.checked;
      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });

  renderMessages();
});

$todo.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  todoList.forEach((item) => {
    if (item.todo === event.target.innerHTML.trim()) {
      item.important = !item.important;
      renderMessages();
      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });
});

$todo.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-id")) {
    todoList.splice(
      parseInt(event.target.getAttribute("data-id").match(/\d+/)),
      1
    );
    renderMessages();
    localStorage.setItem("todo", JSON.stringify(todoList));
  }
});

$removeAll.addEventListener("click", () => {
  todoList.splice(0, todoList.length);
  renderMessages();
  localStorage.setItem("todo", JSON.stringify(todoList));
});

$removeFinish.addEventListener("click", () => {
  const arryFinish = todoList.filter((item) => {
    return item.checked === false;
  });

  todoList = arryFinish;
  renderMessages();
  localStorage.setItem("todo", JSON.stringify(todoList));
  disableButton($removeFinish);
});

const enableButton = (e) => {
  e.disabled = false;
};

const disableButton = (e) => {
  e.disabled = true;
};

const pressEnter = () => {
  $addMessage.addEventListener("keydown", function (e) {
    if (!!e.target.value.length) {
      if (e.keyCode === 13) {
        addNewTodo();
      }
    }
  });
};

if (localStorage.getItem("todo")) {
  todoList = JSON.parse(localStorage.getItem("todo"));
  renderMessages();
}

pressEnter();
