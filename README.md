# Бэкенд для сайта IBCraft
Написаный на DOTNET 8.0 на ASP.NET

## Обычный запуск для теста

В директории 
```

```

## Деплой через докер



- Чтобы преминить миграции:
```bash
dotnet ef database update -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```

- Чтобы создать миграцию:
```bash
dotnet ef migrations add <name migrations> -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```