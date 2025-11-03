FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

COPY *.sln .
COPY Ibcraft.Application/*.csproj Ibcraft.Application/
COPY Ibcraft.Core/*.csproj Ibcraft.Core/
COPY Ibcraft.DataAccess/*.csproj Ibcraft.DataAccess/
COPY Ibcraft.Infrastructure/*.csproj Ibcraft.Infrastructure/
COPY ibcraftservice/*.csproj ibcraftservice/

RUN dotnet restore
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"
COPY . ./

RUN dotnet publish ibcraftservice/ibcraftservice.csproj -c Release -o /app/publish
RUN dotnet ef database update -s ./ibcraftservice/ -p ./Ibcraft.DataAccess/

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5185


ENTRYPOINT ["dotnet", "ibcraftservice.dll"]