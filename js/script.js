/* ==========================================================
   LIFE DASHBOARD
   PART 3A
   Greeting
   Clock
   Theme
   Username
   Toast
==========================================================*/

/* ==========================================================
   DOM ELEMENT
==========================================================*/

const greetingText = document.getElementById("greetingText");
const username = document.getElementById("username");
const clock = document.getElementById("clock");
const date = document.getElementById("date");

const themeToggle = document.getElementById("themeToggle");
const changeName = document.getElementById("changeName");

const modal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const saveName = document.getElementById("saveName");

const toast = document.getElementById("toast");

/* ==========================================================
   LOCAL STORAGE KEY
==========================================================*/

const USER_KEY = "lifeDashboardUser";
const THEME_KEY = "lifeDashboardTheme";
const TASK_KEY = "lifeDashboardTasks";
const LINK_KEY = "lifeDashboardLinks";

/* ==========================================================
   TOAST
==========================================================*/

function showToast(message){

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

/* ==========================================================
   GREETING
==========================================================*/

function getGreeting(){

    const hour = new Date().getHours();

    if(hour >=5 && hour <12){

        return "Good Morning ☀️";

    }

    if(hour >=12 && hour <15){

        return "Good Afternoon 🌤️";

    }

    if(hour >=15 && hour <18){

        return "Good Evening 🌇";

    }

    return "Good Night 🌙";

}

function updateGreeting(){

    greetingText.innerHTML = `
        ${getGreeting()},
        <span id="username">${username.textContent}</span> 👋
    `;

}

/* ==========================================================
   CLOCK
==========================================================*/

function updateClock(){

    const now = new Date();

    const optionsDate = {

        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"

    };

    clock.innerText = now.toLocaleTimeString();

    date.innerText = now.toLocaleDateString(
        "en-US",
        optionsDate
    );

}

setInterval(updateClock,1000);

updateClock();

/* ==========================================================
   USERNAME
==========================================================*/

function loadUsername(){

    const savedName = localStorage.getItem(USER_KEY);

    if(savedName){

        username.textContent = savedName;

        updateGreeting();

    }else{

        modal.classList.add("active");

    }

}

function saveUsername(){

    const name = nameInput.value.trim();

    if(name===""){

        showToast("Please enter your name.");

        return;

    }

    localStorage.setItem(USER_KEY,name);

    username.textContent = name;

    modal.classList.remove("active");

    updateGreeting();

    showToast("Welcome "+name+"!");

}

saveName.addEventListener("click",saveUsername);

changeName.addEventListener("click",()=>{

    nameInput.value="";

    modal.classList.add("active");

});

/* ==========================================================
   THEME
==========================================================*/

function loadTheme(){

    const savedTheme = localStorage.getItem(THEME_KEY);

    if(savedTheme==="dark"){

        document.body.classList.add("dark");

        themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

}

function toggleTheme(){

    document.body.classList.toggle("dark");

    const darkMode=document.body.classList.contains("dark");

    if(darkMode){

        localStorage.setItem(THEME_KEY,"dark");

        themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

        showToast("Dark Mode Enabled");

    }else{

        localStorage.setItem(THEME_KEY,"light");

        themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';

        showToast("Light Mode Enabled");

    }

}

themeToggle.addEventListener("click",toggleTheme);

/* ==========================================================
   INITIALIZATION
==========================================================*/

loadTheme();

loadUsername();

updateGreeting();

updateClock();

/* ==========================================================
   TODO LIST
==========================================================*/

const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = [];

/* ==========================================================
   LOAD TASK
==========================================================*/

function loadTasks(){

    const savedTasks = localStorage.getItem(TASK_KEY);

    if(savedTasks){

        tasks = JSON.parse(savedTasks);

    }

    renderTasks();

}

/* ==========================================================
   SAVE TASK
==========================================================*/

function saveTasks(){

    localStorage.setItem(
        TASK_KEY,
        JSON.stringify(tasks)
    );

}

/* ==========================================================
   RENDER TASK
==========================================================*/

function renderTasks(){

    taskList.innerHTML = "";

    if(tasks.length === 0){

        taskList.innerHTML = `
            <div class="empty">
                <i class="fa-solid fa-list-check"></i>
                <p>No Task Yet</p>
            </div>
        `;

        return;

    }

    tasks.forEach((task,index)=>{

        const li = document.createElement("li");

        li.className = task.completed
            ? "task completed"
            : "task";

        li.innerHTML = `

        <div class="task-left">

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${index})">

            <span class="task-text">

                ${task.text}

            </span>

        </div>

        <div class="task-action">

            <button
                class="edit-btn"
                onclick="editTask(${index})">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        taskList.appendChild(li);

    });

}

/* ==========================================================
   DUPLICATE CHECK
==========================================================*/

function isDuplicate(text){

    return tasks.some(task=>{

        return task.text.toLowerCase() ===
               text.toLowerCase();

    });

}

/* ==========================================================
   ADD TASK
==========================================================*/

function addNewTask(){

    const text = taskInput.value.trim();

    if(text===""){

        showToast("Task cannot be empty.");

        return;

    }

    if(isDuplicate(text)){

        showToast("Duplicate task!");

        return;

    }

    tasks.push({

        text:text,

        completed:false

    });

    saveTasks();

    renderTasks();

    taskInput.value="";

    showToast("Task Added");

}

addTask.addEventListener("click",addNewTask);

taskInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        addNewTask();

    }

});

/* ==========================================================
   DELETE TASK
==========================================================*/

function deleteTask(index){

    if(confirm("Delete this task?")){

        tasks.splice(index,1);

        saveTasks();

        renderTasks();

        showToast("Task Deleted");

    }

}

/* ==========================================================
   COMPLETE TASK
==========================================================*/

function toggleTask(index){

    tasks[index].completed =
    !tasks[index].completed;

    saveTasks();

    renderTasks();

}

/* ==========================================================
   EDIT TASK
==========================================================*/

function editTask(index){

    const currentTask = tasks[index];

    const newTask = prompt(
        "Edit Task",
        currentTask.text
    );

    if(newTask===null){

        return;

    }

    const text = newTask.trim();

    if(text===""){

        showToast("Task cannot be empty.");

        return;

    }

    const duplicate = tasks.some((task,i)=>{

        return i !== index &&
               task.text.toLowerCase() ===
               text.toLowerCase();

    });

    if(duplicate){

        showToast("Duplicate task!");

        return;

    }

    tasks[index].text = text;

    saveTasks();

    renderTasks();

    showToast("Task Updated");

}

/* ==========================================================
   SORT TASK
==========================================================*/

function sortTasks(){

    tasks.sort((a,b)=>{

        return a.completed - b.completed;

    });

    saveTasks();

    renderTasks();

}

/* ==========================================================
   LOAD
==========================================================*/

loadTasks();

/* ==========================================================
   POMODORO TIMER
==========================================================*/

const timerDisplay = document.getElementById("timer");

const startTimerBtn = document.getElementById("startTimer");
const stopTimerBtn = document.getElementById("stopTimer");
const resetTimerBtn = document.getElementById("resetTimer");

let timer = 25 * 60;
let timerInterval = null;

function updateTimer(){

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    timerDisplay.innerText =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

function startTimer(){

    if(timerInterval !== null) return;

    timerInterval = setInterval(()=>{

        if(timer > 0){

            timer--;

            updateTimer();

        }else{

            clearInterval(timerInterval);

            timerInterval = null;

            showToast("Pomodoro Finished!");

            alert("🎉 Focus Session Complete!");

        }

    },1000);

}

function stopTimer(){

    clearInterval(timerInterval);

    timerInterval = null;

}

function resetTimer(){

    stopTimer();

    timer = 25 * 60;

    updateTimer();

}

startTimerBtn.addEventListener("click",startTimer);
stopTimerBtn.addEventListener("click",stopTimer);
resetTimerBtn.addEventListener("click",resetTimer);

updateTimer();


/* ==========================================================
   QUICK LINKS
==========================================================*/

const siteName = document.getElementById("siteName");
const siteURL = document.getElementById("siteURL");
const addLink = document.getElementById("addLink");
const quickLinks = document.getElementById("quickLinks");

let links = [];

/* ==========================================================
   LOAD LINKS
==========================================================*/

function loadLinks(){

    const savedLinks = localStorage.getItem(LINK_KEY);

    if(savedLinks){

        links = JSON.parse(savedLinks);

    }

    renderLinks();

}

/* ==========================================================
   SAVE LINKS
==========================================================*/

function saveLinks(){

    localStorage.setItem(
        LINK_KEY,
        JSON.stringify(links)
    );

}

/* ==========================================================
   RENDER LINKS
==========================================================*/

function renderLinks(){

    quickLinks.innerHTML = "";

    if(links.length===0){

        quickLinks.innerHTML = `
        <div class="empty">
            <i class="fa-solid fa-link"></i>
            <p>No Link Available</p>
        </div>
        `;

        return;

    }

    links.forEach((link,index)=>{

        const card = document.createElement("div");

        card.className = "link-card";

        card.innerHTML = `

        <button
            class="delete-link"
            onclick="deleteLink(${index})">

            <i class="fa-solid fa-xmark"></i>

        </button>

        <div
            class="link-content"
            onclick="window.open('${link.url}','_blank')">

            <i class="fa-solid fa-globe"></i>

            <span>${link.name}</span>

        </div>

        `;

        quickLinks.appendChild(card);

    });

}

/* ==========================================================
   ADD LINK
==========================================================*/

function addNewLink(){

    const name = siteName.value.trim();
    const url = siteURL.value.trim();

    if(name==="" || url===""){

        showToast("Complete all fields.");

        return;

    }

    const duplicate = links.some(link=>{

        return link.url === url;

    });

    if(duplicate){

        showToast("Link already exists.");

        return;

    }

    links.push({

        name:name,

        url:url

    });

    saveLinks();

    renderLinks();

    siteName.value="";
    siteURL.value="";

    showToast("Link Added");

}

addLink.addEventListener("click",addNewLink);

/* ==========================================================
   DELETE LINK
==========================================================*/

function deleteLink(index){

    if(confirm("Delete this link?")){

        links.splice(index,1);

        saveLinks();

        renderLinks();

        showToast("Link Deleted");

    }

}

/* ==========================================================
   INITIALIZE APP
==========================================================*/

window.onload = ()=>{

    updateClock();

    updateGreeting();

    loadUsername();

    loadTheme();

    loadTasks();

    loadLinks();

    updateTimer();

};

/* ==========================================================
   END OF FILE
==========================================================*/