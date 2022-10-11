const RENDER_EVENT = "render-todo";
const listTodo = [];

document.addEventListener("DOMContentLoaded", () => {
    const inputBook = document.getElementById("inputBook");

    inputBook.addEventListener("submit", (event) => {
        event.preventDefault();
        addTodo();

        successAction("Your book has been saved");
        document.dispatchEvent(new Event(RENDER_EVENT));
    });
});

document.addEventListener(RENDER_EVENT, () => {
    const completeBooksList = document.getElementById("completeBooksList");
    const incompleteBooksList = document.getElementById("incompleteBooksList");

    completeBooksList.innerHTML = "";
    incompleteBooksList.innerHTML = "";

    for (const listItem of listTodo) {
        const todoElement = makeTodo(listItem);
        if (listItem.isComplete) {
            completeBooksList.append(todoElement);
        } else {
            incompleteBooksList.append(todoElement);
        }
    }
});

const addTodo = () => {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const id = +new Date();

    const returnTodoObject = todoObject(id, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    listTodo.push(returnTodoObject);

    console.log(listTodo);
}

const makeTodo = (listItem) => {
    const { id, title, author, year, isComplete } = listItem;

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Author: ${author}`;

    const textYear = document.createElement("p");
    textYear.innerText = `Release year: ${year}`;

    const containerAction = document.createElement("div");
    containerAction.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book-item");
    container.append(textTitle, textAuthor, textYear, containerAction);
    container.setAttribute("id", id);

    if (isComplete) {
        const btnIncompleteIcon = document.createElement("i");
        btnIncompleteIcon.classList.add("material-icons");
        btnIncompleteIcon.innerText = "keyboard_return";

        const btnIncomplete = document.createElement("button");
        btnIncomplete.classList.add("green");
        btnIncomplete.append(btnIncompleteIcon);

        btnIncomplete.addEventListener("click", () => {
            successAction("Book is moved to incomplete");
            undoTaksFromComplete(id);
        });

        containerAction.append(btnIncomplete);
    } else {
        const btnCompleteIcon = document.createElement("i");
        btnCompleteIcon.classList.add("material-icons");
        btnCompleteIcon.innerText = "check_circle";

        const btnComplete = document.createElement("button");
        btnComplete.classList.add("green");
        btnComplete.append(btnCompleteIcon);

        btnComplete.addEventListener("click", () => {
            successAction("Book is moved to complete");
            addTaksToComplete(id);
        });

        containerAction.append(btnComplete);
    }

    const btnDeleteIcon = document.createElement("i");
    btnDeleteIcon.classList.add("material-icons");
    btnDeleteIcon.innerText = "delete";

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("red");
    btnDelete.append(btnDeleteIcon);

    btnDelete.addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#28a745',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                removeTaks(id);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your book has been deleted',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1400,
                })
            }
        });
    });

    containerAction.append(btnDelete);

    return container;
}

const todoObject = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

const findTodo = (id) => {
    for (const itemTodo of listTodo) {
        if (itemTodo.id == id) {
            return itemTodo;
        }
    }
    return null;
}

const findTodoIndex = (id) => {
    for (index in listTodo) {
        if (listTodo[index].id == id) {
            return index;
        }
    }
    return -1;
}

const addTaksToComplete = (id) => {
    const todoTarget = findTodo(id);

    if (todoTarget == null) return;

    todoTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const undoTaksFromComplete = (id) => {
    const todoTarget = findTodo(id);

    if (todoTarget == null) return;

    todoTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const removeTaks = (id) => {
    const todoTarget = findTodoIndex(id);

    if (todoTarget == -1) return;

    listTodo.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const successAction = (actionMessage) => {
    Swal.fire({
        icon: 'success',
        title: actionMessage,
        showConfirmButton: false,
        timer: 1500,
      })
};
