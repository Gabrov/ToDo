const tableHeader = ["Időpont", "Teendő", "Szerkesztés", "Törlés"];
const sortableColumns = 2;
const storageItemName = "myJSTodos";

let filter = "";
let sorting = { col: -1, direction: "" }

let addButton = document.getElementById("addButton");
let deleteAllButton = document.getElementById("deleteAllButton");
let filterField = document.getElementById("filter");
let clearFilterButton = document.getElementById("clearFilter");
let toastDiv = document.getElementById("liveToast");
let toastHeader = document.getElementById("toastHeader");
let toastBody = document.getElementById("toastBody");

let addForm = document.getElementById("addTodo");
let dateTimeField = document.getElementById("datetime");
let todoField = document.getElementById("todo");
let closeButton = document.getElementById("closeButton");
let addTodoButton = document.getElementById("addTodoButton");

let todoHeader = document.getElementById("todoHeader");
let todoBody = document.getElementById("todoBody");

const loadTodos = function() {
    const localTodo = JSON.parse(localStorage.getItem(storageItemName));
    let todos = [];

    if (localTodo !== null)
        todos = localTodo;

    return todos;
}

const saveTodos = function(todos) {
    localStorage.setItem(storageItemName, JSON.stringify(todos));
}

const deleteAllTodos = function() {
    if (confirm("Törlöd az összes feladatot?") === true) {
        localStorage.removeItem(storageItemName);
        showTodos();
    }
}

const formatDateTimeToString = function(datetime = "") {
    let localDate = "";
    if (datetime !== "") {
        localDate = new Date(datetime);
    } else {
        localDate = new Date();
    }
    let date = localDate.toLocaleDateString('hu-HU');
    let time = localDate.toLocaleTimeString('hu-HU', { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return date + " " + time;
}

const formatDateTimeToField = function(datetime = "") {
    let localDate = datetime;
    if (localDate === "") {
        localDate = formatDateTimeToString(new Date());
    }
    let returnValue = localDate.substring(0, 12).trim();
    returnValue = returnValue.replaceAll('. ', '-');
    returnValue += 'T' + localDate.substring(14, 19);

    return returnValue;
}

const setSorting = function(index) {
    if (sorting.col === -1)
        sorting.col = index;
    else if (sorting.col !== index) {
        sorting.col = index;
        sorting.direction = "";
    }

    if (sorting.direction === "")
        sorting.direction = "ASC";
    else if (sorting.direction === "ASC")
        sorting.direction = "DESC";
    else {
        sorting.col = -1;
        sorting.direction = "";
    }

    showTodoHeader();
    showTodos();
}

const sortFunction = function(a, b) {
    let returnValue = 0;
    if (a > b)
        returnValue = 1;
    else if (a < b)
        returnValue = -1;
    if (sorting.direction === "DESC")
        returnValue *= -1;

    return returnValue;
}

const showTodoHeader = function() {
    todoHeader.innerHTML = "";
    let tr = document.createElement("tr");
    tableHeader.forEach((value, index) => {
        let th = document.createElement("th");
        let sortStr = "";
        th.append(value);
        if (index < sortableColumns) {
            sortStr += ' <span id="col' + index + '" onclick="setSorting(' + index + '); return false;">(';
            if (sorting.col === -1)
                sortStr += 'X'
            else {
                if (index === sorting.col) {
                    if (sorting.direction === "ASC")
                        sortStr += '<i class="bi bi-caret-up-fill"></i>'; // felfelé mutató kitöltött háromszög
                    else if (sorting.direction === "DESC")
                        sortStr += '<i class="bi bi-caret-down-fill"></i>'; // lefelé mutató kitöltött háromszög
                } else
                    sortStr += 'X';
            }
            sortStr += ')</span>';
            th.innerHTML += sortStr;
        } else {
            th.style.textAlign = "center";
        }
        tr.appendChild(th);
    });
    todoHeader.appendChild(tr);
}

const showTodos = function() {
    todoBody.innerHTML = "";

    let todos = loadTodos();

    if (filter !== "")
        todos = todos.filter(function(currentTodo) {
            return currentTodo.datetime.indexOf(filter) > -1 ||
                   currentTodo.todo.indexOf(filter) > -1;
        });

    if (sorting.col !== -1) {
        if (sorting.col === 0) {
            todos = todos.sort(function(a, b) {
                return sortFunction(a.datetime, b.datetime);
            });
        } else if (sorting.col === 1) {
            todos = todos.sort(function(a, b) {
                return sortFunction(a.todo, b.todo);
            });
        }
    }

/*
    let todos = [
        { datetime: "2022. 05. 24. 00:20:00", todo: "első"},
        { datetime: "2022. 05. 24. 00:30:00", todo: "második"},
        { datetime: "2022. 05. 24. 00:40:00", todo: "harmadik"}
    ];
*/

    if (todos.length > 0) {
        todos.forEach((value, index) => {
            let tr = document.createElement("tr");
            for (const item in value) {
                let td = document.createElement("td");
                // így nem jó, mert nem lesznek jók a sortörések:
                // td.append(value[item].replaceAll('\n', '<br />'))
                td.innerHTML += (value[item].replaceAll('\n', '<br />'));
                tr.appendChild(td);
            }

            let pencilPic = document.createElement("i");
            pencilPic.classList = "bi bi-pencil-fill";
            pencilPic.id = index;
            pencilPic.setAttribute("data-bs-toggle", "modal");
            pencilPic.setAttribute("data-bs-target", "#modal");
            pencilPic.onclick = editTodoButtonPressed;

            let editTd = document.createElement("td");
            editTd.style.textAlign = "center";
            editTd.appendChild(pencilPic);

            let trashPic = document.createElement("i");
            trashPic.classList = "bi bi-trash-fill";
            trashPic.id = index;
            trashPic.onclick = deleteTodoButtonPressed;

            let deleteTd = document.createElement("td");
            deleteTd.style.textAlign = "center";
            deleteTd.appendChild(trashPic);

            tr.appendChild(editTd);
            tr.appendChild(deleteTd);
            todoBody.appendChild(tr);
        });
    } else {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = tableHeader.length;
        td.style.textAlign = "center";
        if (filter === "")
            td.append("Nincs semmilyen teendő!");
        else
            td.append("Nincs a szűrésnek megfelelő teendő!");

        tr.appendChild(td);
        todoBody.appendChild(tr);
    }
}

const pageLoaded = function() {
    todoBody.innerHTML = "";
    showTodoHeader();
    showTodos();
}

const addButtonPressed = function(e) {
    console.log("ehe");
    dateTimeField.value = formatDateTimeToField();
    todoField.value = "";
    addTodoButton.value = "";
    addTodoButton.textContent = "Hozzáadás";
}

const addTodoButtonPressed = function(e) {
    let datetime = document.getElementsByName("datetime")[0].value;
    let todo = document.getElementById("todo").value;

    let errorMessage = "";

    if (datetime < formatDateTimeToField(formatDateTimeToString())) {
        errorMessage = "A dátum és idő nem lehet régebbi, mint az aktuális időpont!";
    } else if (todo === "") {
        errorMessage = "Teendőt meg kell adni!";
    }

    if (errorMessage !== "") {
        let toast = new bootstrap.Toast(toastDiv);
        toastHeader.textContent = "HIBA!";
        toastBody.textContent = errorMessage;
        toast.show();
        setTimeout(function() { toast.hide(); }, 3000);
    } else {
        let localTodos = loadTodos();
        if (e.target.value === "")
            localTodos.push({ datetime: formatDateTimeToString(datetime), todo: todo });
        else {
            let id = e.target.value.split('_')[1];
            localTodos[id] = { datetime: formatDateTimeToString(datetime), todo: todo }
            e.target.value = "";
        }

        saveTodos(localTodos);

        showTodos();
    }
}

const editTodoButtonPressed = function(e) {
    let todo = loadTodos()[e.target.id];
    dateTimeField.value = formatDateTimeToField(todo.datetime);
    todoField.value = todo.todo;
    addTodoButton.textContent = "Módosítás";
    addTodoButton.value = "edit_" + e.target.id;
}

const deleteTodoButtonPressed = function(e) {
    let localTodos = loadTodos();
    if (confirm("Törlöd a(z) '" + localTodos[e.target.id].todo + "' feladatot?") === true) {
        localTodos.splice(e.target.id, 1);
        saveTodos(localTodos);
    }

    showTodos();
}

const setFilter = function(e) {
    filter = e.target.value;
    showTodos();
}

const clearFilterButtonPressed = function() {
    filter ="";
    filterField.value = "";
    showTodos();
}

addButton.onclick = addButtonPressed;
deleteAllButton.onclick = deleteAllTodos;
filterField.oninput = setFilter;
clearFilterButton.onclick = clearFilterButtonPressed;

//closeButton.onclick = addTodoClosed;
addTodoButton.onclick = addTodoButtonPressed;

//document.onload = pageLoaded; // nem fut le
window.onload = pageLoaded;
