const tableHeader = ["Időpont", "Teendő", "Törlés"];
const storageItemName = "myJSTodos";

let addForm = document.getElementById("addTodo");
let addButton = document.getElementById("addButton");
let deleteAllButton = document.getElementById("deleteAllButton");
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

const showTodoHeader = function() {
    let tr = document.createElement("tr");
    tableHeader.forEach((value) => {
        let th = document.createElement("th");
        th.append(value);
        tr.appendChild(th);
    });
    todoHeader.appendChild(tr);
}

const showTodos = function() {
    todoBody.innerHTML = "";

    let todos = loadTodos();

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

            let trashPic = document.createElement("img");
            trashPic.src = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20448%20512%22%3E%3C%21--%21%20Font%20Awesome%20Pro%206.1.1%20by%20@fontawesome%20-%20https%3A//fontawesome.com%20License%20-%20https%3A//fontawesome.com/license%20%28Commercial%20License%29%20Copyright%202022%20Fonticons%2C%20Inc.%20--%3E%3Cpath%20d%3D%22M135.2%2017.69C140.6%206.848%20151.7%200%20163.8%200H284.2C296.3%200%20307.4%206.848%20312.8%2017.69L320%2032H416C433.7%2032%20448%2046.33%20448%2064C448%2081.67%20433.7%2096%20416%2096H32C14.33%2096%200%2081.67%200%2064C0%2046.33%2014.33%2032%2032%2032H128L135.2%2017.69zM31.1%20128H416V448C416%20483.3%20387.3%20512%20352%20512H95.1C60.65%20512%2031.1%20483.3%2031.1%20448V128zM111.1%20208V432C111.1%20440.8%20119.2%20448%20127.1%20448C136.8%20448%20143.1%20440.8%20143.1%20432V208C143.1%20199.2%20136.8%20192%20127.1%20192C119.2%20192%20111.1%20199.2%20111.1%20208zM207.1%20208V432C207.1%20440.8%20215.2%20448%20223.1%20448C232.8%20448%20240%20440.8%20240%20432V208C240%20199.2%20232.8%20192%20223.1%20192C215.2%20192%20207.1%20199.2%20207.1%20208zM304%20208V432C304%20440.8%20311.2%20448%20320%20448C328.8%20448%20336%20440.8%20336%20432V208C336%20199.2%20328.8%20192%20320%20192C311.2%20192%20304%20199.2%20304%20208z%22/%3E%3C/svg%3E";
            trashPic.width = 10;
            trashPic.id = index;
            trashPic.onclick = deleteTodoButtonPressed;

            let trashTd = document.createElement("td");
            trashTd.style.textAlign = "center";
            trashTd.appendChild(trashPic);

            tr.appendChild(trashTd);
            todoBody.appendChild(tr);
        });
    } else {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = tableHeader.length;
        td.style.textAlign = "center";
        td.append("Nincs semmilyen teendő!");
        tr.appendChild(td);
        todoBody.appendChild(tr);
    }
}

const pageLoaded = function() {
    todoBody.innerHTML = "";
    showTodoHeader();
    showTodos();
}

const showModal = function() {
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

    let fullDate = new Date(datetime);
    let date = fullDate.toLocaleDateString('hu-HU');
    let time = fullDate.toLocaleTimeString('hu-HU', { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    let localTodos = loadTodos();
    localTodos.push({ datetime: date + " " + time, todo: todo });
    saveTodos(localTodos);

    hideModal();
    showTodos();
}

const deleteTodoButtonPressed = function(e) {
    let localTodos = loadTodos();
    if (confirm("Törlöd a(z) '" + localTodos[e.target.id].todo + "' feladatot?") === true) {
        localTodos.splice(e.target.id, 1);
        saveTodos(localTodos);
    }

    showTodos();
}

addButton.onclick = addButtonPressed;
deleteAllButton.onclick = deleteAllTodos;
closeButton.onclick = addTodoClosed;
addTodoButton.onclick = addTodoButtonPressed;

//document.onload = pageLoaded; // nem fut le
window.onload = pageLoaded;
