const tableHeader = ["Időpont", "Teendő", "Szerkesztés", "Törlés"];
const sortableColumns = 2;
const storageItemName = "myJSTodos";

let filter = "";
let sorting = { col: -1, direction: "" }

let addButton = document.getElementById("addButton");
let deleteAllButton = document.getElementById("deleteAllButton");
let filterField = document.getElementById("filter");
let clearFilterButton = document.getElementById("clearFilter");

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
                        sortStr += '&#9650;'; // felfelé mutató kitöltött háromszög
                    else if (sorting.direction === "DESC")
                        sortStr += '&#9660;'; // lefelé mutató kitöltött háromszög
                } else
                    sortStr += 'X';
            }
            sortStr += ')</span>';
            th.innerHTML += sortStr;
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

            let pencilPic = document.createElement("img");
            pencilPic.src = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M421.7%20220.3L188.5%20453.4L154.6%20419.5L158.1%20416H112C103.2%20416%2096%20408.8%2096%20400V353.9L92.51%20357.4C87.78%20362.2%2084.31%20368%2082.42%20374.4L59.44%20452.6L137.6%20429.6C143.1%20427.7%20149.8%20424.2%20154.6%20419.5L188.5%20453.4C178.1%20463.8%20165.2%20471.5%20151.1%20475.6L30.77%20511C22.35%20513.5%2013.24%20511.2%207.03%20504.1C.8198%20498.8-1.502%20489.7%20.976%20481.2L36.37%20360.9C40.53%20346.8%2048.16%20333.9%2058.57%20323.5L291.7%2090.34L421.7%20220.3zM492.7%2058.75C517.7%2083.74%20517.7%20124.3%20492.7%20149.3L444.3%20197.7L314.3%2067.72L362.7%2019.32C387.7-5.678%20428.3-5.678%20453.3%2019.32L492.7%2058.75z%22%2F%3E%3C%2Fsvg%3E";
            pencilPic.width = 10;
            pencilPic.id = index;
            pencilPic.onclick = editTodoButtonPressed;

            let editTd = document.createElement("td");
            editTd.style.textAlign = "center";
            editTd.appendChild(pencilPic);

            let trashPic = document.createElement("img");
            trashPic.src = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20448%20512%22%3E%3C%21--%21%20Font%20Awesome%20Pro%206.1.1%20by%20@fontawesome%20-%20https%3A//fontawesome.com%20License%20-%20https%3A//fontawesome.com/license%20%28Commercial%20License%29%20Copyright%202022%20Fonticons%2C%20Inc.%20--%3E%3Cpath%20d%3D%22M135.2%2017.69C140.6%206.848%20151.7%200%20163.8%200H284.2C296.3%200%20307.4%206.848%20312.8%2017.69L320%2032H416C433.7%2032%20448%2046.33%20448%2064C448%2081.67%20433.7%2096%20416%2096H32C14.33%2096%200%2081.67%200%2064C0%2046.33%2014.33%2032%2032%2032H128L135.2%2017.69zM31.1%20128H416V448C416%20483.3%20387.3%20512%20352%20512H95.1C60.65%20512%2031.1%20483.3%2031.1%20448V128zM111.1%20208V432C111.1%20440.8%20119.2%20448%20127.1%20448C136.8%20448%20143.1%20440.8%20143.1%20432V208C143.1%20199.2%20136.8%20192%20127.1%20192C119.2%20192%20111.1%20199.2%20111.1%20208zM207.1%20208V432C207.1%20440.8%20215.2%20448%20223.1%20448C232.8%20448%20240%20440.8%20240%20432V208C240%20199.2%20232.8%20192%20223.1%20192C215.2%20192%20207.1%20199.2%20207.1%20208zM304%20208V432C304%20440.8%20311.2%20448%20320%20448C328.8%20448%20336%20440.8%20336%20432V208C336%20199.2%20328.8%20192%20320%20192C311.2%20192%20304%20199.2%20304%20208z%22/%3E%3C/svg%3E";
            trashPic.width = 10;
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

const showModal = function(todoId) {
    if (todoId !== undefined) {
        let todo = loadTodos()[todoId];
        dateTimeField.value = formatDateTimeToField(todo.datetime);
        todoField.value = todo.todo;
        addTodoButton.textContent = "Módosítás";
        addTodoButton.value = "edit_" + todoId;
    } else {
        dateTimeField.value = formatDateTimeToField();
        todoFieldvalue = "";
        addTodoButton.value = "";
    }

    addForm.style.display = "block";
}

const hideModal = function() {
    addForm.style.display = "none";
}

const addButtonPressed = function(e) {
    showModal();
}

const addTodoClosed = function(e) {
    hideModal();
}

const addTodoButtonPressed = function(e) {
    let datetime = document.getElementsByName("datetime")[0].value;
    let todo = document.getElementById("todo").value;

    let localTodos = loadTodos();
    if (e.target.value === "")
        localTodos.push({ datetime: formatDateTimeToString(datetime), todo: todo });
    else {
        let id = e.target.value.split('_')[1];
        localTodos[id] = { datetime: formatDateTimeToString(datetime), todo: todo }
        e.target.value = "";
    }

    saveTodos(localTodos);

    hideModal();
    showTodos();
}

const editTodoButtonPressed = function(e) {
    showModal(e.target.id);
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

closeButton.onclick = addTodoClosed;
addTodoButton.onclick = addTodoButtonPressed;

//document.onload = pageLoaded; // nem fut le
window.onload = pageLoaded;
