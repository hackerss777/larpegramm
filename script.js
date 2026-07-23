// ===== ДАННЫЕ =====
const chats = {
    1: { name: 'Алексей', avatar: 'А', messages: [
        { text: 'Привет! Как дела?', time: '12:28', from: 'them' },
        { text: 'Всё отлично! А у тебя?', time: '12:29', from: 'me' },
        { text: 'Тоже хорошо. Есть новости по проекту?', time: '12:30', from: 'them' }
    ]},
    2: { name: 'Марина', avatar: 'М', messages: [
        { text: 'Скинь фото с вчерашнего', time: '11:15', from: 'them' }
    ]},
    3: { name: 'Дмитрий', avatar: 'Д', messages: [
        { text: 'Завтра встреча в 10:00', time: 'Вчера', from: 'them' }
    ]},
    4: { name: 'Анна', avatar: 'А', messages: [
        { text: 'Спасибо за помощь!', time: 'Вчера', from: 'them' }
    ]}
};

// ===== СОСТОЯНИЕ =====
let currentChatId = 1;
let coins = 1000;
let hasPrime = false;

// ===== DOM =====
const messagesContainer = document.getElementById('messages');
const chatName = document.getElementById('chatName');
const chatAvatar = document.getElementById('chatAvatar');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const coinCount = document.getElementById('coinCount');
const shopOverlay = document.getElementById('shopOverlay');
const shopCloseBtn = document.getElementById('shopCloseBtn');
const shopToggleBtn = document.getElementById('shopToggleBtn');
const shopCoinBalance = document.getElementById('shopCoinBalance');
const buyPrimeBtn = document.getElementById('buyPrimeBtn');
const primeStatus = document.getElementById('primeStatus');
const primeCard = document.getElementById('primeCard');

// ===== ОТРИСОВКА ЧАТА =====
function renderMessages(chatId) {
    const chat = chats[chatId];
    if (!chat) return;
    chatName.textContent = chat.name;
    chatAvatar.textContent = chat.avatar;
    messagesContainer.innerHTML = '';
    chat.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `msg ${msg.from === 'me' ? 'mine' : ''}`;
        div.innerHTML = `${msg.text} <span class="time">${msg.time}</span>`;
        if (msg.from === 'me') {
            div.innerHTML += `<span class="encrypted">🔒 зашифровано</span>`;
        }
        messagesContainer.appendChild(div);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== ДОБАВЛЕНИЕ СООБЩЕНИЯ =====
function addMessage(text, from = 'me') {
    const chat = chats[currentChatId];
    if (!chat) return;
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    chat.messages.push({ text, time, from });
    renderMessages(currentChatId);
}

// ===== ОБНОВЛЕНИЕ МОНЕТ В UI =====
function updateCoinsUI() {
    coinCount.textContent = coins;
    shopCoinBalance.textContent = coins;
    if (hasPrime) {
        primeStatus.textContent = '✅ Активен';
        primeStatus.className = 'prime-status active';
        primeCard.classList.add('purchased');
        buyPrimeBtn.textContent = '✅ Куплен';
        buyPrimeBtn.disabled = true;
        buyPrimeBtn.style.opacity = '0.6';
        buyPrimeBtn.style.cursor = 'default';
    }
}

// ===== ПОКУПКА ПРАЙМА =====
function buyPrime() {
    if (hasPrime) {
        alert('👑 Прайм уже активен!');
        return;
    }
    if (coins < 499) {
        alert('❌ Недостаточно LarpeCoin! Нужно 499 🪙');
        return;
    }
    if (confirm('Купить Прайм за 499 LarpeCoin?')) {
        coins -= 499;
        hasPrime = true;
        updateCoinsUI();
        alert('🎉 Поздравляем! Прайм активирован!');
        // Даём скидку в будущем
    }
}

// ===== ОТКРЫТЬ/ЗАКРЫТЬ МАГАЗИН =====
function openShop() {
    shopOverlay.classList.add('active');
    updateCoinsUI();
}

function closeShop() {
    shopOverlay.classList.remove('active');
}

// ===== СОБЫТИЯ =====
sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (!text) return;
    addMessage(text, 'me');
    messageInput.value = '';
    setTimeout(() => {
        const replies = ['Сообщение получено!', 'Понял!', 'Ок!', 'Спасибо!'];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(reply, 'them');
    }, 800 + Math.random() * 600);
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// Переключение чатов
document.querySelectorAll('.chat-item').forEach(el => {
    el.addEventListener('click', function() {
        document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentChatId = parseInt(this.dataset.id);
        renderMessages(currentChatId);
    });
});

// Магазин
shopToggleBtn.addEventListener('click', openShop);
shopCloseBtn.addEventListener('click', closeShop);
shopOverlay.addEventListener('click', (e) => {
    if (e.target === shopOverlay) closeShop();
});
buyPrimeBtn.addEventListener('click', buyPrime);

// Инициализация
renderMessages(1);
updateCoinsUI();
