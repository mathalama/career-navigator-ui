# AI-based Career Navigator — Frontend (MVP)

Короткая инструкция по локальному запуску и дальнейшей интеграции с бэкендом на Spring.

Запуск (варианты):

- Открыть локально в браузере (быстрий старт):

  В Проводнике дважды кликните `index.html` или в PowerShell выполните:

  ```powershell
  start .\index.html
  ```

- Запуск через простой HTTP-сервер (рекомендуется для корректной работы fetch и роутинга):

  Если установлен Python:

  ```powershell
  python -m http.server 5173
  ```

  Или через `http-server` (Node.js):

  ```powershell
  npx http-server -c-1 . -p 5173
  ```

Ожидаемые API (шаблон, бэкенд на Spring реализует эти эндпоинты):

- `POST /api/login` — вход пользователя
- `GET /api/profile` — получение профиля
- `POST /api/profile` — обновление профиля
- `GET /api/recommendations` — рекомендации профессий/курсов
- `GET /api/jobs` — список вакансий
- `GET /api/mentors` — список менторов
- `GET /api/cases` — каталог кейсов

Файлы проекта:

- `index.html` — корневой файл, подключает Tailwind через CDN и `src/app.js`.
- `src/app.js` — простая hash-based SPA, компоненты UI и заглушки данных.

Дальше можно:

- Подключить Tailwind через PostCSS/webpack/Vite для production-сборки.
- Привязать формы и действия к реальным REST-эндпоинтам Spring.
- Добавить аутентификацию (JWT / сессии) и хранение состояния на клиенте.

Если хотите, я могу:

- Добавить готовые fetch-вызовы к конкретным эндпоинтам Spring (подскажите URL).
- Переписать на React/Vue при пожелании.
- Настроить сборку и dev-server (Vite).
