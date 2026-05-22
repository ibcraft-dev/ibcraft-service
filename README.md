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
