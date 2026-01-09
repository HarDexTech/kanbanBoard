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
let dateInput;

// functions
function showModalFunc() {
    document.querySelector('.addTaskModal').classList.remove('hidden');
}

function hideModalFunc() {
    document.querySelector('.addTaskModal').classList.add('hidden');
}

function validateModalInputFunc() {
    document.querySelector('.titleError').classList.add('hidden');
    document.querySelector('.dateError').classList.add('hidden');
    document.querySelector('.dueDate').classList.add('hidden');
    dateInput = `${dateMM.value}-${dateDD.value}-${dateYYYY.value}`;
    let changeDateFormat = new Date(dateInput);
    let currentDate = new Date();
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
        return;
    }
    if (changeDateFormat < currentDate) {
        document.querySelector('.dueDate').classList.remove('hidden');
        return;
    }
    showTasksFunc();
    taskTitle.value = '';
    description.value = '';
    dateDD.value = '';
    dateMM.value = '';
    dateYYYY.value = '';
}

function showTasksFunc() {
    let color;
    priorityItem.value === 'High Priority'
        ? (color = 'red')
        : priorityItem.value === 'Medium Priority'
        ? (color = 'orange')
        : (color = 'green');

    // function to show tasks will be implemented here
    toDoTasks.innerHTML += `
    <div class="task">
        <button type="button" class="menu">
            <i class="fas fa-ellipsis-h"></i>
        </button>
        <div class="taskTitle">${taskTitle.value}</div>
        <div class="taskDesc">${description.value}</div>
        <div class="taskFooter column">
            <div class="priority" style="color: ${color};">${priorityItem.value}</div>
            <div class="dueDate">Due: ${dateInput}</div>
        </div>
    <div>
    `;
    hideModalFunc();
    numOfTasksFunc();
}

function numOfTasksFunc() {
    let numOfTasks = document.querySelectorAll('.toDoTasks .task').length;
    document.querySelector('.numOfTask').textContent = numOfTasks;
    document.querySelector('.numOfTask').classList.remove('hidden');
}

//event listeners
addTaskBtn.addEventListener('click', showModalFunc);
cancelModalBtn.addEventListener('click', hideModalFunc);
createTask.addEventListener('click', validateModalInputFunc);
