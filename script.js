/*********** TODO ******************
Implement localstorage to save tasks on page reloads
Add edit and delete functionality to tasks
Search functionality to find tasks by title
************************************/

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
let dateInput;
const tasks = {
    toDo: [],
    inProgress: [],
    done: [],
};

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
    dateInput = `${dateMM.value}-${dateDD.value}-${dateYYYY.value}`;//get date input in mm-dd-yyyy format
    let changeDateFormat = new Date(dateInput);//change date format to compare
    let currentDate = new Date();//get current date

    // validation checks
    if (taskTitle.value.trim() === '') {
        document.querySelector('.titleError').classList.remove('hidden');
        document.querySelector('.titleError').textContent =
            'Title cannot be empty';
        return;
    }
    taskTitle.value.length > 50 &&
        document.querySelector('.titleError').classList.remove('hidden');
    taskTitle.value.length > 50 &&
        (document.querySelector('.titleError').textContent =
            'Title cannot exceed 50 characters');
    if (
        changeDateFormat === 'Invalid Date' ||
        dateDD.value.trim() === '' ||
        dateMM.value.trim() === '' ||
        dateYYYY.value.trim() === ''
    ) {
        document.querySelector('.dateError').classList.remove('hidden');
        return;//ends the function
    }
    if (changeDateFormat < currentDate) {
        //return error if due date is in the past
        document.querySelector('.dueDate').classList.remove('hidden');
        return;//ends the function
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
    // Clear all columns, then re-add tasks
    toDoTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    // Loop through tasks.toDo, tasks.inProgress, and tasks.done and create HTML for each
    //todo's loop
    for (let i = 0; i < tasks.toDo.length; i++) {
        updateHTML(
            tasks.toDo[i].title,
            tasks.toDo[i].description,
            tasks.toDo[i].priority,
            tasks.toDo[i].dueDate,
            tasks.toDo[i].id,
            'toDo'
        );
    }

    //inProgress loop
    for (let i = 0; i < tasks.inProgress.length; i++) {
        updateHTML(
            tasks.inProgress[i].title,
            tasks.inProgress[i].description,
            tasks.inProgress[i].priority,
            tasks.inProgress[i].dueDate,
            tasks.inProgress[i].id,
            'inProgress'
        );
    }

    //done loop
    for (let i = 0; i < tasks.done.length; i++) {
        updateHTML(
            tasks.done[i].title,
            tasks.done[i].description,
            tasks.done[i].priority,
            tasks.done[i].dueDate,
            tasks.done[i].id,
            'done'
        );
    }

    closeModalFunc(); //close task modal
    numOfTasksFunc();//update number of tasks
}

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
        </div>

        <div class="taskTitle">${taskTitleValue}</div>
        <div class="taskDesc">${taskDescriptionValue}</div>
        <div class="taskFooter column">
            <div class="priority" style="color: ${color};">${priorityItemValue}</div>
            <div class="dueDate">Due: ${new Date(dateInputValue).toLocaleDateString()}</div>
        </div>
    </div>
    `;
    const allMenu = document.querySelectorAll('.menu');
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
}

function showMenu(e) {
    const taskElement = e.target.closest('.task');
    if (!taskElement) return;
    const taskMenu = taskElement.querySelector('.taskMenu');
    taskMenu.classList.toggle('hidden');
}

function numOfTasksFunc() {
    let numOfTasks = document.querySelectorAll('.toDoTasks .task').length;
    let numOfInProgress = document.querySelectorAll('.inProgressTasks .task').length;
    let numOfDone = document.querySelectorAll('.doneTasks .task').length;
    document.querySelector('.numOfTask').textContent = numOfTasks;
    document.querySelector('.numOfTask').classList.remove('hidden');
    document.querySelector('.numOfInProgressTask').textContent = numOfInProgress;
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
}

//event listeners
addTaskBtn.addEventListener('click', showModalFunc);
cancelModalBtn.addEventListener('click', closeModalFunc);
createTask.addEventListener('click', validateModalInputFunc);//validate inputs, create task and render tasks
