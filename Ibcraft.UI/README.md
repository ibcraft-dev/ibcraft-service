# Информация
**Это фронтенд проекта сервера по minecraft Ib-Craft**

## Что готово:
**Домашная страница:** сделана на 100% | возможно будет дополнятся контентом ✅

**Страница с правилами:** используется заглушка виде md файла которая конвертируется рендерится в html, ~~ну это как вкондрате php конвертируют в плюсы~~ | Возможно будет переписана либо будем поднимать какой нибуть gitbook

**Страница как играть:** Там яйцо Ильи, потому что он мне написал тз для этой страницы 

## В разработке
**Админ панель:**

    - Статистика заявок: 50 на 50 готова, есть проблемы с адаптацией под мобилы...
    - Страница оповищений: лучше делать не страницей, а не большим окошком, но пока что делано страницей
    - Вкладки с заявками: 50 на 50 готова, есть не большие проблемы с адаптацией под мобилы...
    - Вкладка с настройками сайта, и модальние окна с информацией: И да и нет
    - не связана со серверной частью
    
**Страница логинки и регистрации юзера:** сделана на 100% ✅ (не забыть добавить капцу) + связана с серверной частью

**Страница профилия юзера:** лучше переделать...

**Страница подачи заявки:** сделана на 100% ✅ + связана с серверной частью

## Getting Started

Запуск dev сервер, перед тем как запускать нужно скачать зависимости `npm i`:

```bash
npm run dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on doker

1. Для начала редактируем `nginx.conf` меняем домен и настриваем HTTPS

```
server {
    listen 80; # для HTTP
    #listen 443 ssl; # для HTTPS
    server_name your-domain.com; # <-- Замените на ваш домен

    # SSL настройки (раскомментируйте для HTTPS)
    # ssl_certificate /etc/nginx/certs/selfsigned.crt;
    # ssl_certificate_key /etc/nginx/certs/selfsigned.key;

    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_prefer_server_ciphers on;


    # Корень для статических файлов (если нужны)
    location /_next/ {
        proxy_pass http://ibcraft-app:3000/_next/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Перенаправления для социальных ссылок
    location /telegram_bot {
        return 301 https://t.me/your_bot_username; 
    }
    location /discord {
        return 301 https://discord.com/your_discord_link; 
    }
    location /vk {
        return 301 https://vk.com/your_vk_link; 
    }
    location /modpack {
        return 301 https://link_to_your_modpack; 
    }
    location /telegram {
        return 301 https://t.me/your_telegram_link; 
    }

    location / {
        proxy_pass http://ibcraft-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Дальше редактируем `docker-compose.yml`
```
version: '3'
services:
  ibcraft-app:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_DEVMODE=production
    restart: always

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      # - "443:443" # Раскомментировать для HTTPS
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./.next/static:/app/.next/static:ro  
      # - ./certbot/www:/var/www/certbot # Раскомментировать для HTTPS
      # - ./certbot/conf:/etc/letsencrypt # Раскомментировать для HTTPS
    depends_on:
      - ibcraft-app 
    restart: always
```

3. Выполнить `docker-compose up -d` или `docker compose up -d`
