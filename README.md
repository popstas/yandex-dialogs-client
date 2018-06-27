# yandex-dialogs-client

Клиент для работы с навыками Яндекс.Диалогов Алисы локально.

![demo](/static/demo.gif)

Клиент тестировался только в Яндекс.Браузере.

Идея была в том, чтобы написать реализацию, умеющую работать с навыками Яндекс.Диалогов без изменения.
Клиент использует тот же протокол, что и Яндекс.Диалоги с ограничениями (см. ниже).

## Зачем это может быть нужно:
- Тестирование навыков
- Запуск навыков локально

## Возможности
- Голосовой ввод через браузерный Speech API
- Вывод вопросов и ответов
- `session.session_id` хранится в sessionStorage
- `session.user_id` хранится в localStorage, то есть каждый браузер считается новым юзером

## Ограничения
- На данный момент можно привязать только один навык

## Чего нет
- `request.type` есть только `SimpleUtterance`
- `request.payload` всегда пустой
- `session.message_id` всегда `0`
- `session.new` всегда `true`
- Кнопки не обрабатываются

## Использование
Проще всего зайти на https://dialogs.popstas.ru (это приложение хостится на github pages, серверной части нет), 
ввести `use http://webhook.url` (URL вашего навыка) и пользоваться. URL запоминается в localStorage.

Данные отправляются только в Speech API и на URL, который вы укажете, но приложение может быть сломано в процессе разработки,
поэтому надежнее скачать и запустить у себя.

У приложения на https://dialogs.popstas.ru есть ограничение: так как у него нет серверной части,
запросы к навыку шлются прямо из браузера, из-за этого все общедоступные источники навыков, вроде 
[verter](https://www.verter.online/), 
[tobotornot](http://alisa.tobotornot.com/) и 
[dialogflower](https://dialogflower.com/) 
не будут отвечать вам, т.к. будут действовать правила [CORS](https://developer.mozilla.org/ru/docs/Web/HTTP/CORS).
Вы можете использовать его только с навыком, который отдает разрешающие заголовки.

Это можно обойти, если использовать версию с серверной частью, она перенаправляет через себя все запросы к навыкам, 
обходя ограничения. Вы можете собрать свою версию сами или зайти на https://dialogs.home.popstas.ru,
она с серверной частью, но только для внешних запросов к навыкам, все данные по-прежнему хранятся в localStorage.

При сборке за это отвечает переменная окружения `IS_PROXY`, если она равна единице, `1`, то запросы будут идти через сервер.


## Установка

#### Запуск через Docker

```
docker run --name yandex-dialogs-client -d -p 3000:3000 popstas/yandex-dialogs-client
```

#### Запуск через Docker compose

```
git clone https://github.com/popstas/yandex-dialogs-client.git
cd yandex-dialogs-client
docker-compose build
docker-compose up -d
```

#### Сборка из исходников

```
git clone https://github.com/popstas/yandex-dialogs-client.git
cd yandex-dialogs-client
npm install
npm run build
npm run start
```
