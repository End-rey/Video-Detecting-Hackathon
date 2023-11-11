# ЛЦТ Хакатон =)

## Backend 
### Выполнен с помощью FastAPI. Есть такие endpoints:
 - POST: /api/video - загрузка видео и обработка его с помощью моделей
 - GET: /api/video - получение обработанного видео 
 - GET: /api/video/image - получение всех кадров с подозрительными людьми
 - POST: /api/train - дообучение модели машинного обучения
 - ws://localhost:8000/api/camera - WebSocket соединение, в котором идет подключение к камере по rtsp ссылке и обработка стрима с помощью моделей
Документация по /api/docs

### Запуск сервера backend:
1. В папке ./backend настраивается virtual env
2. Устанавливаются зависимости:
```cmd
pip install -r .\requirements.txt
```
3. Запуск сервера:
```cmd
py main.py
```
Сервер будет доступен по адресу http://localhost:8000/

