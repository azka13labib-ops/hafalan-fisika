const dataAlat = [
    { id: 1, nama: "Gelas Ukur", fungsi: "Mengukur volume" },
    { id: 2, nama: "Tabung Reaksi", fungsi: "Mereaksikan zat" },
    { id: 3, nama: "Botol Reagen", fungsi: "Menyimpan larutan" },
    { id: 4, nama: "Labu Erlenmeyer", fungsi: "Mencampur cairan" },
    { id: 5, nama: "Cawan Petri", fungsi: "Membiakkan mikroba" },
    { id: 6, nama: "Kaca Arloji", fungsi: "Menimbang padatan" },
    { id: 7, nama: "Cawan Penguap", fungsi: "Menguapkan larutan" },
    { id: 8, nama: "Mortar & Alu", fungsi: "Menghaluskan kristal" },
    { id: 9, nama: "Botol Semprot", fungsi: "Membilas peralatan" },
    { id: 10, nama: "Corong Kaca", fungsi: "Menuang cairan" },
    { id: 11, nama: "Kaki Tiga", fungsi: "Menyangga pembakar" },
    { id: 12, nama: "Kawat Nikrom", fungsi: "Menguji warna logam" },
    { id: 13, nama: "Kertas Saring", fungsi: "Memisahkan endapan" },
    { id: 14, nama: "Klem / Penjepit", fungsi: "Menjepit peralatan" },
    { id: 15, nama: "Lampu Bunsen", fungsi: "Memanaskan bahan" },
    { id: 16, nama: "Lup", fungsi: "Memperbesar objek" },
    { id: 17, nama: "Mikroskop", fungsi: "Mengamati renik" },
    { id: 18, nama: "Multimeter", fungsi: "Mengukur arus" },
    { id: 19, nama: "Neraca", fungsi: "Menimbang massa" },
    { id: 20, nama: "Pipet Tetes", fungsi: "Meneteskan cairan" },
    { id: 21, nama: "Rak Tabung", fungsi: "Meletakkan tabung" },
    { id: 22, nama: "Spatula", fungsi: "Mengambil padatan" },
    { id: 23, nama: "Statif", fungsi: "Menyangga klem" },
    { id: 24, nama: "Tensimeter", fungsi: "Mengukur tekanan" },
    { id: 25, nama: "Penjepit Buaya", fungsi: "Menjepit kabel" },
    { id: 26, nama: "Kertas Lakmus", fungsi: "Menguji keasaman" },
    { id: 27, nama: "Kasa Kawat", fungsi: "Meratakan panas" }
];
let currentIndex = 0;
let currentMode = 'urut';
let indices = Array.from({length: dataAlat.length}, (_, i) => i);
const inputNama = document.getElementById('inputNama');
const inputFungsi = document.getElementById('inputFungsi');
const feedbackNama = document.getElementById('feedbackNama');
const feedbackFungsi = document.getElementById('feedbackFungsi');
const btnCek = document.getElementById('btnCek');
const btnLanjut = document.getElementById('btnLanjut');
const btnTampilkan = document.getElementById('btnTampilkan');
const jawabanAsliContainer = document.getElementById('jawabanAsliContainer');
const jawabanNama = document.getElementById('jawabanNama');
const jawabanFungsi = document.getElementById('jawabanFungsi');
const currentIndexDisplay = document.getElementById('currentIndexDisplay');
const totalIndexDisplay = document.getElementById('totalIndexDisplay');
const imageContainer = document.getElementById('imageContainer');
const placeholderText = document.getElementById('placeholderText');
const alatImage = document.getElementById('alatImage');
const btnModeUrut = document.getElementById('btnModeUrut');
const btnModeAcak = document.getElementById('btnModeAcak');
const customModal = document.getElementById('customModal');
const btnModalKembali = document.getElementById('btnModalKembali');
totalIndexDisplay.textContent = indices.length;
function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
function getSimilarity(str1, str2) {
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    const distance = levenshtein(str1, str2);
    const maxLen = Math.max(str1.length, str2.length);
    return maxLen === 0 ? 100 : ((maxLen - distance) / maxLen) * 100;
}
function checkFungsiSimilarity(userInput, expectedInput) {
    userInput = userInput.toLowerCase();
    const stopWords = ['untuk', 'alat', 'ini', 'sebagai', 'pada', 'dan', 'yang'];
    let expectedWords = expectedInput.toLowerCase().split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);
    if (expectedWords.length === 0) {
        expectedWords = expectedInput.toLowerCase().split(/\s+/);
    }
    let matchCount = 0;
    expectedWords.forEach(word => {
        if (userInput.includes(word)) {
            matchCount++;
        }
    });
    const percentage = matchCount / expectedWords.length;
    if (percentage === 1) return 'green';
    if (percentage >= 0.5) return 'yellow';
    return 'red';
}
function resetUI() {
    inputNama.value = '';
    inputFungsi.value = '';
    inputNama.className = "input-feedback w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg";
    inputFungsi.className = "input-feedback w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg resize-none";
    feedbackNama.textContent = '';
    feedbackNama.className = 'text-sm mt-1 font-medium min-h-[1.25rem]';
    feedbackFungsi.textContent = '';
    feedbackFungsi.className = 'text-sm mt-1 font-medium min-h-[1.25rem]';
    btnLanjut.classList.add('hidden');
    btnCek.classList.remove('hidden');
    jawabanAsliContainer.classList.add('hidden');
    currentIndexDisplay.textContent = currentIndex + 1;
    const currentItem = dataAlat[indices[currentIndex]];
    const imgPath = `images/${currentItem.id}.jpg`;
    alatImage.src = imgPath;
    alatImage.onerror = () => {
        alatImage.classList.add('hidden');
        placeholderText.classList.remove('hidden');
        placeholderText.textContent = `Gambar Alat (ID: ${currentItem.id})`;
    };
    alatImage.onload = () => {
        alatImage.classList.remove('hidden');
        placeholderText.classList.add('hidden');
    };
    inputNama.focus();
}
function cekJawaban() {
    const currentItem = dataAlat[indices[currentIndex]];
    const valNama = inputNama.value;
    const valFungsi = inputFungsi.value;
    let allCorrect = true;
    const simNama = getSimilarity(valNama, currentItem.nama);
    inputNama.classList.remove('input-green', 'input-yellow', 'input-red', 'border-gray-300');
    if (valNama.trim() === '') {
        inputNama.classList.add('input-red');
        feedbackNama.textContent = 'Nama tidak boleh kosong.';
        feedbackNama.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-red-600';
        allCorrect = false;
    } else if (simNama === 100) {
        inputNama.classList.add('input-green');
        feedbackNama.textContent = 'Benar!';
        feedbackNama.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-green-600';
    } else if (simNama >= 60) {
        inputNama.classList.add('input-yellow');
        feedbackNama.textContent = 'Hampir benar (typo).';
        feedbackNama.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-yellow-600';
        allCorrect = false;
    } else {
        inputNama.classList.add('input-red');
        feedbackNama.textContent = 'Salah.';
        feedbackNama.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-red-600';
        allCorrect = false;
    }
    inputFungsi.classList.remove('input-green', 'input-yellow', 'input-red', 'border-gray-300');
    if (valFungsi.trim() === '') {
        inputFungsi.classList.add('input-red');
        feedbackFungsi.textContent = 'Fungsi tidak boleh kosong.';
        feedbackFungsi.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-red-600';
        allCorrect = false;
    } else {
        const resFungsi = checkFungsiSimilarity(valFungsi, currentItem.fungsi);
        if (resFungsi === 'green') {
            inputFungsi.classList.add('input-green');
            feedbackFungsi.textContent = 'Benar! (Memuat kata kunci)';
            feedbackFungsi.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-green-600';
        } else if (resFungsi === 'yellow') {
            inputFungsi.classList.add('input-yellow');
            feedbackFungsi.textContent = 'Kurang lengkap (Memuat sebagian kata kunci).';
            feedbackFungsi.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-yellow-600';
            allCorrect = false;
        } else {
            inputFungsi.classList.add('input-red');
            feedbackFungsi.textContent = 'Salah.';
            feedbackFungsi.className = 'text-sm mt-1 font-medium min-h-[1.25rem] text-red-600';
            allCorrect = false;
        }
    }
    btnLanjut.classList.remove('hidden');
    btnCek.classList.add('hidden');
    if (!allCorrect) {
        jawabanNama.textContent = currentItem.nama;
        jawabanFungsi.textContent = currentItem.fungsi;
    }
}
btnCek.addEventListener('click', cekJawaban);
btnLanjut.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= indices.length) {
        customModal.classList.remove('hidden');
    } else {
        resetUI();
    }
});
btnTampilkan.addEventListener('click', () => {
    const currentItem = dataAlat[indices[currentIndex]];
    jawabanNama.textContent = currentItem.nama;
    jawabanFungsi.textContent = currentItem.fungsi;
    jawabanAsliContainer.classList.remove('hidden');
});
inputNama.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        inputFungsi.focus();
    }
});
function setModeUrut() {
    currentMode = 'urut';
    currentIndex = 0;
    indices = Array.from({length: dataAlat.length}, (_, i) => i);
    totalIndexDisplay.textContent = indices.length;
    btnModeUrut.className = "px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white transition-colors flex-1 md:flex-none";
    btnModeAcak.className = "px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-1 md:flex-none";
    resetUI();
}
function setModeAcak() {
    currentMode = 'acak';
    currentIndex = 0;
    let allIndices = Array.from({length: dataAlat.length}, (_, i) => i);
    indices = allIndices.sort(() => Math.random() - 0.5).slice(0, 5);
    totalIndexDisplay.textContent = indices.length;
    btnModeAcak.className = "px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white transition-colors flex-1 md:flex-none";
    btnModeUrut.className = "px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-1 md:flex-none";
    resetUI();
}
btnModeUrut.addEventListener('click', setModeUrut);
btnModeAcak.addEventListener('click', setModeAcak);
btnModalKembali.addEventListener('click', () => {
    customModal.classList.add('hidden');
    currentIndex = 0;
    resetUI();
});
setModeUrut();