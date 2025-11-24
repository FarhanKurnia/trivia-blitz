// --- Data Soal TRIVIA BLITZ ---
const TRIVIA_DATA = [
    { id: 1, pertanyaan: "Ibu kota negara Jepang adalah...", jawaban_benar: "Tokyo" },
    { id: 2, pertanyaan: "Satuan dasar untuk gaya dalam sistem SI adalah...", jawaban_benar: "Newton" },
    { id: 3, pertanyaan: "Siapa Presiden pertama Republik Indonesia?", jawaban_benar: "Soekarno" },
    { id: 4, pertanyaan: "Organ tubuh yang berfungsi memompa darah ke seluruh tubuh adalah...", jawaban_benar: "Jantung" },
    { id: 5, pertanyaan: "Planet keenam dari Matahari adalah...", jawaban_benar: "Saturnus" },
    { id: 6, pertanyaan: "Sungai terpanjang di dunia adalah Sungai...", jawaban_benar: "Nil" },
    { id: 7, pertanyaan: "Berapa hari dalam setahun kabisat?", jawaban_benar: "366" },
    // Tambahkan lebih banyak soal Trivia di sini!
];

// --- Variabel Global Game ---
let currentDataset = TRIVIA_DATA;
let currentQuestionIndex = -1;
let totalQuestions = currentDataset.length;
let timeLeft = 0;
let timerInterval = null;
const INITIAL_TIME = 20;

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

const showAnswerBtn = document.getElementById('show-answer-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');


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
        
        // Pindah ke Halaman Akhir
        showPage('finish-page');
        
        return; 
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
    showPage('rules-page');
});

// Navigasi dari Rules ke Game
startGameFromRulesBtn.addEventListener('click', () => {
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

// Inisialisasi: Tampilkan Cover Page saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    showPage('cover-page');
});