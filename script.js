//TODO
/*Search functionality to find tasks by title*/
'use strict';
// dom elements
const addTaskBtn = document.querySelector('.addTask button');
const cancelModalBtn = document.querySelector('.cancelBtn');
const taskTitle = document.querySelector('.taskTitleInput input');
const description = document.querySelector('.description textarea');
const priorityItem = document.querySelector('.priority select');
const dateInputs = document.querySelectorAll('.date input');
const dateDD = dateInputs[1];
const dateMM = dateInputs[0];
const dateYYYY = dateInputs[2];
const createTask = document.querySelector('.createTask');
const toDoTasks = document.querySelector('.toDoTasks');
const inProgressTasks = document.querySelector('.inProgressTasks');
const doneTasks = document.querySelector('.doneTasks');
const notification = document.querySelector('.notification');
const notificationSecondary = document.querySelector('.notificationSecondary');
let dateInput;

let tasks = JSON.parse(localStorage.getItem('data')) || {
    toDo: [],
    inProgress: [],
    done: [],
}; //get tasks object from localstorage or initialize if not present

// functions
//remove hidden class to show modal
function showModalFunc() {
    document.querySelector('.addTaskModal').classList.remove('hidden');
}

//add hidden class to hide modal
function closeModalFunc() {
    document.querySelector('.addTaskModal').classList.add('hidden');
}

function validateModalInputFunc() {
    // reset error messages and dom elements
    document.querySelector('.titleError').classList.add('hidden');
    document.querySelector('.dateError').classList.add('hidden');
    document.querySelector('.dueDate').classList.add('hidden');
    dateInput = `${dateMM.value}-${dateDD.value}-${dateYYYY.value}`; //get date input in mm-dd-yyyy format
    let changeDateFormat = new Date(dateInput); //change date format to iso format to compare with current date
    let currentDate = new Date(); //get current date

    // validation checks
    if (taskTitle.value.trim() === '') {
        document.querySelector('.titleError').classList.remove('hidden');
        document.querySelector('.titleError').textContent =
            'Title cannot be empty';
        taskTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    taskTitle.value.length > 50 &&
        (document.querySelector('.titleError').classList.remove('hidden'),
        document
            .querySelector('.titleError')
            .scrollIntoView({ behavior: 'smooth', block: 'start' }));
    taskTitle.value.length > 50 &&
        ((document.querySelector('.titleError').textContent =
            'Title cannot exceed 50 characters'),
        taskTitle.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    
    if (dateInput === '--') {//if date input is empty, set dateInput to -- to display 'No due date' in the DOM
        dateInput = '--';
    } else {//if date input is not empty, validate date input
        if (changeDateFormat.toString() === 'Invalid Date') {
            document.querySelector('.dateError').classList.remove('hidden');
            document.querySelector('.dateError').textContent =
                'Please enter a valid date';
            dateMM.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
    }

    if (changeDateFormat < currentDate) {
        //return error if due date is in the past
        document.querySelector('.dueDate').classList.remove('hidden');
        return; //ends the function
    }

    // Loop through tasks.toDo and create HTML for each
    toDOArrayFunc();
    renderAllTasks(); // if all validations pass, show the task

    // reset all modal input fields
    taskTitle.value = '';
    description.value = '';
    dateDD.value = '';
    dateMM.value = '';
    dateYYYY.value = '';

    notificationFuncSecondary('New Task Created'); //show notification that new task has been created
}

//function to add task to tasks.toDo array
function toDOArrayFunc() {
    tasks.toDo.push({
        id: Date.now(), // unique ID
        title: taskTitle.value,
        description: description.value,
        priority: priorityItem.value,
        dueDate: dateInput,
        status: 'toDo',
    });
}

function renderAllTasks() {
    localStorage.setItem('data', JSON.stringify(tasks)); //save tasks object to localstorage
    notificationFunc('Tasks Updated'); //show notification that tasks have been updated

    tasks = JSON.parse(localStorage.getItem('data')) || {
        toDo: [],
        inProgress: [],
        done: [],
    }; //get tasks object from localstorage or initialize if not present
    /********************************clear all menus before re-rendering******************************/
    toDoTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    /********************************render all tasks from tasks object using loops**********************/
    //toDo loop
    tasks.toDo.forEach((task) => {
        updateHTML(
            task.title,
            task.description,
            task.priority,
            task.dueDate,
            task.id,
            'toDo'
        );
    });

    //inProgress loop
    tasks.inProgress.forEach((task) => {
        updateHTML(
            task.title,
            task.description,
            task.priority,
            task.dueDate,
            task.id,
            'inProgress'
        );
    });

    //done loop
    tasks.done.forEach((task) => {
        updateHTML(
            task.title,
            task.description,
            task.priority,
            task.dueDate,
            task.id,
            'done'
        );
    });

    //hide all menus after re-rendering in done section
    document
        .querySelectorAll('.doneTasks .task .menu')
        .forEach((hide) => hide.classList.add('hidden'));

    //hide move to done button in in progress section
    document
        .querySelectorAll('.inProgressTasks .task .taskMenu .moveToProgress')
        .forEach((btn) => btn.classList.add('hidden'));

    //add strike through to done task titles
    document
        .querySelectorAll('.doneTasks .taskTitle')
        .forEach((addStrikeElementsToDoneTitle) =>
            addStrikeElementsToDoneTitle.classList.add('strike')
        );

    closeModalFunc(); //close task modal
    numOfTasksFunc(); //update number of tasks in each section
    notificationFunc('Tasks Updated'); //show notification that tasks have been updated
}
renderAllTasks(); //render tasks on page load

function updateHTML(
    taskTitleValue,
    taskDescriptionValue,
    priorityItemValue,
    dateInputValue,
    id,
    status
) {
    let color;
    priorityItemValue === 'High Priority'
        ? (color = 'red')
        : priorityItemValue === 'Medium Priority'
          ? (color = 'orange')
          : (color = 'green');

    // Determine which column to add the task to
    let targetColumn = toDoTasks;
    if (status === 'inProgress') {
        targetColumn = inProgressTasks;
    } else if (status === 'done') {
        targetColumn = doneTasks;
    }

    //function to show tasks will be implemented here
    targetColumn.innerHTML += `
    <div class="task" id="${id}">
        <button type="button" class="menu">
            <i class="fas fa-ellipsis-h"></i>
        </button>

        <div class="taskMenu flex column hidden">
            <button class="moveToProgress btnMove" id="inProgress">Move to In Progress</button>
            <button class="moveToDone btnMove" id="done">Move to Done</button>
            <button class="deleteTask btnMove" id="delete">Delete Task<i class="fas fa-trash" style="margin-left: 5px;"></i></button>
        </div>

        <div class="taskTitle">${taskTitleValue}</div>
        <div class="taskDesc">${taskDescriptionValue}</div>
        <div class="taskFooter column">
            <div class="priority" style="color: ${color};">${priorityItemValue}</div>
            <div class="dueDate">Due: ${dateInputValue === '--' ? 'No due date' : new Date(dateInputValue).toDateString()}</div>
        </div>
    </div>
    `;

    const allMenu = document.querySelectorAll('.menu');
    /******************************************* Add event listeners to all menu buttons ****************************/
    allMenu.forEach((btn) => btn.addEventListener('click', showMenu));
    const moveButtons = document.querySelectorAll('.btnMove');
    moveButtons.forEach((btn) =>
        btn.addEventListener('click', function () {
            const taskId = parseInt(
                btn.closest('.task').getAttribute('id'),
                10
            );
            const newStatus = btn.getAttribute('id');
            moveTask(taskId, newStatus);
        })
    );
    window.onclick = function (event) {
        if (!event.target.matches('.menu i')) {
            document.querySelectorAll('.taskMenu').forEach((menu) => {
                if (!menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            });
        }
    };
}

function showMenu(e) {
    const taskElement = e.target.closest('.task');
    if (!taskElement) return;
    const taskMenu = taskElement.querySelector('.taskMenu');
    taskMenu.classList.toggle('hidden');
}

// NOTIFICATION FUNCTION
function notificationFunc(msg) {
    // Set notification text content
    notification.textContent = msg;
    // Remove the hidden class to show the notification
    notification.classList.remove('hidden');

    notification.animate(
        [
            { transform: 'translateX(100px)', opacity: 0, offset: 0 },
            { transform: 'translateX(0)', opacity: 1, offset: 0.05 }, // ease-in completes at 0.3 seconds
            { transform: 'translateX(0)', opacity: 1, offset: 0.68 }, // stays visible until 4 seconds
            { transform: 'translateX(100px)', opacity: 0, offset: 1 }, // ease-out from 4 to 6 seconds
        ],
        {
            duration: 6000,
            easing: 'ease-in',
        }
    );

    // Hide notification after animation completes
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 6000);
}

function notificationFuncSecondary(msg) {
    // Set notification text content
    notificationSecondary.textContent = msg;
    // Remove the hidden class to show the notification
    notificationSecondary.classList.remove('hidden');

    notificationSecondary.animate(
        [
            { transform: 'translateX(100px)', opacity: 0, offset: 0 },
            { transform: 'translateX(0)', opacity: 1, offset: 0.05 }, // ease-in completes at 0.3 seconds
            { transform: 'translateX(0)', opacity: 1, offset: 0.68 }, // stays visible until 4 seconds
            { transform: 'translateX(100px)', opacity: 0, offset: 1 }, // ease-out from 4 to 6 seconds
        ],
        {
            duration: 6000,
            easing: 'ease-in',
        }
    );

    // Hide notification after animation completes
    setTimeout(() => {
        notificationSecondary.classList.add('hidden');
    }, 6000);
}

function numOfTasksFunc() {
    //calculate number of tasks in each section and update the DOM
    let numOfTasks = document.querySelectorAll('.toDoTasks .task').length;
    let numOfInProgress = document.querySelectorAll(
        '.inProgressTasks .task'
    ).length;
    let numOfDone = document.querySelectorAll('.doneTasks .task').length;
    document.querySelector('.numOfTask').textContent = numOfTasks;
    document.querySelector('.numOfTask').classList.remove('hidden');
    document.querySelector('.numOfInProgressTask').textContent =
        numOfInProgress;
    document.querySelector('.numOfInProgressTask').classList.remove('hidden');
    document.querySelector('.numOfDoneTask').textContent = numOfDone;
    document.querySelector('.numOfDoneTask').classList.remove('hidden');
}

function moveTask(taskId, newStatus) {
    let taskToMove = null;

    // Try to find in toDo
    taskToMove = tasks.toDo.find((task) => task.id === taskId);
    if (taskToMove) {
        // Found it! Remove from toDo
        tasks.toDo = tasks.toDo.filter((task) => task.id !== taskId);
    }

    // Try to find in inProgress
    if (!taskToMove) {
        taskToMove = tasks.inProgress.find((task) => task.id === taskId);
        if (taskToMove) {
            // Found it! Remove from inProgress
            tasks.inProgress = tasks.inProgress.filter(
                (task) => task.id !== taskId
            );
        }
    }

    // Try to find in done
    if (!taskToMove) {
        taskToMove = tasks.done.find((task) => task.id === taskId);
        if (taskToMove) {
            // Found it! Remove from done
            tasks.done = tasks.done.filter((task) => task.id !== taskId);
        }
    }

    // If we found the task somewhere, add it to new location
    if (taskToMove) {
        if (newStatus === 'toDo') {
            tasks.toDo.push(taskToMove);
        } else if (newStatus === 'inProgress') {
            tasks.inProgress.push(taskToMove);
        } else if (newStatus === 'done') {
            tasks.done.push(taskToMove);
        }

        // Re-render everything
        renderAllTasks();
    }

    newStatus === 'delete' && notificationFuncSecondary('Deleted task'); //notification function returns 'Deleted task'
    newStatus !== 'delete' &&
        notificationFuncSecondary(`Moved task to ${newStatus}`); //notification function returns 'Moved task to newStatus' if newStatus is not delete
}

//show menu output will be implemented here
document.querySelectorAll('.menuBtn').forEach((siblingMenuBtn) =>
    siblingMenuBtn.addEventListener('click', function () {
        this.closest('.menuContainer')
            .querySelector('.groupBtnDisplay')
            .classList.toggle('hidden');
    })
);

//clear tasks in each section when clear button is clicked and re-render tasks
document.querySelectorAll('.groupBtnDisplay .clear').forEach((item) =>
    item.addEventListener('click', function () {
        // Get section name (toDo, inProgress, or done) from parent section's first class
        let currentElement = tasks[this.closest('section').classList[0]];
        if (currentElement.length === 0) {
            return notificationFuncSecondary(
                `No Tasks Found in ${this.closest('section').classList[0].toUpperCase()} Section`
            );
        } else {
            tasks[this.closest('section').classList[0]] = [];//clear tasks in the current section
            notificationFuncSecondary(
                `Cleared ${this.closest('section').classList[0]} tasks`
            ); //show notification that tasks have been cleared
            renderAllTasks();
        }
    })
);

//toggle search input when search button is clicked
document.querySelectorAll('.searchTaskBtn').forEach((x) => {
    x.addEventListener('click', function () {
        let attr = this.getAttribute("id");
        document.getElementById(`searchContainer${attr.slice(-1)}`).classList.toggle('hidden');
        document.getElementById(`groupMenu${attr.slice(-1)}`).classList.add('hidden');
    })
})

//close search input when close button is clicked
document.querySelectorAll('.closeSearchTask').forEach((x) => {
    x.addEventListener('click', function () {
        this.closest('.searchContainer').classList.add('hidden')
    })
})


//event listeners
addTaskBtn.addEventListener('click', showModalFunc);
cancelModalBtn.addEventListener('click', closeModalFunc);
createTask.addEventListener('click', validateModalInputFunc); //validate inputs, create task and render tasks
