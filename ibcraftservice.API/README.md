- Чтобы преминить миграции:
```bash
dotnet ef database update -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```

- Чтобы создать миграцию:
```bash
dotnet ef migrations add <name migrations> -s .\ibcraftservice\ -p .\Ibcraft.DataAccess\
```