//TODO
//Refactor

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
const greetUser = document.querySelector('.greetUser');
const userNameInput = document.querySelector('#nameInput');
const submitNameBtn = document.querySelector('#submitName');
const closeGreetBtn = document.querySelector('.greetContainer .close');
const showGreetingMsg = document.querySelector('.showGreeting');
const importExportContainer = document.querySelector('.importExportContainer');
const importExportMenu = document.querySelector('.importExportMenu');
const importBtn = document.querySelector('.importBtn');
const exportBtn = document.querySelector('.exportBtn');
let dateInput;
let column;
let taskIndex;

//show or hide import and export container when menu is clicked
importExportMenu.addEventListener('click', function () {
    importExportContainer.classList.toggle('hidden');
});

//get tasks object from localstorage or initialize if not present
let tasks = JSON.parse(localStorage.getItem('data')) || {
    toDo: [],
    inProgress: [],
    done: [],
};

//function to get current hour and show greeting message based on time of day and userName
function getAndShowUserName(name) {
    name = !!name ? name : 'User'; //if name is falsy, set name to 'User' to prevent showing 'Good Morning/Afternoon/Evening, !' in the DOM
    //Get the current hour in 24-hour format
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 12) {
        showGreetingMsg.textContent = `Good Morning, ${name.toUpperCase()}!`;
    } else if (hour >= 12 && hour < 17) {
        showGreetingMsg.textContent = `Good Afternoon, ${name.toUpperCase()}!`;
    } else {
        showGreetingMsg.textContent = `Good Evening, ${name.toUpperCase()}!`;
    }

    showGreetingMsg.classList.remove('hidden');
}

//check if userName is stored in localstorage, if not show greetUser modal, if yes show greeting message with userName
if (!localStorage.getItem('userName')) {
    greetUser.classList.remove('hidden');
} else {
    getAndShowUserName(localStorage.getItem('userName'));
}
//event listener to close greet modal when close button is clicked
closeGreetBtn.addEventListener('click', function () {
    greetUser.classList.add('hidden');
});
//event listener to submit name input, save to localstorage and show greeting message
submitNameBtn.addEventListener('click', function () {
    if (userNameInput.value.length > 20) {
        notificationFuncSecondary('Name Input is Too Long');
        return;
    }

    localStorage.setItem('userName', userNameInput.value);
    getAndShowUserName(localStorage.getItem('userName'));
    greetUser.classList.add('hidden');
});
//listen for enter key to submit greet modal form
userNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitNameBtn.click();
    }
});

//remove hidden class to show task modal
function showModalFunc() {
    document.querySelector('.addTaskModal').classList.remove('hidden');

    document.querySelector('.modalHead h2').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

//add hidden class to hide modal
function closeModalFunc() {
    document.querySelector('.addTaskModal').classList.add('hidden');
    document.querySelector('.createTask').classList.add('hidden');
    document.querySelector('.editTaskBtn').classList.add('hidden');

    // reset all modal input fields
    taskTitle.value = '';
    description.value = '';
    dateDD.value = '';
    dateMM.value = '';
    dateYYYY.value = '';
}

//----------------------------validate input------------------------------//
function validateModalInputFunc() {
    // reset error messages and dom elements
    document.querySelector('.titleError').classList.add('hidden');
    document.querySelector('.dateError').classList.add('hidden');
    document.querySelector('.pastDueDate').classList.add('hidden');

    //----------------------------get date and variables------------------------------//
    dateInput = `${dateMM.value}-${dateDD.value}-${dateYYYY.value}`; //get date input in mm-dd-yyyy format
    let changeDateFormat = new Date(dateInput); //change date format to iso format to compare with current date
    let currentDate = new Date(); //get current date
    let isValid = true; //boolean variable to track if input is valid or not

    //----------------------------validation check------------------------------//
    // check if title is empty
    if (taskTitle.value.trim() === '') {
        document.querySelector('.titleError').classList.remove('hidden');
        document.querySelector('.titleError').textContent = 'Title cannot be empty';
        taskTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        isValid = false;
        return isValid;
    }
    //check for long titles
    if (taskTitle.value.length > 50) {
        document.querySelector('.titleError').classList.remove('hidden');
        document.querySelector('.titleError').textContent = 'Title cannot exceed 50 characters';
        taskTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        isValid = false;
        return isValid;
    }
    //check for empty dates and validate date if date is entered
    if (dateInput === '--') {
        //if date input is empty, set dateInput to -- to display 'No due date' in the DOM
        dateInput = '--';
    } else {
        //if date input is not empty, validate date input
        if (changeDateFormat.toString() === 'Invalid Date') {
            document.querySelector('.dateError').classList.remove('hidden');
            document.querySelector('.dateError').textContent = 'Please enter a valid date';
            dateMM.scrollIntoView({ behavior: 'smooth', block: 'start' });
            isValid = false;
            return isValid;
        }
    }
    //check for if date is in the past
    if (changeDateFormat.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
        //return error if due date is in the past
        document.querySelector('.pastDueDate').classList.remove('hidden');
        dateMM.scrollIntoView({ behavior: 'smooth', block: 'start' });
        isValid = false;
        return isValid; //ends the function
    }
    return isValid; //if all validations pass, return true
}

//function to validate modal input, create task and render tasks
function validateAndRenderTaskFunc() {
    if (validateModalInputFunc()) {
        // Loop through tasks.toDo and create HTML for each
        toDOArrayFunc();
        renderAllTasks(); // if all validations pass, show the task
        notificationFuncSecondary('New Task Created'); //show notification that new task has been created
    }
}

//function to add task to tasks object
function toDOArrayFunc() {
    tasks.toDo.push({
        id: crypto.randomUUID(), // unique ID
        title: taskTitle.value,
        description: description.value,
        priority: priorityItem.value,
        dueDate: dateInput,
        status: 'toDo',
    });
}

//function to render all tasks from tasks object to the DOM
function renderAllTasks() {
    localStorage.setItem('data', JSON.stringify(tasks)); //save tasks object to localstorage
    notificationFunc('Tasks Updated'); //show notification that tasks have been updated

    //----------------------------get tasks object from localstorage or initialize if not present------------------------------//
    tasks = JSON.parse(localStorage.getItem('data')) || {
        toDo: [],
        inProgress: [],
        done: [],
    };
    /********************************clear all menus before re-rendering******************************/
    toDoTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    /********************************render all tasks from tasks object using loops**********************/
    tasks.toDo.forEach((task) => {
        updateHTML(task.title, task.description, task.priority, task.dueDate, task.id, 'toDo');
    });
    tasks.inProgress.forEach((task) => {
        updateHTML(task.title, task.description, task.priority, task.dueDate, task.id, 'inProgress');
    });
    tasks.done.forEach((task) => {
        updateHTML(task.title, task.description, task.priority, task.dueDate, task.id, 'done');
    });

    //----------------------------hide all move buttons in done sections------------------------------//
    document.querySelectorAll('.doneTasks .task .taskMenu .moveToProgress').forEach((hide) => hide.classList.add('hidden'));
    document.querySelectorAll('.doneTasks .task .taskMenu .moveToDone').forEach((hide) => hide.classList.add('hidden'));

    //hide move to inProgress button in in progress section
    document.querySelectorAll('.inProgressTasks .task .taskMenu .moveToProgress').forEach((btn) => btn.classList.add('hidden'));

    //add strike through to task titles in done section
    document.querySelectorAll('.doneTasks .taskTitle').forEach((addStrikeElementsToDoneTitle) => addStrikeElementsToDoneTitle.classList.add('strike'));

    //hide all menus after search is performed
    document.querySelectorAll('.groupBtnDisplay').forEach((x) => x.classList.add('hidden'));

    closeModalFunc(); //close task modal
    numOfTasksFunc(); //update number of tasks in each section
    notificationFunc('Tasks Updated'); //show notification that tasks have been updated

    //-----------------------------Edit Functionality------------------//
    document.querySelectorAll('.editTask').forEach((item) => {
        item.addEventListener('click', function () {
            //-----------------show edit button------------------------//
            document.querySelector('.createTask').classList.add('hidden');
            document.querySelector('.editTaskBtn').classList.remove('hidden');

            showModalFunc(); //show modal

            //---------------------get task, column, index------------------------------//
            let currentTaskId = this.closest('.task').getAttribute('id');
            column = this.closest('section').classList[0];

            //get task object and display to edit modal
            let taskObject = tasks[column].find((x) => Number(x.id) === Number(currentTaskId));

            taskIndex = tasks[column].indexOf(taskObject);

            //----------------------------get task variables------------------------------//
            let dateInputs = document.querySelectorAll('.date input');
            let date = new Date(taskObject.dueDate).toLocaleDateString().split('/');
            let dateDD = dateInputs[1];
            let dateMM = dateInputs[0];
            let dateYYYY = dateInputs[2];

            //----------------------------input task input to the modal------------------------------//
            document.querySelector('.taskTitleInput input').value = taskObject.title;
            document.querySelector('.description textarea').value = taskObject.description;
            document.querySelector('.priority select').value = taskObject.priority;
            dateDD.value = date[1];
            dateMM.value = date[0];
            dateYYYY.value = date[2];

            //----------------------------event listener for edit button------------------------------//
            document.querySelector('.editTaskBtn').addEventListener('click', function () {
                if (validateModalInputFunc()) {
                    let currentTaskObject = tasks[column][taskIndex];
                    currentTaskObject.title = document.querySelector('.taskTitleInput input').value;
                    currentTaskObject.description = document.querySelector('.description textarea').value;
                    currentTaskObject.priority = document.querySelector('.priority select').value;
                    currentTaskObject.dueDate = `${document.getElementById('mm').value}-${document.getElementById('dd').value}-${document.getElementById('yyyy').value}`;
                    renderAllTasks();
                }
            });
        });
    });

    (arr) => {
        // Check for duplicate IDs across all sections
        arr = [...tasks.toDo.map((x) => x.id), ...tasks.inProgress.map((x) => x.id), ...tasks.done.map((x) => x.id)];
        new Set(arr).size === arr.length;
        notificationFuncSecondary('Duplicate IDs found in tasks'); // Show notification if duplicate IDs are found
    };

    // if(currentDate.setItem(0,0,0,0) === changeDateFormat.setHours(0, 0, 0, 0)){
    //     notificationFuncSecondary('You have tasks due today'); // Show notification if there are tasks due today
    // }
}
renderAllTasks(); //render tasks on page load

//function to create task HTML and add it to the DOM
function updateHTML(taskTitleValue, taskDescriptionValue, priorityItemValue, dateInputValue, id, status) {
    let color;
    priorityItemValue === 'High Priority' ? (color = 'red') : priorityItemValue === 'Medium Priority' ? (color = 'orange') : (color = 'green');

    // Determine which column to add the task to
    let targetColumn = toDoTasks;
    if (status === 'inProgress') {
        targetColumn = inProgressTasks;
    } else if (status === 'done') {
        targetColumn = doneTasks;
    }

    //if date input is empty, display 'No due date' in the DOM, if not empty, display date in a readable format
    dateInputValue === '--' ? 'No due date' : new Date(dateInputValue).toDateString(); 

    //----------------------------get tasks due that current day------------------------------//
    if (new Date(dateInputValue).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
        notificationFuncSecondary('You have tasks due today'); // Show notification if there are tasks due today
        dateInputValue = 'Today';
    }
    if (new Date(dateInputValue).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        notificationFuncSecondary('You have overdue tasks'); // Show notification if there are tasks due today
        dateInputValue = 'Overdue';
    }

    //function to show tasks will be implemented here
    //TODO: Refactor this function to use createElement and appendChild instead of innerHTML for better performance and security
    targetColumn.innerHTML += `
    <div class="task" id="${id}">
        <button type="button" class="menu">
            <i class="fas fa-ellipsis-h"></i>
        </button>

        <div class="taskMenu flex column hidden">
            <button class="editTask" id="edit">Edit Task <i class="fa-solid fa-pen-to-square" style="margin-left: 5px;"></i></button>
            <button class="moveToProgress btnMove" id="inProgress">Move to In Progress</button>
            <button class="moveToDone btnMove" id="done">Move to Done</button>
            <button class="deleteTask btnMove" id="delete">Delete Task<i class="fas fa-trash" style="margin-left: 5px;"></i></button>
        </div>

        <div class="taskTitle">${taskTitleValue}</div>
        <div class="taskDesc">${taskDescriptionValue}</div>
        <div class="taskFooter column">
            <div class="priority" style="color: ${color};">${priorityItemValue}</div>
            <div class="dueDate ${dateInputValue === 'Today' || dateInputValue === 'Overdue' ? 'red' : ''}">Due: ${dateInputValue}</div>
        </div>
    </div>
    `;

    const allMenu = document.querySelectorAll('.menu');
    /******************************************* Add event listeners to all menu buttons ****************************/
    allMenu.forEach((btn) => btn.addEventListener('click', showMenu));
    const moveButtons = document.querySelectorAll('.btnMove');
    moveButtons.forEach((btn) =>
        btn.addEventListener('click', function () {
            const taskId = parseInt(btn.closest('.task').getAttribute('id'), 10);
            const newStatus = btn.getAttribute('id');
            moveTask(taskId, newStatus);
        })
    );
    //event listener to close menu when clicking outside of menu
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

//function to show menu when menu button is clicked
function showMenu(e) {
    const taskElement = e.target.closest('.task');
    if (!taskElement) return;
    const taskMenu = taskElement.querySelector('.taskMenu');
    taskMenu.classList.toggle('hidden');
}

// NOTIFICATION FUNCTION
//primary notification function
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
// SECONDARY NOTIFICATION FUNCTION
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

//function to calculate number of tasks in each section and update the DOM
function numOfTasksFunc() {
    //calculate number of tasks in each section and update the DOM
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

//function to move task from one section to another or delete task
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
            tasks.inProgress = tasks.inProgress.filter((task) => task.id !== taskId);
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
    newStatus !== 'delete' && notificationFuncSecondary(`Moved task to ${newStatus}`); //notification function returns 'Moved task to newStatus' if newStatus is not delete
}

function searchFunction() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    if (input.trim() === '') return notificationFuncSecondary('Please enter a search term');

    const [foundTaskInToDo, foundTaskInProgress, foundTaskInDone] = [tasks.toDo.filter((task) => task.title.toLowerCase().includes(input)), tasks.inProgress.filter((task) => task.title.toLowerCase().includes(input)), tasks.done.filter((task) => task.title.toLowerCase().includes(input))];

    let filteredTasks = { toDo: [], inProgress: [], done: [] };
    if (foundTaskInToDo.length > 0) {
        filteredTasks.toDo.push(...foundTaskInToDo);
    }
    if (foundTaskInProgress.length > 0) {
        filteredTasks.inProgress.push(...foundTaskInProgress);
    }
    if (foundTaskInDone.length > 0) {
        filteredTasks.done.push(...foundTaskInDone);
    }
    if (!foundTaskInDone && !foundTaskInProgress && !foundTaskInToDo) return notificationFuncSecondary('No task found');

    /********************************clear all menus before re-rendering******************************/
    toDoTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    /********************************render all tasks from tasks object using loops**********************/
    //toDo loop
    filteredTasks.toDo.forEach((task) => {
        updateHTML(task.title, task.description, task.priority, task.dueDate, task.id, 'toDo');
    });

    //inProgress loop
    filteredTasks.inProgress.forEach((task) => {
        updateHTML(task.title, task.description, task.priority, task.dueDate, task.id, 'inProgress');
    });

    //done loop
    filteredTasks.done.forEach((task) => {
        updateHTML(task.title, task.description, task.priority, task.dueDate, task.id, 'done');
    });

    //hide all menus after re-rendering in done section
    document.querySelectorAll('.doneTasks .task .menu').forEach((hide) => hide.classList.add('hidden'));

    //hide move to done button in in progress section
    document.querySelectorAll('.inProgressTasks .task .taskMenu .moveToProgress').forEach((btn) => btn.classList.add('hidden'));

    //add strike through to done task titles
    document.querySelectorAll('.doneTasks .taskTitle').forEach((addStrikeElementsToDoneTitle) => addStrikeElementsToDoneTitle.classList.add('strike'));

    closeModalFunc(); //close task modal
    numOfTasksFunc(); //update number of tasks in each section
    notificationFunc('Tasks Updated'); //show notification that tasks have been updated
}

//---------------------------------------EVENT LISTENERS-----------------------------//
//show menu output will be implemented here
document.querySelectorAll('.menuBtn').forEach((siblingMenuBtn) =>
    siblingMenuBtn.addEventListener('click', function () {
        this.closest('.menuContainer').querySelector('.groupBtnDisplay').classList.toggle('hidden');
    })
);

//clear tasks in each section when clear button is clicked and re-render tasks
document.querySelectorAll('.groupBtnDisplay .clear').forEach((item) =>
    item.addEventListener('click', function () {
        // Get section name (toDo, inProgress, or done) from parent section's first class
        let currentElement = tasks[this.closest('section').classList[0]];
        if (currentElement.length === 0) {
            notificationFuncSecondary(`No Tasks Found in ${this.closest('section').classList[0].toUpperCase()} Section`);
            //hide all groupBtnDisplay menus after clicking clear button if there are no tasks in the current section to clear
            return this.closest('.groupBtnDisplay').classList.add('hidden');
        } else {
            tasks[this.closest('section').classList[0]] = []; //clear tasks in the current section
            notificationFuncSecondary(`Cleared ${this.closest('section').classList[0]} tasks`); //show notification that tasks have been cleared
            renderAllTasks();
        }
    })
);

//debounce search input by 100ms to optimize search performance and prevent excessive re-rendering while typing
document.querySelector('#searchInput').addEventListener('input', function () {
    setTimeout(() => {
        if (document.getElementById('searchInput').value.trim() === '') return renderAllTasks();
        searchFunction();
    }, 100); //debounce search input by 100ms});
});

//clear search results and re-render all tasks when clear search button is clicked
document.querySelector('.clearSearchBtn').addEventListener('click', function () {
    if (document.getElementById('searchInput').value.trim() === '') return notificationFuncSecondary('Search input is already empty');
    document.getElementById('searchInput').value = '';
    renderAllTasks();
    notificationFuncSecondary('Cleared search results'); //show notification that search results have been cleared
});

// Export tasks as JSON
exportBtn.addEventListener('click', function () {
    // Ensure we are stringifying the actual object, not a string from localStorage
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';

    document.body.appendChild(link);
    link.click();

    // Cleanup: remove element and free memory
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notificationFuncSecondary('Exported tasks to file');
    importExportContainer.classList.add('hidden');
});

// Import tasks from JSON file
importBtn.addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json, application/json';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedTasks = JSON.parse(e.target.result);

                //Clear current tasks object without losing the reference
                Object.keys(tasks).forEach((key) => delete tasks[key]);

                //Assign imported data to the tasks object
                Object.assign(tasks, importedTasks);

                //Update UI
                renderAllTasks();

                notificationFuncSecondary('Imported tasks successfully');
            } catch (err) {
                console.error('Import failed:', err);
                notificationFuncSecondary('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    };

    input.click();
    importExportContainer.classList.add('hidden');
});

document.querySelector('.searchTaskBtn').addEventListener('click', searchFunction); //search functionality to find tasks by title

//----------------------------show modal and show create task button------------------------------//
addTaskBtn.addEventListener('click', () => {
    showModalFunc();
    document.querySelector('.createTask').classList.remove('hidden');
});

document.querySelector('.addBtnPlus').addEventListener('click', showModalFunc);
cancelModalBtn.addEventListener('click', closeModalFunc);
createTask.addEventListener('click', validateAndRenderTaskFunc);
