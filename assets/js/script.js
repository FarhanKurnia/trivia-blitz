
// --- Variabel Global Game ---
let currentDataset = []; // Ganti array kosong
let currentQuestionIndex = -1;
let totalQuestions = 0; // Ganti menjadi 0 karena data akan di-load
let timeLeft = 0;
const INITIAL_TIME = 20;
let timerInterval = null;


// --- Elemen DOM Halaman & Game ---
const coverPage = document.getElementById('cover-page');
const rulesPage = document.getElementById('rules-page');
const gamePage = document.getElementById('game-page');
const finishPage = document.getElementById('finish-page');
const restartGameBtn = document.getElementById('restart-game-btn');

const startRulesBtn = document.getElementById('start-rules-btn');
const startGameFromRulesBtn = document.getElementById('start-game-from-rules-btn');

const questionCounter = document.getElementById('question-counter');
const timerDisplay = document.getElementById('timer-display');
const timerBar = document.getElementById('timer-bar');
const currentQuestionEl = document.getElementById('current-question');
const answerBox = document.getElementById('answer-box');
const correctAnswerText = document.getElementById('correct-answer-text');
const timerArea = document.querySelector('.timer-area');
const gameContainer = document.querySelector('.game-container'); // <<< AMBIL CONTAINER UTAMA
const rulesContentOl = document.querySelector('.rules-content ol'); // Tempat daftar peraturan akan di-inject

const showAnswerBtn = document.getElementById('show-answer-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');

// --- Elemen DOM Audio ---
const soundReady = document.getElementById('sound-ready');
const soundBegin = document.getElementById('sound-begin');
const backsoundMusic = document.getElementById('backsound-music');

// --- FUNGSI LOAD DATA ASINKRON ---
async function loadGameData() {
    try {
        // Ganti path ini sesuai lokasi file Anda
        const response = await fetch('assets/json/questions.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Tetapkan data yang sudah di-load ke variabel global
        currentDataset = data;
        totalQuestions = currentDataset.length;
        
        console.log(`Data berhasil dimuat. Total soal: ${totalQuestions}`);
        
        // Aktifkan tombol navigasi setelah data dimuat
        if (startRulesBtn) startRulesBtn.disabled = false;
        
    } catch (error) {
        console.error("Gagal memuat data pertanyaan:", error);
        alert("Gagal memuat data pertanyaan. Silakan cek file questions.json.");
    }
}

async function loadRulesData() {
    try {
        const response = await fetch('assets/json/rules.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rulesArray = await response.json();
        
        // Setelah data dimuat, tampilkan di halaman
        displayRules(rulesArray); 
    } catch (error) {
        console.error("Gagal memuat data peraturan:", error);
    }
}

function displayRules(rulesArray) {
    if (!rulesContentOl) return;

    // Bersihkan daftar yang mungkin sudah ada
    rulesContentOl.innerHTML = ''; 

    // Isi daftar dengan data dari JSON
    rulesArray.forEach(rule => {
        const listItem = document.createElement('li');
        listItem.textContent = rule;
        rulesContentOl.appendChild(listItem);
    });
}


// --- FUNGSI NAVIGASI HALAMAN ---
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.remove('hidden');
            page.classList.add('active');
        } else {
            // Hilangkan class active dulu untuk memicu transisi
            page.classList.remove('active'); 
            // Setelah transisi selesai (sekitar 800ms di CSS), tambahkan hidden
            // Namun, karena kita menggunakan position: absolute, langsung hilangkan saja:
            page.classList.add('hidden');
        }
    });
}

// --- FUNGSI KONTROL GAME ---
function resetGameData() {
    currentQuestionIndex = -1;
    totalQuestions = currentDataset.length;
    resetTimer();
    updateQuestionDisplay('Soal akan muncul di sini.');
    questionCounter.textContent = `Soal 0 / ${totalQuestions}`;
    answerBox.classList.add('hidden');
    
    showAnswerBtn.disabled = true;
    nextQuestionBtn.disabled = true;

    // Pastikan game container terlihat saat game dimulai
    if (gameContainer) gameContainer.classList.remove('hidden');
}

function nextQuestion() {
    resetTimer();
    currentQuestionIndex++;

    if (currentQuestionIndex >= totalQuestions) {
        // --- LOGIKA GAME SELESAI: Pindah ke halaman baru ---
        
        // Nonaktifkan/sembunyikan tombol di Game Page
        showAnswerBtn.disabled = true;
        nextQuestionBtn.disabled = true;
        timerArea.classList.add('hidden');
        
        // PENTING: Sembunyikan kontainer utama Game Page untuk mencegah blank hitam
        if (gameContainer) gameContainer.classList.add('hidden'); // <<< PERBAIKAN BLANK HITAM

        // KUNCI: Hanya PAUSE musik, jangan di-reset (currentTime = 0)
        if (backsoundMusic) {
            backsoundMusic.pause(); // <<< Hanya pause, tidak stop/reset
        }
        
        // Pindah ke Halaman Akhir
        showPage('finish-page');
        
        return; 
    }

    // --- LOGIKA SOAL BARU ---
    
    // Pastikan Backsound diputar saat soal baru dimulai
    if (backsoundMusic && backsoundMusic.paused) {
        // Jika musik di-pause (misalnya dari halaman finish), lanjutkan putar
        backsoundMusic.play().catch(e => console.log("Backsound play error:", e));
    }

    // --- LOGIKA SOAL BARU ---

    // Pastikan kontainer game terlihat saat ada soal
    if (gameContainer) gameContainer.classList.remove('hidden'); 
    
    // Tampilkan Soal Baru
    const q = currentDataset[currentQuestionIndex];
    updateQuestionDisplay(q.pertanyaan);
    questionCounter.textContent = `Soal ${currentQuestionIndex + 1} / ${totalQuestions}`;
    correctAnswerText.textContent = '---'; 
    answerBox.classList.add('hidden');
    timerArea.classList.remove('time-up');
    timerArea.classList.remove('hidden'); // Pastikan timer muncul lagi
    
    // Kontrol Tombol untuk Soal Baru
    showAnswerBtn.disabled = false;
    nextQuestionBtn.disabled = true;
    
    startTimer();
}

// --- FUNGSI KONTROL WAKTU (Tidak ada perubahan signifikan) ---
function startTimer() {
    // ... (Logika Timer Anda yang sudah ada)
    if (timerInterval) clearInterval(timerInterval);
    
    timeLeft = INITIAL_TIME;
    timerDisplay.textContent = timeLeft;
    timerBar.style.width = '100%';
    timerBar.style.transition = 'width 1s linear';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        timerBar.style.width = `${(timeLeft / INITIAL_TIME) * 100}%`;
        
        if (timeLeft <= 5) {
            // ... (Efek visual 5 detik terakhir)
        } else {
            // ...
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerArea.classList.add('time-up');
            showAnswerBtn.disabled = false;
        }
    }, 1000);
}

function resetTimer() {
    // ... (Logika reset Timer Anda yang sudah ada)
    clearInterval(timerInterval);
    timeLeft = INITIAL_TIME;
    timerDisplay.textContent = INITIAL_TIME;
    timerBar.style.width = '100%';
    timerBar.style.transition = 'none';
    timerArea.classList.remove('time-up');
}

// --- FUNGSI JAWABAN (Tidak ada perubahan signifikan) ---
function showAnswer() {
    clearInterval(timerInterval); 
    
    const q = currentDataset[currentQuestionIndex];
    correctAnswerText.textContent = q.jawaban_benar;
    answerBox.classList.remove('hidden');
    showAnswerBtn.disabled = true;
    
    nextQuestionBtn.disabled = false;
}

function updateQuestionDisplay(text) {
    currentQuestionEl.textContent = text;
}

// --- FUNGSI RESTART GAME ---
function restartGame() {
    window.location.reload();
}


// --- EVENT LISTENERS ---

// Navigasi dari Cover ke Rules
startRulesBtn.addEventListener('click', () => {
    if (soundReady) soundReady.play().catch(e => console.log("Audio play error:", e));
    showPage('rules-page');
    loadRulesData();
});

// Navigasi dari Rules ke Game
startGameFromRulesBtn.addEventListener('click', () => {
    // 1. Mainkan sound "let the game begin"
    if (soundBegin) soundBegin.play().catch(e => console.log("Audio play error:", e));
    
    // 2. Mainkan Backsound secara loop
    if (backsoundMusic) {
        backsoundMusic.volume = 1; // Atur volume agar tidak terlalu keras
        backsoundMusic.play().catch(e => console.log("Backsound play error:", e));
    }

    showPage('game-page');
    resetGameData(); 
    nextQuestion(); 
});

// Kontrol dalam Game Page
showAnswerBtn.addEventListener('click', showAnswer);
nextQuestionBtn.addEventListener('click', nextQuestion);

// Tombol MULAI ULANG di Halaman Akhir
if (restartGameBtn) {
    restartGameBtn.addEventListener('click', restartGame);
}

// startRulesBtn.addEventListener('click', () => {
//     showPage('rules-page');
//     loadRulesData(); // <<< PANGGIL FUNGSI INI DI SINI
// });

// Inisialisasi: Tampilkan Cover Page saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Data terlebih dahulu
    loadGameData();

    // 2. Tampilkan Cover Page
    showPage('cover-page');
});