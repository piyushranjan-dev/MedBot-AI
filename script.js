// Enhanced mock database for demo purposes
const diseases = [
    {
        id: 1,
        name: 'Diabetes Mellitus Type 2',
        icd11_code: '5A11',
        namaste_code: 'NM101',
        description: 'A metabolic disorder characterized by high blood sugar and insulin resistance',
        symptoms: 'Increased thirst, frequent urination, hunger, fatigue, blurred vision',
        treatments: 'Lifestyle changes, oral medications, insulin therapy',
        risk_factors: 'Family history, obesity, sedentary lifestyle, age'
    },
    {
        id: 2,
        name: 'Hypertension',
        icd11_code: 'BA00',
        namaste_code: 'NM202',
        description: 'A condition in which the force of the blood against artery walls is too high',
        symptoms: 'Headaches, shortness of breath, nosebleeds, flushing, dizziness',
        treatments: 'Dietary changes, exercise, medication (ACE inhibitors, diuretics)',
        risk_factors: 'Age, family history, obesity, high salt intake, stress'
    },
    {
        id: 3,
        name: 'Asthma',
        icd11_code: 'CA23',
        namaste_code: 'NM305',
        description: 'A condition in which airways narrow and swell, producing extra mucus',
        symptoms: 'Shortness of breath, chest tightness, wheezing, coughing',
        treatments: 'Inhalers, corticosteroids, leukotriene modifiers',
        risk_factors: 'Genetic factors, allergies, environmental exposures'
    },
    {
        id: 4,
        name: 'Migraine',
        icd11_code: '8A80',
        namaste_code: 'NM410',
        description: 'A neurological condition characterized by intense, debilitating headaches',
        symptoms: 'Throbbing pain, sensitivity to light and sound, nausea, aura',
        treatments: 'Pain-relieving medications, preventive medications, lifestyle changes',
        risk_factors: 'Family history, age, gender (more common in women), hormonal changes'
    }
];

const symptomsDatabase = {
    'headache': {
        common_causes: ['Tension', 'Migraine', 'Dehydration', 'Sinus congestion', 'Eye strain'],
        serious_causes: ['Meningitis', 'Stroke', 'Brain tumor', 'Aneurysm'],
        when_to_worry: 'If sudden and severe, accompanied by fever, confusion, vision changes, or difficulty speaking'
    },
    'fever': {
        common_causes: ['Viral infection', 'Bacterial infection', 'Inflammatory conditions'],
        serious_causes: ['Sepsis', 'Meningitis', 'COVID-19', 'Pneumonia'],
        when_to_worry: 'If above 103°F (39.4°C), lasting more than 3 days, or accompanied by rash, difficulty breathing, or severe pain'
    },
    'chest pain': {
        common_causes: ['Heartburn', 'Muscle strain', 'Anxiety', 'Respiratory infections'],
        serious_causes: ['Heart attack', 'Pulmonary embolism', 'Aortic dissection', 'Pneumonia'],
        when_to_worry: 'If crushing or squeezing, radiates to arm/jaw, accompanied by shortness of breath, nausea, or sweating'
    }
};

let currentSessionId = Math.floor(Math.random() * 1000);
let messageHistory = [];

// Utility to add message to chat
function addMessage(role, content) {
    const chatInterface = document.getElementById('chatInterface');
    if (!chatInterface) return;

    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role === 'user' ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<strong>${role === 'user' ? 'You' : 'MedBot AI'}:</strong> ${content} <span class="message-timestamp">${timestamp}</span>`;
    chatInterface.appendChild(messageDiv);
    chatInterface.scrollTop = chatInterface.scrollHeight;
}

// Generate a basic AI-like response using local rules
function generateAIResponse(userText) {
    const text = userText.toLowerCase();

    // Disease info
    for (const disease of diseases) {
        if (text.includes(disease.name.toLowerCase().split(' ')[0])) {
            return `
                <div class="disease-card">
                    <div class="disease-code">${disease.icd11_code} • ${disease.namaste_code}</div>
                    <strong>${disease.name}</strong><br>
                    <strong>Description:</strong> ${disease.description}<br>
                    <strong>Common symptoms:</strong> ${disease.symptoms}<br>
                    <strong>Possible treatments:</strong> ${disease.treatments}<br>
                    <strong>Risk factors:</strong> ${disease.risk_factors}<br>
                    <em>Note: This is educational information, not a diagnosis.</em>
                </div>
            `;
        }
    }

    // Symptom patterns
    for (const key of Object.keys(symptomsDatabase)) {
        if (text.includes(key)) {
            const info = symptomsDatabase[key];
            return `
                <strong>About ${key}:</strong><br>
                Common causes: ${info.common_causes.join(', ')}.<br>
                Serious possible causes: ${info.serious_causes.join(', ')}.<br>
                When to seek urgent care: ${info.when_to_worry}.<br>
                <em>Please consult a doctor for a proper evaluation.</em>
            `;
        }
    }

    // NAMASTE / ICD / standards queries
    if (text.includes('namaste')) {
        return `The NAMASTE standard is an Indian initiative that integrates traditional medicine systems (like Ayurveda) with digital health records and standards, enabling structured, interoperable documentation of traditional diagnoses and treatments alongside modern medical data.`;
    }
    if (text.includes('icd-11') || text.includes('icd11') || text.includes('icd')) {
        return `ICD-11 is the World Health Organization's International Classification of Diseases, 11th revision. It provides standardized codes for diseases and related health conditions, supporting accurate reporting, research, and healthcare analytics. MedBot AI conceptually maps conditions to ICD-11 (including TM2 for traditional medicine) to keep information structured and consistent.`;
    }

    // Generic health question fallback
    return `I have noted your question. Based on your description, multiple causes are possible. Focus on: what symptoms you have, how long they've been present, how severe they are, and any red-flag signs (severe pain, breathing difficulty, confusion, chest pain, or sudden worsening). Please contact a healthcare professional for an exact diagnosis.`;
}

// Send message from input
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const chatInterface = document.getElementById('chatInterface');
    if (!input || !chatInterface) return;

    const text = input.value.trim();
    if (!text) return;

    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messageHistory.push({ role: 'user', content: text, timestamp });

    // User message
    addMessage('user', text);
    input.value = '';

    // Typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message';
    typingIndicator.id = 'typingIndicator';
    typingIndicator.innerHTML = `
        <strong>MedBot AI:</strong>
        <span class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </span>
    `;
    chatInterface.appendChild(typingIndicator);
    chatInterface.scrollTop = chatInterface.scrollHeight;

    // Simulate delay
    await new Promise(res => setTimeout(res, 900));

    // Remove typing
    const ti = document.getElementById('typingIndicator');
    if (ti) ti.remove();

    const replyHtml = generateAIResponse(text);
    const timestampBot = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messageHistory.push({ role: 'assistant', content: replyHtml, timestamp: timestampBot });

    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    botMessage.innerHTML = `<strong>MedBot AI:</strong> ${replyHtml} <span class="message-timestamp">${timestampBot}</span>`;
    chatInterface.appendChild(botMessage);
    chatInterface.scrollTop = chatInterface.scrollHeight;
}

// Quick question chips
function quickQuestion(text) {
    const input = document.getElementById('messageInput');
    if (!input) return;
    input.value = text;
    sendMessage();
}

// Reset chat
function resetChat() {
    const chatInterface = document.getElementById('chatInterface');
    if (!chatInterface) return;
    chatInterface.innerHTML = `
        <div class="message bot-message">
            <strong>MedBot AI:</strong> Hello! I'm your AI healthcare assistant. I can help you understand diseases, symptoms, and provide health information using integrated NAMASTE and ICD-11 standards. How can I help you today?
            <span class="message-timestamp">Just now</span>
        </div>
    `;
    messageHistory = [];
    currentSessionId = Math.floor(Math.random() * 1000);
}

// Simple rotating health tips (optional if you had them in original)
const healthTips = [
    'Stay hydrated: drink water regularly throughout the day.',
    'Get at least 7–8 hours of sleep for better immunity.',
    'Regular exercise helps control blood pressure and blood sugar.',
    'Avoid self-medication with antibiotics; always consult a doctor.',
    'Monitor chronic conditions (like diabetes or hypertension) regularly.'
];
let healthTipIndex = 0;

function rotateHealthTips() {
    // You can attach this to some UI element if you want, e.g., a banner.
    healthTipIndex = (healthTipIndex + 1) % healthTips.length;
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            if (navLinks) navLinks.classList.remove('active');
        }
    });

    // Reset button
    const resetBtn = document.getElementById('resetChatBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetChat);
    }

    // CTA buttons (WhatsApp/SMS)
    document.querySelectorAll('.platform-cta').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('In a real implementation, this would connect to the WhatsApp Business API or an SMS gateway service.');
        });
    });

    // Allow Enter key to send
    const input = document.getElementById('messageInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Optionally rotate tips every few seconds
    setInterval(rotateHealthTips, 5000);
});
