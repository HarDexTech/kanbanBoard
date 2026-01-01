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

dateYYYY.value = new Date().getFullYear();

// functions
function showModalFunc() {
    document.querySelector('.addTaskModal').classList.remove('hidden');
}

function hideModalFunc() {
    document.querySelector('.addTaskModal').classList.add('hidden');
}

function validateModalInputFunc() {
    let dateInput = `${dateMM.value}-${dateDD.value}-${dateYYYY.value}`;
    dateInput = new Date(dateInput);
    let currentDate = new Date();
    if (taskTitle.value.trim() === '') {
        document.querySelector('.titleError').classList.remove('hidden');
        console.error(1);
    }
    if (
        dateInput < currentDate ||
        dateInput === 'Invalid Date' ||
        dateDD.value.trim() === '' ||
        dateMM.value.trim() === '' ||
        dateYYYY.value.trim() === ''
    ) {
        document.querySelector('.dateError').classList.remove('hidden');
        console.error(2);
    }
    return;
}

//event listeners
addTaskBtn.addEventListener('click', showModalFunc);
cancelModalBtn.addEventListener('click', hideModalFunc);
createTask.addEventListener('click', validateModalInputFunc);
