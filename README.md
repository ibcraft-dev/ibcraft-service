# Бэкенд для сайта IBCraft
Написаный на DOTNET 8.0 на ASP.NET

## Обычный запуск для теста

В директории 
```

```

## Деплой через докер

```bash
sudo docker compose -f docker-compose.dev.yml up
```

- Чтобы преминить миграции:
```bash
dotnet ef database update -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```

- Чтобы создать миграцию:
```bash
dotnet ef migrations add <name migrations> -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```
