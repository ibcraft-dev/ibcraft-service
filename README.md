# IB-Craft Service

Backend на ASP.NET Core 8 + PostgreSQL и frontend на Next.js.

## Быстрый запуск через Docker

Для разработки удобнее использовать `docker-compose.dev.yml`: он поднимает PostgreSQL, backend через `dotnet watch` и frontend через `npm run dev`.

```powershell
docker compose -f docker-compose.dev.yml up --build
```

Адреса:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Swagger в Development: `http://localhost:8080/swagger`
- PostgreSQL: `localhost:5432`

Остановить контейнеры:

```powershell
docker compose -f docker-compose.dev.yml down
```

Остановить и удалить dev-volume с базой:

```powershell
docker compose -f docker-compose.dev.yml down -v
```

## Настройка внешней авторизации

Скопируй `.env.dev.example` в `.env.dev` и заполни ключи провайдеров:

```text
Authentication__Google__ClientId=
Authentication__Google__ClientSecret=
Authentication__Discord__ClientId=
Authentication__Discord__ClientSecret=
Authentication__Telegram__BotToken=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_SERVER_URL_HTTP=http://localhost:8080
```

### Google

1. Открой Google Cloud Console: `https://console.cloud.google.com/`
2. Создай проект или выбери существующий.
3. Перейди в `APIs & Services` -> `OAuth consent screen` и настрой экран согласия.
4. Перейди в `Credentials` -> `Create credentials` -> `OAuth client ID`.
5. Тип приложения: `Web application`.
6. В `Authorized redirect URIs` добавь:

```text
http://localhost:8080/api/auth/google/callback
```

Для проверки через ngrok добавь еще:

```text
https://your-backend.ngrok-free.dev/api/auth/google/callback
```

После создания скопируй `Client ID` и `Client secret` в `.env.dev`.

### Discord

1. Открой Discord Developer Portal: `https://discord.com/developers/applications`
2. Создай приложение.
3. Перейди в `OAuth2`.
4. Скопируй `Client ID` и `Client Secret` в `.env.dev`.
5. В `Redirects` добавь:

```text
http://localhost:8080/api/auth/discord/callback
```

Для проверки через ngrok добавь еще:

```text
https://your-backend.ngrok-free.dev/api/auth/discord/callback
```

### Telegram

Токен берется у BotFather:

1. Открой Telegram и найди `@BotFather`.
2. Выполни `/newbot`.
3. Укажи имя и username бота.
4. BotFather выдаст token. Его нужно вставить в:

```text
Authentication__Telegram__BotToken=
```

Username бота без `@` вставь в:

```text
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
```

Проверять Telegram-авторизацию нужно через публичный HTTPS-домен, например через ngrok. Telegram Login Widget не работает нормально с обычным `localhost`, потому что виджет и callback должны открываться с доступного Telegram домена.

Пример:

```powershell
ngrok http 3000
ngrok http 8080
```

После этого в `.env.dev` укажи публичные адреса:

```text
NEXT_PUBLIC_SERVER_URL_HTTP=https://your-backend.ngrok-free.dev
Cors__Origins__0=http://localhost:3000
Cors__Origins__1=https://your-frontend.ngrok-free.dev
```

В BotFather для бота выполни `/setdomain` и укажи frontend-домен ngrok:

```text
your-frontend.ngrok-free.dev
```

После смены `.env.dev` перезапусти dev-контейнеры:

```powershell
docker compose -f docker-compose.dev.yml up --build
```

## Создание администратора

Пароль должен соответствовать правилам Identity: минимум 8 символов, заглавная буква, строчная буква, цифра и спецсимвол.

Пример пароля: `Dragofoxcute1!`

### Если запущен `docker-compose.dev.yml`

```powershell
docker compose -f docker-compose.dev.yml exec backend_ibcraft dotnet run --project ibcraftservice/ibcraft.API.csproj -- --create-admin --email admin@example.com --password "Dragofoxcute1!" --nickname admin
```

Можно через переменные окружения:

```powershell
docker compose -f docker-compose.dev.yml exec `
  -e ADMIN_EMAIL=admin@example.com `
  -e ADMIN_PASSWORD="Dragofoxcute1!" `
  -e ADMIN_NICKNAME=admin `
  backend_ibcraft dotnet run --project ibcraftservice/ibcraft.API.csproj -- --create-admin
```

### Если запущен обычный `docker-compose.yml`

В production-образе опубликованный dll запускается как `ibcraftservice.dll`.

```powershell
docker compose exec backend_ibcraft dotnet ibcraftservice.dll --create-admin --email admin@example.com --password "Dragofoxcute1!" --nickname admin
```

Через переменные окружения:

```powershell
docker compose exec `
  -e ADMIN_EMAIL=admin@example.com `
  -e ADMIN_PASSWORD="Dragofoxcute1!" `
  -e ADMIN_NICKNAME=admin `
  backend_ibcraft dotnet ibcraftservice.dll --create-admin
```

После создания админа вход в админку:

```text
http://localhost:3000/admin/login
```

Админка защищена ролью `Admin`. Авторизация сайта и админки используют общий cookie `ACCESS_TOKEN`; доступ в админку определяется ролью пользователя.

## Запуск без Docker

Нужны:

- .NET SDK 8
- Node.js 20+
- PostgreSQL

### Backend

Укажи строку подключения в `ibcraftservice/appsettings.json` или через переменную окружения:

```powershell
$env:ConnectionStrings__IbCraftDbContext="Host=localhost;Port=5432;Username=postgres;Password=dragondev;Database=ibcraftdata;Include Error Detail=True;"
```

Применить миграции:

```powershell
dotnet ef database update -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```

Запустить backend:

```powershell
dotnet run --project .\ibcraftservice\ibcraft.API.csproj -- --migrate
```

Backend будет доступен на порту из профиля/настроек. Для локальной разработки обычно используется:

```text
http://localhost:8080
```

Создать админа без Docker:

```powershell
dotnet run --project .\ibcraftservice\ibcraft.API.csproj -- --create-admin --email admin@example.com --password "Dragofoxcute1!" --nickname admin
```

### Frontend

В отдельном терминале:

```powershell
cd .\Ibcraft.UI
npm install
$env:NEXT_PUBLIC_SERVER_URL_HTTP="http://localhost:8080"
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Миграции

Создать новую миграцию:

```powershell
dotnet ef migrations add <MigrationName> -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```

Применить миграции:

```powershell
dotnet ef database update -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```

## Полезные Docker-команды

Посмотреть запущенные сервисы:

```powershell
docker compose ps
docker compose -f docker-compose.dev.yml ps
```

Логи backend:

```powershell
docker compose -f docker-compose.dev.yml logs -f backend_ibcraft
```

Логи frontend:

```powershell
docker compose -f docker-compose.dev.yml logs -f frontend_ibcraft
```

Открыть shell backend-контейнера:

```powershell
docker compose -f docker-compose.dev.yml exec backend_ibcraft sh
```

Открыть psql в контейнере PostgreSQL:

```powershell
docker compose -f docker-compose.dev.yml exec db_ibcraft psql -U postgres -d ibcraftdata
```
