// CONSTANTS

// 'p' or 'P' here alone stands for 'projects'
const pNameDiv = document.querySelector('#pNameDiv');
const pDetailsDiv = document.querySelector('#pDetailsDiv');
const newProjectBtn = document.querySelector('#newProjectBtn');
const inputTitle = document.querySelector('#inputTitle');
const inputDescription = document.querySelector('#inputDescription');
const inputDueDate = document.querySelector('#inputDueDate');
const pFormDiv = document.querySelector('#pFormDiv');
const newToDoBtn = document.querySelector('#newToDoBtn');
const saveBtn = document.querySelector('#save');
const cancelBtn = document.querySelector('#cancel');
const deleteProjectBtn = document.querySelector('#deleteProject');
const newToDoBtnForm = document.querySelector('#newToDoBtnForm');

//get project Array from LS
let pArray = JSON.parse(localStorage.getItem('ls.pArray')) || [];

//get project Id from LS
let pId = localStorage.getItem('ls.pId') || undefined;

// SIDEBAR: PROJECT NAME

// function > create new project object
function pCreate(title, description, duedate, priority) {
    return {
        id: Date.now().toString(),
        title: title,
        description: description,
        duedate: duedate,
        priority: priority,
        todo: [],
    };
}

// date picker
flatpickr('#inputDueDate', {
    dateFormat: 'l, F j, Y',
});

// new project btn
newProjectBtn.onclick = () => {
    pDetailsDiv.style.display = 'none';

    pFormDiv.style.display = 'block';
};

//temporary delete all function
function deleteAll() {
    localStorage.removeItem('ls.pArray');

    localStorage.removeItem('ls.pId');

    displayLS();
}
// deleteAll()

// function > pArray to LS
function pArrayToLS() {
    localStorage.setItem('ls.pArray', JSON.stringify(pArray));
}

// function > pId to LS
function pIdToLS() {
    localStorage.setItem('ls.pId', pId);
}

// Form > new todo btn
newToDoBtnForm.onclick = () => {
    let ftododiv = document.createElement('div');
    ftododiv.setAttribute('id', Date.now());
    ftododiv.setAttribute('class', 'newFormTodo');

    let ftodop = document.createElement('p');
    ftodop.textContent = document.getElementById('inputToDoForm').value;

    document.getElementById('inputToDoForm').value = null;

    ftododiv.appendChild(ftodop);

    let minus = document.createElement('i');
    minus.setAttribute('class', 'fas fa-minus-circle');
    minus.onclick = (e) => {
        e.currentTarget.parentNode.parentNode.removeChild(
            e.currentTarget.parentNode
        );
    };

    ftododiv.appendChild(minus);

    document.querySelector('#todoContainerForm').appendChild(ftododiv);
};

// form > create form todo
function createFormTodo(id, description) {
    return {
        id: id,
        description: description,
        completed: false,
    };
}

// form > save button
saveBtn.onclick = () => {
    if (inputTitle.value === null || inputTitle.value === '') {
        alert('Project must have a name :)');
    } else {
        let title = inputTitle.value;
        let description = inputDescription.value;
        let dueDate = inputDueDate.value;
        let priority = document.querySelector('select').options[
            document.querySelector('select').selectedIndex
        ].textContent;

        let pCreated = pCreate(title, description, dueDate, priority);

        let newFormTodos = document.querySelectorAll('.newFormTodo');

        if (newFormTodos.length > 0) {
            newFormTodos.forEach((x) => {
                let createdFormTodo = createFormTodo(
                    x.id,
                    x.firstChild.textContent
                );
                pCreated.todo.push(createdFormTodo);
            });
        }

        pArray = JSON.parse(localStorage.getItem('ls.pArray')) || [];
        pId = localStorage.getItem('ls.pId') || undefined;

        pArray.push(pCreated);
        pId = pCreated.id;

        pArrayToLS();
        pIdToLS();

        inputTitle.value = null;
        inputDescription.value = null;
        inputDueDate.value = null;
        document.querySelector('select').selectedIndex = 0;

        while (document.querySelector('#todoContainerForm').firstChild) {
            document
                .querySelector('#todoContainerForm')
                .removeChild(
                    document.querySelector('#todoContainerForm').firstChild
                );
        }

        document.querySelector('#inputToDoForm').value = null;

        pFormDiv.style.display = 'none';

        displayLS();
    }
};

// form > cancel btn
cancelBtn.onclick = () => {
    inputTitle.value = null;
    inputDescription.value = null;
    inputDueDate.value = null;

    pFormDiv.style.display = 'none';

    displayLS();
};

// delete selected project
deleteProjectBtn.onclick = () => {
    let result = confirm('Are you sure you want to delete this project?');

    if (result === false) {
        return;
    } else {
        pId = localStorage.getItem('ls.pId');
        pArray = JSON.parse(localStorage.getItem('ls.pArray'));

        let newpArray = pArray.filter((x) => x.id != pId);

        localStorage.setItem('ls.pArray', JSON.stringify(newpArray));

        localStorage.removeItem('ls.pId');

        displayLS();
    }
};

//function > remove children
function removeChildren(x) {
    while (x.firstChild) {
        x.removeChild(x.firstChild);
    }
}

// function > display LS
function displayLS() {
    removeChildren(pNameDiv);

    pArray = JSON.parse(localStorage.getItem('ls.pArray')) || [];

    if (pArray.length === 0) {
        pDetailsDiv.style.display = 'none';

        pFormDiv.style.display = 'block';
    } else if (pArray.length > 0) {
        pArray.forEach((x) => {
            let pdiv = document.createElement('div');
            pdiv.setAttribute('id', x.id);

            let p = document.createElement('p');
            p.textContent = x.title;

            pdiv.appendChild(p);

            // select project item on click
            pdiv.addEventListener('click', (e) => {
                inputTitle.value = null;
                inputDescription.value = null;
                inputDueDate.value = null;

                pDetailsDiv.style.display = 'block';

                pFormDiv.style.display = 'none';

                localStorage.setItem('ls.pId', e.currentTarget.id);

                displayLS();
            });

            pId = localStorage.getItem('ls.pId') || undefined;

            if (x.id === pId) {
                pdiv.classList.add('activeDiv');
            }
            pNameDiv.appendChild(pdiv);
        });

        setProjectDetailsDiv();
    } else {
        pDetailsDiv.style.display = 'none';
    }
}

// MAIN CONTENT: PROJECT DETAILS AND TODO LIST

// variables
let pSelected;
const inputToDo = document.getElementById('inputToDo');

// get selected project
function setPSelected() {
    pArray = JSON.parse(localStorage.getItem('ls.pArray')) || [];

    pId = localStorage.getItem('ls.pId') || undefined;

    if (pId != undefined && pArray.length > 0) {
        pSelected = pArray.find((x) => x.id === pId);
    }
}

//set outer todo div with title
function setProjectDetailsDiv() {
    //in todoList()

    pArray = JSON.parse(localStorage.getItem('ls.pArray')) || [];

    pId = localStorage.getItem('ls.pId') || undefined;

    if (pId === '' || pId == undefined || pArray == []) {
        pDetailsDiv.style.display = 'none';
    } else {
        pDetailsDiv.style.display = 'block';

        setPSelected();

        if (pSelected != undefined) {
            document.getElementById('pTitle').textContent = pSelected.title;

            document.querySelector('#pDescription').textContent =
                pSelected.description;

            document.querySelector('#pDueDate').textContent = pSelected.duedate;

            if (pSelected.priority !== 'Select') {
                document.querySelector('#pPriority').textContent =
                    pSelected.priority;
            }
        }
    }

    removeChildren(document.getElementById('todoContainer'));

    displayTodos();
}

// create a todo under project details
function createTodo(x) {
    return {
        id: Date.now().toString(),
        description: x,
        completed: false,
    };
}

// add todo item
newToDoBtn.addEventListener('click', () => {
    if (inputToDo.value != null || inputToDo.value != '') {
        setPSelected();

        let createdTodo = createTodo(inputToDo.value);
        pSelected.todo.push(createdTodo);

        pArray = JSON.parse(localStorage.getItem('ls.pArray'));
        pId = localStorage.getItem('ls.pId');

        for (let i = 0; i < pArray.length; i++) {
            if (pArray[i].id === pId) {
                pArray[i] = pSelected;
            }
        }

        localStorage.setItem('ls.pArray', JSON.stringify(pArray));

        inputToDo.value = null;

        displayLS();
    }
});

// delete todo [for dete todo btn in displayTodos()]
function delTodo(e) {
    pArray = JSON.parse(localStorage.getItem('ls.pArray'));
    pId = localStorage.getItem('ls.pId');

    setPSelected();

    pSelected.todo = pSelected.todo.filter(
        (x) => x.id != e.target.parentNode.id
    );

    for (let i = 0; i < pArray.length; i++) {
        if (pArray[i].id === pId) {
            pArray[i] = pSelected;
        }
    }

    localStorage.setItem('ls.pArray', JSON.stringify(pArray));

    displayLS();
}

// function done
function done(e) {
    pArray = JSON.parse(localStorage.getItem('ls.pArray'));
    pId = localStorage.getItem('ls.pId');

    setPSelected();

    for (let i = 0; i < pSelected.todo.length; i++) {
        if (pSelected.todo[i].id === e.target.parentNode.id) {
            if (pSelected.todo[i].completed === false) {
                pSelected.todo[i].completed = true;
            } else {
                pSelected.todo[i].completed = false;
            }
        }
    }

    for (let i = 0; i < pArray.length; i++) {
        if (pArray[i].id === pId) {
            pArray[i] = pSelected;
        }
    }

    localStorage.setItem('ls.pArray', JSON.stringify(pArray));

    displayLS();
}

// display todos
function displayTodos() {
    // this is in todoList()

    pArray = JSON.parse(localStorage.getItem('ls.pArray'));

    setPSelected();

    removeChildren(document.getElementById('todoContainer'));

    if (pSelected != undefined) {
        let todos = pSelected.todo;

        todos.forEach((x) => {
            let div = document.createElement('div');
            div.setAttribute('class', 'todoDiv');
            div.setAttribute('id', x.id);

            let p = document.createElement('p');
            p.textContent = x.description;

            if (x.completed === true) {
                p.style.textDecoration = 'line-through';
            }

            let minus = document.createElement('i');
            minus.setAttribute('class', 'fas fa-minus-circle');
            minus.onclick = delTodo;

            let check = document.createElement('i');
            check.setAttribute('class', 'fas fa-check-circle');
            check.classList.add('checks');
            check.onclick = done;

            div.appendChild(p);
            div.appendChild(check);
            div.appendChild(minus);

            document.getElementById('todoContainer').appendChild(div);
        });
    }
}

displayLS();
