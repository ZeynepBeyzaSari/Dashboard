// 1. HAVA DURUMU
const weatherApiKey = "b224d80ad57fdc54e6329c92df22c528";
const city = "Istanbul";

async function fetchWeather() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=tr`
        );
        const data = await response.json();

        if (data.cod === 200) {
            document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
            document.getElementById("city-info").innerText = `${data.name}, ${data.weather[0].description}`;
            
            const iconCode = data.weather[0].icon;
            document.getElementById("weather-icon").innerHTML = 
                `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="100">`;
        }
    } catch (error) {
        console.error("Hava durumu verisi alınamadı:", error);
        document.getElementById("city-info").innerText = "API Anahtarı Gerekli";
    }
}

// 2. SAYAÇ
let count = parseInt(localStorage.getItem("db_v4_count")) || 0;
const cVal = document.getElementById("counter-val");
cVal.innerText = count;

function changeCounter(v) {
    count += v;
    cVal.innerText = count;
    localStorage.setItem("db_v4_count", count);
}
function resetCounter() {
    count = 0;
    cVal.innerText = count;
    localStorage.setItem("db_v4_count", count);
}

// 3. SAAT
setInterval(() => {
    const now = new Date();
    document.getElementById("clock").innerText = now.toLocaleTimeString('tr-TR');
    document.getElementById("date").innerText = now.getDate() + " " + now.toLocaleString('tr-TR', {month:'long'});
}, 1000);

// 4. HESAP MAKİNESİ
const disp = document.getElementById("calc-display");
function appendToDisplay(v) { 
    if (disp.value === "0") disp.value = v; 
    else disp.value += v; 
}
function clearDisplay() { disp.value = "0"; }
function deleteLast() { 
    disp.value = disp.value.slice(0, -1); 
    if (disp.value === "") disp.value = "0";
}
function calculateResult() { 
    try { disp.value = eval(disp.value.replace('×', '*')); } 
    catch { disp.value = "Hata"; } 
}

// 5. TAKVİM
let curM = new Date().getMonth(), curY = new Date().getFullYear();
function renderCal() {
    const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
    document.getElementById("month-name").innerText = months[curM] + " " + curY;
    const days = document.getElementById("calendar-days"); days.innerHTML = "";
    const first = new Date(curY, curM, 1).getDay();
    const total = new Date(curY, curM + 1, 0).getDate();
    let gap = first === 0 ? 6 : first - 1;
    for(let i=0; i<gap; i++) days.innerHTML += "<div></div>";
    for(let i=1; i<=total; i++) {
        let isT = (i === new Date().getDate() && curM === new Date().getMonth()) ? "today" : "";
        days.innerHTML += `<div class="${isT}">${i}</div>`;
    }
}
function changeMonth(v) { curM += v; if(curM<0){curM=11; curY--;} if(curM>11){curM=0; curY++;} renderCal(); }

// 6. YILAN OYUNU
const canvas = document.getElementById("snakeGame"), ctx = canvas.getContext("2d");
let box = 20, snake, food, d, gameID;

function openGame() { document.getElementById("gameOverlay").style.display = "flex"; }
function closeGame() { document.getElementById("gameOverlay").style.display = "none"; clearInterval(gameID); }

function startGame() {
    snake = [{x: 10*box, y: 10*box}]; d = null;
    document.getElementById("snake-score").innerText = "Skor: 0";
    food = {x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box};
    if(gameID) clearInterval(gameID);
    gameID = setInterval(draw, 150); 
}

document.addEventListener("keydown", e => {
    if(e.keyCode==37 && d!="RIGHT") d="LEFT"; 
    else if(e.keyCode==38 && d!="DOWN") d="UP";
    else if(e.keyCode==39 && d!="LEFT") d="RIGHT"; 
    else if(e.keyCode==40 && d!="UP") d="DOWN";
});

function draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0,0,400,400);
    for(let i=0; i<snake.length; i++) {
        ctx.fillStyle = (i==0) ? "#ff7f50" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box-1, box-1);
    }
    ctx.fillStyle = "#4CAF50"; ctx.fillRect(food.x, food.y, box-1, box-1);
    let hX = snake[0].x, hY = snake[0].y;
    if(d=="LEFT") hX-=box; if(d=="UP") hY-=box; if(d=="RIGHT") hX+=box; if(d=="DOWN") hY+=box;
    if(hX==food.x && hY==food.y) {
        document.getElementById("snake-score").innerText = "Skor: " + (snake.length);
        food = {x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box};
    } else { snake.pop(); }
    let nH = {x:hX, y:hY};
    if(hX<0 || hX>=400 || hY<0 || hY>=400 || snake.some(s=>s.x==nH.x && s.y==nH.y)) {
        clearInterval(gameID); alert("Oyun Bitti!");
    }
    snake.unshift(nH);
}

// 7. TO-DO
function addTodo() {
    const input = document.getElementById("todo-input");
    const taskText = input.value.trim();
    if (taskText === "") return;
    const todoList = document.getElementById("todo-list");
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
        <span onclick="toggleTodo(this)">${taskText}</span>
        <i class="fas fa-trash-alt delete-btn" onclick="deleteTodo(this)"></i>
    `;
    todoList.appendChild(li);
    input.value = "";
}
function toggleTodo(element) {
    element.parentElement.classList.toggle("completed");
}
function deleteTodo(element) {
    element.parentElement.remove();
}
document.getElementById("todo-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTodo();
    }
});

// 8. MODALLAR
// Anket Modalı
function openPoll() {
    document.getElementById("pollOverlay").style.display = "flex";
}
function closePoll() {
    document.getElementById("pollOverlay").style.display = "none";
}

// Hesap Oluştur Modalı
function openAccount() {
    document.getElementById("accountOverlay").style.display = "flex";
}
function closeAccount() {
    document.getElementById("accountOverlay").style.display = "none";
}

// Kayıt İşlemi
function handleRegister() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;

    if (name && email) {
        alert("Teşekkürler " + name + "! Kaydın başarıyla alındı.");
        closeAccount();
    } else {
        alert("Lütfen tüm alanları doldurunuz.");
    }
}

// Anket Cevaplama
function submitPoll(ans) {
    const container = document.getElementById("poll-container");
    container.innerHTML = `
        <div style="padding: 20px;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #4CAF50; margin-bottom: 15px;"></i>
            <h2>Teşekkürler!</h2>
            <p>Geri bildirimin kaydedildi.</p>
        </div>
    `;
    setTimeout(closePoll, 2000);
}

// Başlatıcılar
fetchWeather();
renderCal();