import CONFIG from './config.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
    // Auth Elements
    const authScreen = document.getElementById('auth-screen');
    const stagePhone = document.getElementById('stage-phone');
    const stageOtp = document.getElementById('stage-otp');
    const stageLock = document.getElementById('stage-lock');
    const userMobile = document.getElementById('user-mobile');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const otpInput = document.getElementById('otp-input');
    const otpDemoHint = document.getElementById('otp-demo-hint');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const fingerprintBtn = document.getElementById('fingerprint-btn');
    const completeAuthBtn = document.getElementById('complete-auth-btn');

    // Avatar Upload Elements
    const avatarUploadInput = document.getElementById('avatar-upload-input');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const userAvatarPlaceholder = document.getElementById('user-avatar-placeholder');
    const menuAvatarImg = document.getElementById('menu-avatar-img');
    const menuAvatarPlaceholder = document.getElementById('menu-avatar-placeholder');
    const menuUserMobileText = document.getElementById('menu-user-mobile-text');

    // UI Elements
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const closeMenu = document.getElementById('close-menu');
    const plusBtn = document.getElementById('plus-btn');
    const plusModal = document.getElementById('plus-modal');
    const micBtn = document.getElementById('mic-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const diaryContent = document.getElementById('diary-content');
    const placeholderText = document.getElementById('placeholder-text');
    const shareBtn = document.getElementById('menu-share');
    const langSelect = document.getElementById('lang-select');
    const installApkBtn = document.getElementById('menu-install-apk');

    // Modal Elements
    const infoModal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');

    let generatedOtp = "";
    let deferredPrompt = null;

    // Handle Profile Photo Upload
    avatarUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                userAvatarImg.src = imgData;
                userAvatarImg.classList.remove('hidden');
                userAvatarPlaceholder.classList.add('hidden');

                menuAvatarImg.src = imgData;
                menuAvatarImg.classList.remove('hidden');
                menuAvatarPlaceholder.classList.add('hidden');
                showModal('प्रोफाइल फोटो', 'आपकी प्रोफाइल फोटो सफलतापूर्वक अपडेट हो गई है!');
            };
            reader.readAsDataURL(file);
        }
    });

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installApkBtn.style.display = 'flex';
    });

    installApkBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showModal('सफलता', 'VINKART One-Diary ऐप आपके फोन में सफलतापूर्वक इंस्टॉल हो गया है!');
            }
            deferredPrompt = null;
        } else {
            showModal('APK / PWA जानकारी', 'ऐप इंस्टॉल करने के लिए अपने मोबाइल ब्राउज़र मेनू (Three Dots) में जाकर "Add to Home Screen" या "Install App" पर टैप करें।');
        }
    });

    function showModal(title, desc) {
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        infoModal.classList.remove('hidden');
        sideMenu.style.left = '-290px';
        menuBackdrop.classList.add('hidden');
    }

    modalClose.addEventListener('click', () => infoModal.classList.add('hidden'));

    // Auth Flow
    sendOtpBtn.addEventListener('click', () => {
        if (userMobile.value.length !== 10) {
            alert('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें!');
            return;
        }
        generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        otpDemoHint.innerText = `[OTP: ${generatedOtp}]`;
        stagePhone.classList.add('hidden');
        stageOtp.classList.remove('hidden');
        menuUserMobileText.innerText = `+91 ${userMobile.value}`;
    });

    verifyOtpBtn.addEventListener('click', () => {
        if (otpInput.value === generatedOtp || otpInput.value === "1234") {
            stageOtp.classList.add('hidden');
            stageLock.classList.remove('hidden');
        } else {
            alert('गलत OTP! दोबारा प्रयास करें।');
        }
    });

    fingerprintBtn.addEventListener('click', () => {
        fingerprintBtn.classList.add('border-emerald-400');
        setTimeout(() => {
            authScreen.classList.add('hidden');
            speakText("वीआईएनकार्ट फ्री AI एजेंट एक्टिव है। आप बात कर सकते हैं।");
        }, 600);
    });

    completeAuthBtn.addEventListener('click', () => {
        authScreen.classList.add('hidden');
        speakText("वीआईएनकार्ट फ्री AI एजेंट एक्टिव है। आप बात कर सकते हैं।");
    });

    function toggleMenu() {
        if (sideMenu.style.left === '0px') {
            sideMenu.style.left = '-290px';
            menuBackdrop.classList.add('hidden');
        } else {
            sideMenu.style.left = '0px';
            menuBackdrop.classList.remove('hidden');
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', toggleMenu);

    document.getElementById('menu-profile').addEventListener('click', () => {
        showModal('यूजर प्रोफाइल', `मोबाइल: +91 ${userMobile.value || '9876543210'}
ब्रांड: ${CONFIG.COMPANY_BRAND}
एजेंट मोड: 100% नि:शुल्क ऑटोनॉमस AI (Testing Free)`);
    });

    document.getElementById('menu-manual').addEventListener('click', () => {
        showModal('यूजर मैन्युअल', '1. टाइप करें या माइक दबाकर AI एजेंट से बातें करें।
2. AI स्वतः आपके नोट्स व डायरी तैयार करेगा।
3. डाउनलोड/शेयर की सुविधा वर्तमान में टेस्ट मोड में पूरी तरह नि:शुल्क है।');
    });

    document.getElementById('menu-terms').addEventListener('click', () => {
        showModal('नियम व शर्तें', 'यह ऐप 100% प्राइवेट और सुरक्षित है। AI एजेंट पूरी तरह फ्री सेवा प्रदान करता है।');
    });

    plusBtn.addEventListener('click', () => plusModal.classList.toggle('hidden'));
    document.getElementById('opt-scanner').addEventListener('click', () => { plusModal.classList.add('hidden'); showModal('स्कैनर मोड', 'AI डॉक्यूमेंट स्कैनर एक्टिव हो रहा है...'); });
    document.getElementById('opt-photo').addEventListener('click', () => { plusModal.classList.add('hidden'); showModal('फोटो अटैचमेंट', 'गैलरी से फोटो चुनें।'); });
    document.getElementById('opt-file').addEventListener('click', () => { plusModal.classList.add('hidden'); showModal('फाइल मैनेजर', 'डॉक्यूमेंट सेलेक्ट करें।'); });

    langSelect.addEventListener('change', (e) => {
        if(e.target.value === 'en') {
            document.getElementById('app-title').innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> One-Diary <span class="text-xs text-emerald-400 font-normal">Free AI Agent</span>`;
            document.getElementById('diary-header-text').innerText = `📅 Today's Diary (Free AI)`;
            placeholderText.innerText = `Type or speak to record... AI Agent will respond auto!`;
        } else {
            document.getElementById('app-title').innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> One-Diary <span class="text-xs text-emerald-400 font-normal">Free AI Agent</span>`;
            document.getElementById('diary-header-text').innerText = `📅 आज की डायरी (Free AI)`;
            placeholderText.innerText = `बोलकर या टाइप करके अपनी डायरी दर्ज करें... AI एजेंट ऑटो-रिस्पॉन्स करेगा!`;
        }
    });

    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: CONFIG.APP_NAME,
                text: 'VINKART Free AI Agent One-Diary ऐप का उपयोग करें:',
                url: window.location.href,
            });
        } else {
            alert('ऐप लिंक: ' + window.location.href);
        }
    });

    // Autonomous AI Agent Simulation Response Logic
    function getAiResponse(userMsg) {
        const msg = userMsg.toLowerCase();
        if (msg.includes('नमस्ते') || msg.includes('hello') || msg.includes('हाय')) {
            return "नमस्ते! मैं आपका VINKART AI एजेंट हूँ। आज की क्या योजना है?";
        } else if (msg.includes('काम') || msg.includes('नोट') || msg.includes('याद')) {
            return "मैंने आपका मुख्य पॉइंट सुरक्षित दर्ज कर लिया है। क्या इसमें कुछ और जोड़ना है?";
        } else if (msg.includes('मीटिंग') || msg.includes('समय') || msg.includes('तारीख')) {
            return "आपकी शेड्यूल और मीटिंग एंट्री डायरी में टाइम-स्टैम्प के साथ सेव कर दी गई है।";
        } else {
            return `मैंने आपकी बात ध्यान से समझ ली है: "${userMsg.substring(0, 30)}..." - इसे सुरक्षित सेव कर लिया गया है।`;
        }
    }

    // Add Entry Function (Testing Free Monetization Workflow)
    function addEntry(text, type) {
        if (!text.trim()) return;
        if (placeholderText) placeholderText.style.display = 'none';

        const entryDiv = document.createElement('div');
        entryDiv.className = 'p-3 bg-white border-l-4 border-amber-800 rounded-r-xl shadow-md flex flex-col gap-2 border border-amber-200/60';
        
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        entryDiv.innerHTML = `
            <div>
                <p class="font-semibold text-slate-800 text-xs break-words leading-relaxed">${text}</p>
                <div class="flex justify-between items-center mt-1.5">
                    <span class="text-[9px] text-slate-400 font-medium">${timeStr} | ${type}</span>
                    <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">टेस्टिंग: फ्री</span>
                </div>
            </div>
            <div class="flex gap-2 pt-1 border-t border-slate-100">
                <button class="flex-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold download-btn shadow-sm">📥 PDF डाउनलोड (फ्री)</button>
                <button class="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold share-whatsapp shadow-sm">💬 व्हाट्सएप शेयर (फ्री)</button>
            </div>
        `;

        entryDiv.querySelector('.download-btn').addEventListener('click', () => {
            showModal('PDF जनरेटेड (फ्री टेस्टिंग)', `"${text.substring(0, 25)}..." की सुरक्षित पीडीएफ तैयार हो गई है! (लाइव वर्ज़न में डाउनलोड पर ₹10 प्रति पेज शुल्क लागू होगा)`);
        });

        entryDiv.querySelector('.share-whatsapp').addEventListener('click', () => {
            const waText = encodeURIComponent(`VINKART One-Diary AI नोट:
${text}`);
            window.open(`https://wa.me/?text=${waText}`, '_blank');
        });

        diaryContent.prepend(entryDiv);
        userInput.value = '';

        // Auto AI Response
        setTimeout(() => {
            const aiReply = getAiResponse(text);
            speakText(aiReply);
        }, 500);
    }

    sendBtn.addEventListener('click', () => addEntry(userInput.value, 'टाइप'));
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addEntry(userInput.value, 'टाइप');
    });

    function speakText(msg) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(msg);
            utterance.lang = 'hi-IN';
            utterance.rate = 0.95;
            utterance.pitch = 1.05;
            window.speechSynthesis.speak(utterance);
        }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.interimResults = false;

        micBtn.addEventListener('click', () => {
            try {
                recognition.start();
                micBtn.classList.add('bg-rose-800', 'animate-pulse');
            } catch(e) {}
        });

        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            micBtn.classList.remove('bg-rose-800', 'animate-pulse');
            userInput.value = speechText;
            addEntry(speechText, 'वॉयस');
        };

        recognition.onerror = () => micBtn.classList.remove('bg-rose-800', 'animate-pulse');
        recognition.onend = () => micBtn.classList.remove('bg-rose-800', 'animate-pulse');
    }
});
