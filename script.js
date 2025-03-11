// Баланс пользователя (синхронизируется через localStorage)
let userBalance = parseInt(localStorage.getItem('userBalance')) || 0; // Начальный баланс 0
let selectedServer = '';
let selectedAmount = 0;
let selectedPrice = 0;

// Функция для обновления баланса на странице
function updateBalance() {
    document.getElementById('balance').textContent = userBalance.toLocaleString();
    localStorage.setItem('userBalance', userBalance); // Сохраняем баланс в localStorage
}

// Функция для открытия модального окна пополнения баланса
function openTopUpModal() {
    document.getElementById('topUpModal').style.display = 'flex';
}

// Функция для закрытия модального окна
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Функция для отправки заявки на пополнение баланса
async function submitTopUpRequest() {
    const amount = parseInt(document.getElementById('amount').value);
    const username = document.getElementById('username').value.trim();
    const userId = Telegram.WebApp.initDataUnsafe.user?.id; // ID пользователя в Telegram

    // Проверка введенных данных
    if (!amount || amount < 1) {
        alert('Введите корректную сумму.');
        return;
    }

    if (!username) {
        alert('Введите ваш Telegram username.');
        return;
    }

    // Отправляем заявку на сервер
    try {
        const response = await fetch('https://your-app.vercel.app/submitTopUpRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, username, amount }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Заявка отправлена. Ожидайте подтверждения платежа.');
            closeModal('topUpModal'); // Закрываем модальное окно
        } else {
            alert('Ошибка при отправке заявки.');
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        alert('Произошла ошибка при отправке заявки.');
    }
}

// Функция для выбора сервера
function selectServer(server) {
    selectedServer = server;
    localStorage.setItem('selectedServer', server);
    window.location.href = 'purchase.html'; // Перенаправляем на страницу покупки
}

// Функция для выбора количества виртов
function selectAmount(amount, price) {
    selectedAmount = amount;
    selectedPrice = price;
    document.getElementById('selected-amount').textContent = amount.toLocaleString();
    document.getElementById('selected-price').textContent = price;
    document.getElementById('selected-amount-info').style.display = 'block'; // Показываем блок
}

// Функция для обработки оплаты
function processPayment() {
    if (selectedAmount === 0 || selectedPrice === 0) {
        showNotification('Выберите количество виртов');
        return;
    }

    // Показываем окно подтверждения оплаты
    openModal('confirmPaymentModal');
}

// Функция для подтверждения оплаты
function confirmPayment() {
    if (userBalance >= selectedPrice) {
        userBalance -= selectedPrice;
        updateBalance();
        closeModal('confirmPaymentModal');
        showNotification('Покупка оплачена. Скоро с вами свяжется продавец.');
    } else {
        closeModal('confirmPaymentModal');
        showNotification('Недостаточно средств.');
    }
}

// Функция для показа уведомления
function showNotification(message) {
    document.getElementById('notificationText').textContent = message;
    openModal('notificationModal');
}

// Инициализация Telegram Mini Apps
Telegram.WebApp.ready();

// Загрузка данных при открытии страницы
window.onload = function () {
    updateBalance(); // Обновляем баланс при загрузке страницы
};