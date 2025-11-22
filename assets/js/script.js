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

const startRulesBtn = document.getElementById('start-rules-btn');
const startGameFromRulesBtn = document.getElementById('start-game-from-rules-btn');

const questionCounter = document.getElementById('question-counter');
const timerDisplay = document.getElementById('timer-display');
const timerBar = document.getElementById('timer-bar');
const currentQuestionEl = document.getElementById('current-question');
const answerBox = document.getElementById('answer-box');
const correctAnswerText = document.getElementById('correct-answer-text');
const timerArea = document.querySelector('.timer-area');

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
            page.classList.add('hidden');
            page.classList.remove('active');
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
    
    // Nonaktifkan tombol game di awal
    showAnswerBtn.disabled = true;
    nextQuestionBtn.disabled = true;
}

function nextQuestion() {
    resetTimer(); // Pastikan timer bersih sebelum memulai yang baru
    currentQuestionIndex++;

    if (currentQuestionIndex >= totalQuestions) {
        // Game Selesai
        updateQuestionDisplay('TRIVIA BLITZ SELESAI! Selamat kepada para pemenang.');
        questionCounter.textContent = `Total Soal: ${totalQuestions}`;
        
        // Nonaktifkan semua tombol setelah game selesai
        [showAnswerBtn, nextQuestionBtn].forEach(btn => btn.disabled = true);
        return;
    }

    // Tampilkan Soal Baru
    const q = currentDataset[currentQuestionIndex];
    updateQuestionDisplay(q.pertanyaan);
    questionCounter.textContent = `Soal ${currentQuestionIndex + 1} / ${totalQuestions}`;
    correctAnswerText.textContent = '---'; // Sembunyikan jawaban lama
    answerBox.classList.add('hidden');
    timerArea.classList.remove('time-up'); // Hapus efek waktu habis jika ada
    
    // Kontrol Tombol untuk Soal Baru
    // PERUBAHAN UTAMA: Tombol Tampilkan Jawaban diaktifkan segera
    showAnswerBtn.disabled = false; // <<< INI PERBAIKANNYA
    nextQuestionBtn.disabled = true; // Hanya aktif setelah jawaban ditampilkan
    
    // Mulai Timer Otomatis
    startTimer();
}

// --- FUNGSI KONTROL WAKTU ---
function startTimer() {
    if (timerInterval) clearInterval(timerInterval); // Hentikan timer sebelumnya jika ada
    
    timeLeft = INITIAL_TIME;
    timerDisplay.textContent = timeLeft;
    timerBar.style.width = '100%';
    timerBar.style.transition = 'width 1s linear'; // Reset transisi
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        timerBar.style.width = `${(timeLeft / INITIAL_TIME) * 100}%`;
        
        // Perubahan warna di 5 detik terakhir (opsional visual)
        if (timeLeft <= 5) {
            timerBar.style.backgroundColor = 'var(--secondary-color)';
        } else {
            timerBar.style.backgroundColor = ''; // Kembali ke gradien default
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerArea.classList.add('time-up'); // Efek visual waktu habis
            showAnswerBtn.disabled = false; // Waktu habis, Host wajib menampilkan jawaban
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = INITIAL_TIME;
    timerDisplay.textContent = INITIAL_TIME;
    timerBar.style.width = '100%';
    timerBar.style.transition = 'none'; // Hentikan animasi saat reset
    timerArea.classList.remove('time-up'); // Hapus efek waktu habis
}

// --- FUNGSI JAWABAN ---
function showAnswer() {
    clearInterval(timerInterval); // Hentikan waktu ketika tombol ini ditekan
    
    const q = currentDataset[currentQuestionIndex];
    correctAnswerText.textContent = q.jawaban_benar;
    answerBox.classList.remove('hidden');
    showAnswerBtn.disabled = true; // Setelah diklik, nonaktifkan
    
    // Setelah menampilkan jawaban, Host dapat melanjutkan ke soal berikutnya
    nextQuestionBtn.disabled = false;
}

function updateQuestionDisplay(text) {
    currentQuestionEl.textContent = text;
}


// --- EVENT LISTENERS ---

// Navigasi dari Cover ke Rules
startRulesBtn.addEventListener('click', () => {
    showPage('rules-page');
});

// Navigasi dari Rules ke Game
startGameFromRulesBtn.addEventListener('click', () => {
    showPage('game-page');
    resetGameData(); // Siapkan data game
    nextQuestion(); // Mulai soal pertama
});

// Kontrol dalam Game Page
showAnswerBtn.addEventListener('click', showAnswer);
nextQuestionBtn.addEventListener('click', nextQuestion);

// Inisialisasi: Tampilkan Cover Page saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    showPage('cover-page');
    // Jika Anda ingin menguji game langsung, ubah ini:
    // showPage('game-page');
    // resetGameData();
    // nextQuestion();
});