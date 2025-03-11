from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для работы с фронтендом

# Хранение заявок и баланса пользователей (в реальном проекте используйте базу данных)
top_up_requests = []
user_balances = {}

# Обработка заявки на пополнение
@app.route('/submitTopUpRequest', methods=['POST'])
def submit_top_up_request():
    data = request.json
    user_id = data.get('userId')
    username = data.get('username')
    amount = data.get('amount')

    if not user_id or not username or not amount:
        return jsonify({'success': False, 'message': 'Недостаточно данных'}), 400

    # Сохраняем заявку
    top_up_requests.append({'userId': user_id, 'username': username, 'amount': amount})

    # Выводим уведомление (в реальном проекте используйте Telegram Bot API)
    print(f"Новая заявка на пополнение:\n"
          f"Пользователь: @{username}\n"
          f"Сумма: {amount} ₽\n"
          f"User ID: {user_id}")

    return jsonify({'success': True})

# Установка баланса пользователя
@app.route('/setBalance', methods=['POST'])
def set_balance():
    data = request.json
    user_id = data.get('userId')
    amount = data.get('amount')

    if not user_id or not amount:
        return jsonify({'success': False, 'message': 'Недостаточно данных'}), 400

    if user_id not in user_balances:
        user_balances[user_id] = 0

    user_balances[user_id] += amount
    return jsonify({'success': True, 'newBalance': user_balances[user_id]})

if __name__ == '__main__':
    app.run(debug=True)