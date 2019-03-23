## [1.1.10](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.9...v1.1.10) (2019-03-23)



## [1.1.9](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.8...v1.1.9) (2019-03-15)



## [1.1.8](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.7...v1.1.8) (2019-03-15)



## [1.1.7](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.6...v1.1.7) (2019-03-15)



## [1.1.6](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.5...v1.1.6) (2019-03-14)



## [1.1.5](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.4...v1.1.5) (2019-03-14)



## [1.1.4](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.3...v1.1.4) (2019-03-14)



## [1.1.3](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.2...v1.1.3) (2019-03-14)



## [1.1.2](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.1...v1.1.2) (2019-03-14)


### Features

* yandex-dialogs-client as cli tool and npm package ([9d4c226](https://github.com/popstas/yandex-dialogs-client/commit/9d4c226))



## [1.1.1](https://github.com/popstas/yandex-dialogs-client/compare/v1.1.0...v1.1.1) (2019-02-27)


### Features

* проверка /scerarios.yml по умолчанию отключена ([47daf24](https://github.com/popstas/yandex-dialogs-client/commit/47daf24))



# [1.1.0](https://github.com/popstas/yandex-dialogs-client/compare/v1.0.2...v1.1.0) (2019-02-11)


### Bug Fixes

* более бледный маркер системного сообщения ([131d616](https://github.com/popstas/yandex-dialogs-client/commit/131d616))


### Features

* карточки ItemsList ([acad67f](https://github.com/popstas/yandex-dialogs-client/commit/acad67f))



## [1.0.2](https://github.com/popstas/yandex-dialogs-client/compare/v1.0.1...v1.0.2) (2019-01-30)


### Bug Fixes

* выводить сообщения об ошибках в scenarios.yml ([ae37b1a](https://github.com/popstas/yandex-dialogs-client/commit/ae37b1a))



## [1.0.1](https://github.com/popstas/yandex-dialogs-client/compare/v1.0.0...v1.0.1) (2019-01-12)


### Bug Fixes

* вывод времени в json запросов и ответов в консоли ([d0bed96](https://github.com/popstas/yandex-dialogs-client/commit/d0bed96))
* ошибка в request.nlu.tokens при нажатии кнопки ([0e4b806](https://github.com/popstas/yandex-dialogs-client/commit/0e4b806))



# [1.0.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.9.0...v1.0.0) (2019-01-12)


### Features

* горячие кнопки для очистки input и истории сообщений (ctrl+C, ctrl+L) ([c6b9f81](https://github.com/popstas/yandex-dialogs-client/commit/c6b9f81))



# [0.9.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.8.2...v0.9.0) (2019-01-12)


### Bug Fixes

* убрано скакание ширины при пустом диалоге ([274cfb8](https://github.com/popstas/yandex-dialogs-client/commit/274cfb8))


### Features

* возможность удалять вебхуки из списка ([ed79b9e](https://github.com/popstas/yandex-dialogs-client/commit/ed79b9e))
* добавлен request.nlu ([efb4912](https://github.com/popstas/yandex-dialogs-client/commit/efb4912))
* передача первого сообщения через ?msg=abc ([695094d](https://github.com/popstas/yandex-dialogs-client/commit/695094d))
* сохранение истории сообщений между обновлениями страницы ([663ad18](https://github.com/popstas/yandex-dialogs-client/commit/663ad18))



## [0.8.2](https://github.com/popstas/yandex-dialogs-client/compare/v0.8.1...v0.8.2) (2018-12-30)


### Features

* session.skill_id в запросе ([6a35ca3](https://github.com/popstas/yandex-dialogs-client/commit/6a35ca3)), closes [#1](https://github.com/popstas/yandex-dialogs-client/issues/1)



## [0.8.1](https://github.com/popstas/yandex-dialogs-client/compare/v0.8.0...v0.8.1) (2018-07-14)


### Bug Fixes

* максимальная задержка уменьшена до 1.5 сек ([16bd9ea](https://github.com/popstas/yandex-dialogs-client/commit/16bd9ea))
* при неответе навыка тест не считался проваленным ([170265d](https://github.com/popstas/yandex-dialogs-client/commit/170265d))


### Features

* настраиваемый timeout ([3872ea1](https://github.com/popstas/yandex-dialogs-client/commit/3872ea1))
* ограничение кол-ва сообщений в чате (для скорости) ([6a14b89](https://github.com/popstas/yandex-dialogs-client/commit/6a14b89))



# [0.8.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.7.2...v0.8.0) (2018-07-08)


### Bug Fixes

* правильная обработка удаления текущего webhookURL ([4a71fd5](https://github.com/popstas/yandex-dialogs-client/commit/4a71fd5))
* убраны скакания верстки при наведении, на некоторых зумах ([7349d69](https://github.com/popstas/yandex-dialogs-client/commit/7349d69))


### Features

* возможность отменить все навыки через "use " ([aee7e1b](https://github.com/popstas/yandex-dialogs-client/commit/aee7e1b))
* кнопки "повторить" на каждом пройденном тесте ([01da90b](https://github.com/popstas/yandex-dialogs-client/commit/01da90b))
* переверстаны карточки, меньше рамок и заливок ([c8efd84](https://github.com/popstas/yandex-dialogs-client/commit/c8efd84))
* статус теста на кнопке цветом ([49ea6eb](https://github.com/popstas/yandex-dialogs-client/commit/49ea6eb))
* ширина приложения сделана более узкой, 480px ([59f8d5c](https://github.com/popstas/yandex-dialogs-client/commit/59f8d5c))



## [0.7.2](https://github.com/popstas/yandex-dialogs-client/compare/v0.7.1...v0.7.2) (2018-07-08)


### Bug Fixes

* тестилка иногда брала для проверки сообщение клиента ([a7d1c62](https://github.com/popstas/yandex-dialogs-client/commit/a7d1c62))
* убрана кнопка "все тесты" при отсутствии scenarios.yml ([215bcbf](https://github.com/popstas/yandex-dialogs-client/commit/215bcbf))


### Features

* выдавать ошибку, если в течение 2 секунд от навыка не было ответа ([fb012da](https://github.com/popstas/yandex-dialogs-client/commit/fb012da))
* тесты теперь не выводятся в сообщении, если они выводятся внизу ([2d1ccb9](https://github.com/popstas/yandex-dialogs-client/commit/2d1ccb9))



## [0.7.1](https://github.com/popstas/yandex-dialogs-client/compare/v0.7.0...v0.7.1) (2018-07-07)


### Bug Fixes

* включение микрофона после ответа бота ([0b0f9b5](https://github.com/popstas/yandex-dialogs-client/commit/0b0f9b5))


### Features

* прямая ссылка на запуск конкретного навыка ([69ce07f](https://github.com/popstas/yandex-dialogs-client/commit/69ce07f))



# [0.7.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.6.1...v0.7.0) (2018-07-07)


### Features

* вывод кнопок тестов на проваленных тестах ([c34b215](https://github.com/popstas/yandex-dialogs-client/commit/c34b215))
* оформление в стиле Алисы ([2c6d4d3](https://github.com/popstas/yandex-dialogs-client/commit/2c6d4d3))
* распознавание через yandex speech api ([7b71705](https://github.com/popstas/yandex-dialogs-client/commit/7b71705))
* тест рандомного ответа one_of ([52ea6a8](https://github.com/popstas/yandex-dialogs-client/commit/52ea6a8))



## [0.6.1](https://github.com/popstas/yandex-dialogs-client/compare/v0.6.0...v0.6.1) (2018-07-02)


### Bug Fixes

* исправлено дублирование внутренних message.id ([71de9a9](https://github.com/popstas/yandex-dialogs-client/commit/71de9a9))
* снова включен вывод запросов и ответов в консоли ([2113de1](https://github.com/popstas/yandex-dialogs-client/commit/2113de1))


### Features

* возможность всегда показывать кнопки тестов ([51f936b](https://github.com/popstas/yandex-dialogs-client/commit/51f936b))
* возможность скрыть JSON запросов в консоли ([0600cee](https://github.com/popstas/yandex-dialogs-client/commit/0600cee))
* вывод url навыка в title ([d77cd97](https://github.com/popstas/yandex-dialogs-client/commit/d77cd97))



# [0.6.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.5.0...v0.6.0) (2018-07-02)


### Bug Fixes

* новые пользователи не могли получить guid ([d1a6683](https://github.com/popstas/yandex-dialogs-client/commit/d1a6683))


### Features

* более удобный вывод тестов ([e6fd86c](https://github.com/popstas/yandex-dialogs-client/commit/e6fd86c))
* запуск всех тестов одной кнопкой ([5719b37](https://github.com/popstas/yandex-dialogs-client/commit/5719b37))
* иконка Алисы ([12ccfc6](https://github.com/popstas/yandex-dialogs-client/commit/12ccfc6))



# [0.5.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.4.1...v0.5.0) (2018-07-01)


### Bug Fixes

* **css:** кнопки выровнены по краям ([5a1132e](https://github.com/popstas/yandex-dialogs-client/commit/5a1132e))
* ошибка SSR рендеринга Slideout ([a3e9192](https://github.com/popstas/yandex-dialogs-client/commit/a3e9192))


### Features

* анимация голосового ввода ([f90732d](https://github.com/popstas/yandex-dialogs-client/commit/f90732d))
* вывод в консоль JSON запросов и ответов в удобном формате ([51675ae](https://github.com/popstas/yandex-dialogs-client/commit/51675ae))
* цветовые обозначения сообщений: info, success, warning, error ([a8d7478](https://github.com/popstas/yandex-dialogs-client/commit/a8d7478))



## [0.4.1](https://github.com/popstas/yandex-dialogs-client/compare/v0.4.0...v0.4.1) (2018-07-01)


### Bug Fixes

* консистентное поведение при выборе хука из последних ([0b0836b](https://github.com/popstas/yandex-dialogs-client/commit/0b0836b))


### Features

* выбор из последних отправленных команд стрелками вниз-вверх ([438cafb](https://github.com/popstas/yandex-dialogs-client/commit/438cafb))
* фокус на поле ввода после каждого ответа бота ([c318de7](https://github.com/popstas/yandex-dialogs-client/commit/c318de7))



# [0.4.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.3.0...v0.4.0) (2018-07-01)


### Features

* боковая панель, настройка прокси ([c4f2b96](https://github.com/popstas/yandex-dialogs-client/commit/c4f2b96))
* выбор из последних URL навыков ([ab90805](https://github.com/popstas/yandex-dialogs-client/commit/ab90805))
* сценарии тестирования навыка ([6e4f30e](https://github.com/popstas/yandex-dialogs-client/commit/6e4f30e))



# [0.3.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.2.0...v0.3.0) (2018-06-30)


### Bug Fixes

* IS_PROXY while docker build ([c0131d5](https://github.com/popstas/yandex-dialogs-client/commit/c0131d5))
* render response without text ([3a9ca21](https://github.com/popstas/yandex-dialogs-client/commit/3a9ca21))


### Features

* session.message_id support ([ed22de8](https://github.com/popstas/yandex-dialogs-client/commit/ed22de8))
* session.new support ([79d1aea](https://github.com/popstas/yandex-dialogs-client/commit/79d1aea))
* поддержка response.end_session ([88bfb4a](https://github.com/popstas/yandex-dialogs-client/commit/88bfb4a))
* сессия теперь сбрасывается при каждом обновлении страницы ([c1023cc](https://github.com/popstas/yandex-dialogs-client/commit/c1023cc))



# [0.2.0](https://github.com/popstas/yandex-dialogs-client/compare/v0.1.0...v0.2.0) (2018-06-27)


### Features

* buttons support ([5ea37f5](https://github.com/popstas/yandex-dialogs-client/commit/5ea37f5))
* IS_PROXY option ([acd76ca](https://github.com/popstas/yandex-dialogs-client/commit/acd76ca))
* resend message ([f30b25d](https://github.com/popstas/yandex-dialogs-client/commit/f30b25d))



# [0.1.0](https://github.com/popstas/yandex-dialogs-client/compare/2473aeb...v0.1.0) (2018-06-17)


### Bug Fixes

* always output outgoing message ([15275ad](https://github.com/popstas/yandex-dialogs-client/commit/15275ad))


### Features

* api endpoint for avoid CORS restrictions ([2473aeb](https://github.com/popstas/yandex-dialogs-client/commit/2473aeb))
* docker support ([1c1d1ef](https://github.com/popstas/yandex-dialogs-client/commit/1c1d1ef))



