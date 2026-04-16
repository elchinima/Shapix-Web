FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Backend/Shapix.Api/Shapix.Api.csproj", "Backend/Shapix.Api/"]
RUN dotnet restore "Backend/Shapix.Api/Shapix.Api.csproj"

COPY . .
WORKDIR "/src/Backend/Shapix.Api"
RUN dotnet publish "Shapix.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Shapix.Api.dll"]