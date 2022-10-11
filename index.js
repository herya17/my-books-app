const RENDER_EVENT = "render-todo";
const CHECK_STORAGE = "check-storage";
const KEY_STORAGE = "mybooks-storage";
const listTodo = [];

document.addEventListener("DOMContentLoaded", () => {
    const btnInputBook = document.getElementById("inputBook");
    // const btnSearchBook = document.getElementById("searchBook");
    const searchBookInput = document.getElementById("searchBookInput");

    btnInputBook.addEventListener("submit", (event) => {
        event.preventDefault();
        addTodo();
        successAction("Your book has been saved");
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    // btnSearchBook.addEventListener("submit", (event) => {
    //     event.preventDefault();
    //     searchBook();
    // });

    searchBookInput.addEventListener("input", () => {
        searchBook();
    });

    document.dispatchEvent(new Event(CHECK_STORAGE));

    getDataFromStorage();
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

document.addEventListener(CHECK_STORAGE, () => {
    if (!isStorageExist) {
        Swal.fire({
            text: "Your browser is not support web storage",
            icon: "warning",
            showConfirmButton: true,
            confirmButtonColor: '#3085d6',
        });
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

    saveDataToStorage();
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
            undoTaksFromComplete(id);
            successAction("Book is moved to incomplete");
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
            addTaksToComplete(id);
            successAction("Book is moved to complete");
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
    saveDataToStorage();
}

const undoTaksFromComplete = (id) => {
    const todoTarget = findTodo(id);

    if (todoTarget == null) return;

    todoTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

const removeTaks = (id) => {
    const todoTarget = findTodoIndex(id);

    if (todoTarget == -1) return;

    listTodo.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

const isStorageExist = () => {
    if (typeof Storage !== undefined) {
        return true;
    } else {
        return false;
    }
}

const getDataFromStorage = () => {
    if (isStorageExist) {
        const dataString = localStorage.getItem(KEY_STORAGE);
        const dataObject = JSON.parse(dataString);

        if (dataObject !== null) {
            for (const data of dataObject) {
                listTodo.push(data);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

const saveDataToStorage = () => {
    if (isStorageExist) {
        const dataString = JSON.stringify(listTodo);
        localStorage.setItem(KEY_STORAGE, dataString);
    }
}

const successAction = (actionMessage) => {
    Swal.fire({
        icon: 'success',
        title: actionMessage,
        showConfirmButton: false,
        timer: 1500,
    });
}

const searchBook = () => {
    const searchBookInput = document.getElementById("searchBookInput").value;
    const bookList = document.querySelectorAll("h3");

    if (searchBookInput.length == 0) {
        document.dispatchEvent(new Event(RENDER_EVENT));
        return;
    }

    for (let book of bookList) {
        const title = book.textContent.toLowerCase();
        console.log(title);

        if (title.includes(searchBookInput.toLowerCase())) {
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
}
