import CONFIG from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const plusBtn = document.getElementById('plus-btn');
    const plusModal = document.getElementById('plus-modal');
    const micBtn = document.getElementById('mic-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const diaryContent = document.getElementById('diary-content');
    const shareBtn = document.getElementById('menu-share');

    // Toggle Menu
    menuBtn.addEventListener('click', () => sideMenu.classList.toggle('hidden'));
    plusBtn.addEventListener('click', () => plusModal.classList.toggle('hidden'));

    // Free App Share
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: CONFIG.APP_NAME,
                text: 'आज ही अपनी डिजिटल डायरी डाउनलोड करें फ्री में निशुल्क!',
                url: window.location.href,
            });
        } else {
            alert('एप लिंक: ' + window.location.href);
        }
    });

    // Add entry to screen with Free Download & Share buttons
    function addEntry(text, type) {
        if (!text.trim()) return;

        if (diaryContent.querySelector('.italic')) {
            diaryContent.innerHTML = '';
        }

        const entryDiv = document.createElement('div');
        entryDiv.className = 'p-3 bg-amber-50 border-l-4 border-amber-700 rounded-r-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2';
        
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        entryDiv.innerHTML = `
            <div>
                <p class="font-medium text-gray-800 text-base">${text}</p>
                <span class="text-xs text-gray-500">समय: ${timeStr} | मोड: ${type}</span>
            </div>
            <div class="flex gap-2 text-xs">
                <button class="px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 download-btn">📥 फ्री PDF</button>
                <button class="px-2.5 py-1 bg-green-600 text-white rounded hover:bg-green-700 share-whatsapp">💬 व्हाट्सएप शेयर</button>
            </div>
        `;

        // Free Download Event
        entryDiv.querySelector('.download-btn').addEventListener('click', () => {
            alert(`[फ्री टेस्टिंग मोड] "${text}" की फाइल सफलतापूर्वक डाउनलोड हो गई!`);
        });

        // Free WhatsApp Share Event
        entryDiv.querySelector('.share-whatsapp').addEventListener('click', () => {
            const waText = encodeURIComponent(`One-Diary से शेयर किया गया नोट:\n${text}`);
            window.open(`https://wa.me/?text=${waText}`, '_blank');
        });

        diaryContent.prepend(entryDiv);
        userInput.value = '';
    }

    // Send Button & Enter Key
    sendBtn.addEventListener('click', () => addEntry(userInput.value, 'Type'));
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addEntry(userInput.value, 'Type');
    });

    // Voice Recognition (Human-like interaction simulation)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';

        micBtn.addEventListener('click', () => {
            recognition.start();
            micBtn.classList.add('bg-red-700', 'animate-ping');
        });

        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            micBtn.classList.remove('bg-red-700', 'animate-ping');
            
            // Speak human reply simulation
            const speech = new SpeechSynthesisUtterance(`जी, मैंने दर्ज कर लिया: ${speechText}`);
            speech.lang = 'hi-IN';
            window.speechSynthesis.speak(speech);

            addEntry(speechText, 'Voice');
        };

        recognition.onerror = () => micBtn.classList.remove('bg-red-700', 'animate-ping');
    }
});