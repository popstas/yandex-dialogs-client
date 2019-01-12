# yandex-dialogs-client

Клиент для работы с навыками Яндекс.Диалогов Алисы локально.

![demo](/assets/demo.gif)

Клиент тестировался только в Яндекс.Браузере.

Идея была в том, чтобы написать реализацию, умеющую работать с навыками Яндекс.Диалогов без изменения.
Клиент использует тот же протокол, что и Яндекс.Диалоги с ограничениями (см. ниже).

## Зачем это может быть нужно:
- Тестирование навыков
- Запуск навыков локально
- Автоматическое тестирование навыков по сценариям
- Групповое тестирование навыков до публикации

## Возможности
- Голосовой ввод через браузерный Speech API или через Яндекс SpeechKit
- Сохранение истории последних сообщений (по умолчанию 20)
- Выбор из последних отправленных команд стрелками вниз-вверх
- Возможность переотправить выбранное сообщение
- Вывод в консоль JSON запросов и ответов в удобном формате
- Вывод кнопок, отправка запросов с `type = 'ButtonPressed'`
- Подключение навыка по Webhook URL
- Выбор из последних URL навыков
- Прямая ссылка на запуск конкретного навыка и отправку первого сообщения
- Возможность обращаться к навыку из браузера или через сервер, для обхода [CORS](#CORS)
- Сценарии тестирования навыков
- Прогон всех тестовых сценариев одной кнопкой
- Вывод проваленных тестов с кнопками повтора
- Горячие кнопки для очистки input и истории сообщений (Ctrl+C, Ctrl+L)

## Ограничения, особенности
- На данный момент можно привязать только один навык (но можно быстро переключаться между последними навыками)
- `session.session_id` сбрасывается при каждом обновлении страницы или при завершении диалога из навыка
- `session.user_id` хранится в localStorage, то есть каждый браузер считается новым юзером

## Использование
Проще всего зайти на https://dialogs.popstas.ru (это приложение хостится на github pages, серверной части нет), 
ввести `use http://webhook.url` (URL вашего навыка) и пользоваться. URL запоминается в localStorage.

Данные отправляются только в Speech API и на URL, который вы укажете, но приложение может быть сломано в процессе разработки,
поэтому надежнее скачать и запустить у себя.

### Прямая ссылка на навык
Вы можете указывать прямые ссылки на навыки через GET параметр `use`, `?use=http://webhook.url.

Например, это будет работать: https://dialogs.home.popstas.ru/?use=https://dialogflower.com/webhook/d4dbb4f93bed4e5e989107d679e20083

Так удобно давать друзьям потестить свой навык.

### Отправка сообщения боту по F5 или Ctrl+R
Бывает, что удобнее тестить навык по одной фразе. Клиент поддерживает повтор любой фразы и повтор последней фразы по нажатию стрелки вверх, но Alt+Tab, Ctrl+R может быть быстрее, т.к. не надо ставить фокус на input и перемещать руку в правую часть.

Можно указать сообщение в GET параметре msg, например, https://dialogs.home.popstas.ru/?use=https://dialogflower.com/webhook/d4dbb4f93bed4e5e989107d679e20083&msg=привет

### Сценарии тестирования навыков
В приложении встроена простая система тестирования: ввод последовательностей фраз и проверка текстов ответов.

#### Как это работает:
- При подключении навыка приложение пытается получить /scenarios.yml GET запросом
- Если ему это удается, выводятся кнопки для запуска тестов
- При нажатии на кнопку отправляются реплики к навыку и проверяются ответы

[Пример scenarios.yml](https://github.com/popstas/yandex-dialogs-whatis/blob/master/static/scenarios.yml).

![scenarios](/assets/scenarios.gif)

### Запуск всех сценариев
Вы можете запустить все имеющиеся тесты одной кнопкой.

Тесты выполняются в том порядке, в котором перечислены в yml:

![run_all_tests](/assets/run_all_tests.gif)


### Повтор проваленных тестов
Когда вы пишете новую команду для навыка, вам не нужно прогонять все тесты после каждого изменения кода.
Вывод кнопок тестов на проваленных тестах дает возможность быстро тестировать разрабатываемую фичу:

- Запустить все тесты
- Увидеть проваленные
- Запустить только проваленные
- Запускать их одной кнопкой, пока проваленных не останется

![run_failed_tests](/assets/run_failed_tests.gif)

### CORS
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
Но если вы делаете `npm run generate`, то переменную надо ставить на сборку.

Если приложение изначально запущено с `IS_PROXY`, то в интерфейсе вы можете переключать режим на запросы напрямую.


## Установка

#### Запуск через Docker

```
docker run --name yandex-dialogs-client -d -p 3000:3000 popstas/yandex-dialogs-client
```

#### Запуск через Docker compose
```
git clone https://github.com/popstas/yandex-dialogs-client.git
cd yandex-dialogs-client
cp .env.sample .env
```

Нужно скопировать `.env.sample` в `.env` и заполнить. После этого собрать и поднять:

```
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

#### Выбор голосового распознавания от Яндекс
По умолчанию работает распознавание через SpeechAPI, встроенный в браузер (Chome).
Оно работает в офлайне, но качество у него хуже, чем у Яндекса.

Можно включить Яндекс через переменные окружения:

- `SPEECH_ENGINE` - выбор движка, `browser` или `yandex`
- `YANDEX_WEBSPEECH_KEY` - API ключ
