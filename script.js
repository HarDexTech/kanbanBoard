'use strict';

// dom elements
const addTaskBtn = document.querySelector('.addTask button');
const cancelModalBtn = document.querySelector('.cancelBtn');
const taskTitle = document.querySelector('.taskTitle input');
const description = document.querySelector('.description input');
const priorityItem = document.querySelector('.priority select');
const dateInputs = document.querySelectorAll('.date input');
const dateDD = dateInputs[1];
const dateMM = dateInputs[0];
const dateYYYY = dateInputs[2];
const createTask = document.querySelector('.createTask');

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
    let dateInput = `${dateMM.value}-${dateDD.value}-${dateYYYY.value}`;
    dateInput = new Date(dateInput);
    let currentDate = new Date();
    if (taskTitle.value.trim() === '') {
        document.querySelector('.titleError').classList.remove('hidden');
        document.querySelector('.titleError').textContent = 'Title cannot be empty';
    }
    (taskTitle.value.length > 50) && document.querySelector('.titleError').classList.remove('hidden');
    (taskTitle.value.length > 50) && (document.querySelector('.titleError').textContent = 'Title cannot exceed 50 characters');
    if (
        dateInput === 'Invalid Date' ||
        dateDD.value.trim() === '' ||
        dateMM.value.trim() === '' ||
        dateYYYY.value.trim() === ''
    ) {
        document.querySelector('.dateError').classList.remove('hidden');
    }
    if (dateInput < currentDate) {
        document.querySelector('.dueDate').classList.remove('hidden');
    }
}

function showTasksFunc() {
    // function to show tasks will be implemented here
}

//event listeners
addTaskBtn.addEventListener('click', showModalFunc);
cancelModalBtn.addEventListener('click', hideModalFunc);
createTask.addEventListener('click', validateModalInputFunc);
