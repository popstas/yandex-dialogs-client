import pjson from '~/package.json';
import yaml from 'js-yaml';

export const SET_ANSWERS = 'SET_ANSWERS';
export const ALICE_REQUEST = 'ALICE_REQUEST';
export const SET_IS_PROXY = 'SET_IS_PROXY';
export const SET_IS_BOTTOM_TESTS = 'SET_IS_BOTTOM_TESTS';
export const SET_IS_CONSOLE_REQUESTS = 'SET_IS_CONSOLE_REQUESTS';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_SESSION_ID = 'SET_SESSION_ID';
export const SET_SESSION_NEW = 'SET_SESSION_NEW';
export const SET_MESSAGE_ID = 'SET_MESSAGE_ID';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SET_WEBHOOK_URL = 'SET_WEBHOOK_URL';
export const SET_WEBHOOK_URLS = 'SET_WEBHOOK_URLS';
export const ADD_WEBHOOK_URL = 'ADD_WEBHOOK_URL';
export const SESSION_START = 'SESSION_START';
export const SESSION_END = 'SESSION_END';
export const RUN_TEST = 'RUN_TEST';
export const SET_TESTS = 'SET_TESTS';
export const SET_TEST_SUCCESS = 'SET_TEST_SUCCESS';

export const AUTHOR_NAME = 'Я';

const expandedLog = (() => {
  var MAX_DEPTH = 1;

  return (item, depth) => {
    depth = depth || 0;

    if (depth > MAX_DEPTH) {
      console.log(item);
      return;
    }

    if (typeof item === 'object') {
      for (let key in item) {
        let value = item[key];
        let msg = '';
        if (value.request && value.request.command) msg = value.request.command;
        if (value.response && value.response.text) msg = value.response.text;
        console.group(key + ': ' + msg);
        expandedLog(value, depth + 1);
        console.groupEnd();
      }
    } else {
      console.log(item);
    }
  };
})();

export const state = () => ({
  // data
  messages: [],

  // constants
  name: pjson.name,
  version: pjson.version,
  description: pjson.description,
  homepage: pjson.homepage,

  // app state
  isProxy: process.env.isProxy,
  timeout: 2000,
  isBottomTests: false,
  isConsoleRequests: false,
  speechEngine: process.env.speechEngine,
  yandexAPIKey: process.env.yandexAPIKey,
  userId: '',
  sessionId: '',
  sessionNew: true,
  messageId: 1,
  webhookURL: '',
  webhookURLs: [],
  tests: []
});

export const mutations = {
  [SET_IS_PROXY](state, isProxy) {
    state.isProxy = isProxy;
  },

  [SET_IS_BOTTOM_TESTS](state, isBottomTests) {
    state.isBottomTests = isBottomTests;
    localStorage.setItem('isBottomTests', isBottomTests);
  },

  [SET_IS_CONSOLE_REQUESTS](state, isConsoleRequests) {
    state.isConsoleRequests = isConsoleRequests;
    localStorage.setItem('isConsoleRequests', isConsoleRequests);
  },

  [SET_USER_ID](state, userId) {
    state.userId = userId;
  },

  [SET_SESSION_ID](state, sessionId) {
    state.sessionId = sessionId;
  },

  [SET_SESSION_NEW](state, sessionNew) {
    state.sessionNew = sessionNew;
  },

  [SET_MESSAGE_ID](state, messageId) {
    state.messageId = messageId;
  },

  [SET_TESTS](state, tests) {
    state.tests = tests;
  },

  [SET_TEST_SUCCESS](state, { name, success }) {
    const found = state.tests.find(test => test.name === name);
    if (found) found.success = success;
  },

  [SET_WEBHOOK_URL](state, webhookURL) {
    state.webhookURL = webhookURL;
    localStorage.setItem('webhookURL', webhookURL);
  },

  [SET_WEBHOOK_URLS](state, webhookURLs) {
    if (!webhookURLs) webhookURLs = [];
    state.webhookURLs = webhookURLs;
  },

  // last webhookURLs
  [ADD_WEBHOOK_URL](state, webhookURL) {
    if (state.webhookURLs.indexOf(webhookURL) == -1) {
      state.webhookURLs.push(webhookURL);
      localStorage.setItem('webhookURLs', JSON.stringify(state.webhookURLs));
    }
  },

  [ADD_MESSAGE](state, message) {
    message = {
      ...message,
      ...{
        id: window.performance.now(),
        date: new Date().toTimeString().split(' ')[0]
      }
    };
    state.messages.push(message);
  }
};

export const getters = {
  // используется в Dialog.vue
  randomGuid() {
    const S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  },

  lastBotMessage(state) {
    for (let i = state.messages.length - 1; i >= 0; i--) {
      if (state.messages[i].author == 'Робот') return state.messages[i];
    }
  }
};

export const actions = {
  async [ALICE_REQUEST]({ dispatch, commit, state }, command) {
    const offset = new Date().getTimezoneOffset() / 60;
    const timezone = 'GMT' + (offset < 0 ? '+' : '-') + Math.abs(offset);
    const userAgent = 'popstas/yandex-dialogs-client/' + state.version;

    let requestOpts = {
      type: 'SimpleUtterance',
      payload: {}
    };

    if (typeof command === 'string') {
      requestOpts = {
        ...requestOpts,
        ...{
          command: command,
          original_utterance: command
        }
      };
    } else {
      requestOpts = { ...requestOpts, ...command };
      requestOpts.original_utterance = requestOpts.command;
    }

    const data = {
      meta: {
        locale: 'ru-RU',
        timezone: timezone,
        client_id: userAgent
      },
      request: requestOpts,
      session: {
        message_id: state.messageId,
        new: state.sessionNew,
        session_id: state.sessionId,
        user_id: state.userId
      },
      version: '1.0'
    };

    if (state.sessionNew) {
      commit(SET_SESSION_NEW, false);
    }
    commit(SET_MESSAGE_ID, state.messageId + 1);

    const axiosData = { post: data, url: state.webhookURL };

    try {
      if (state.webhookURL) {
        let responseData;
        if (state.isConsoleRequests) {
          expandedLog({ request: data });
          console.log('\n');
        }
        if (state.isProxy) {
          responseData = await this.$axios.$post('/api/request', axiosData, {
            timeout: state.timeout
          });
        } else {
          responseData = await this.$axios.$post(state.webhookURL, data, {
            timeout: state.timeout
          });
        }
        if (state.isConsoleRequests) {
          expandedLog({ response: responseData });
          console.log('\n\n\n\n\n');
        }

        commit(ADD_MESSAGE, {
          text: responseData.response.text,
          buttons: responseData.response.buttons,
          end_session: responseData.response.end_session,
          author: 'Робот',
          class: 'answer'
        });

        if (responseData.response.end_session) {
          dispatch(SESSION_END);
        }
      } else {
        commit(ADD_MESSAGE, {
          text: 'Не указан адрес навыка, пожалуйста, введите его так: use https://localhost:1234',
          author: 'Клиент',
          class: 'warning'
        });
      }
    } catch (err) {
      const textPost = err.message.match(/timeout/) ? 'не ответил вовремя' : 'см. консоль';
      commit(ADD_MESSAGE, {
        text: `Ошибка запроса к ${state.webhookURL} (${textPost})`,
        author: '',
        class: 'error'
      });
      console.error(err);
      return false;
    }
    return true;
  },

  async [SET_WEBHOOK_URL]({ dispatch, commit, state }, url) {
    if (!url || url == 'null') {
      url = '';
    }
    commit(SET_WEBHOOK_URL, url);
    commit(ADD_WEBHOOK_URL, url);
    if (url) {
      commit(ADD_MESSAGE, {
        text:
          'Используется навык по адресу ' +
          url +
          (state.isProxy ? ', через прокси' : ', без прокси'),
        author: 'Клиент',
        class: 'info'
      });
    }
    dispatch(ALICE_REQUEST, '');

    // scenarios.yml
    try {
      const responseData = await this.$axios.$get(state.webhookURL + '/scenarios.yml');
      const doc = yaml.safeLoad(responseData);

      let tests = [];
      let buttons = [];
      for (let name in doc) {
        const dialog = {
          name: name,
          messages: doc[name]
        };
        tests.push(dialog);
        buttons.push({
          title: name,
          payload: JSON.stringify({ scenarios_test: [dialog] })
        });
      }
      commit(SET_TESTS, tests);

      buttons.push({
        title: 'все тесты',
        payload: JSON.stringify({ scenarios_test: tests })
      });

      commit(ADD_MESSAGE, {
        text:
          'У навыка есть scenarios.yml, в нем есть следующие сценарии (' +
          state.tests.length +
          '):',
        buttons: state.isBottomTests ? [] : buttons,
        author: 'Клиент',
        class: 'info'
      });
    } catch (err) {
      //console.error(err);
      // it's normal
    }
  },

  [SESSION_START]({ commit, getters }) {
    commit(SET_SESSION_ID, getters.randomGuid);
    commit(SET_SESSION_NEW, true);
    commit(SET_MESSAGE_ID, 1);
  },

  [SESSION_END]({ dispatch, commit }) {
    dispatch(SESSION_START);
    commit(ADD_MESSAGE, {
      text: 'Сессия закончена',
      author: 'Клиент',
      class: 'info'
    });
  },

  async [RUN_TEST]({ dispatch, getters, commit }, dialogs) {
    let allFailedTests = [];
    const verbose = false;

    // clean buttons success colors
    dialogs.forEach(dialog => {
      commit(SET_TEST_SUCCESS, { name: dialog.name, success: null });
    });

    // test suites (one dialog - one button)
    for (let d in dialogs) {
      const dialog = dialogs[d];
      const rerunButton = {
        title: `повторить "${dialog.name}"`,
        payload: JSON.stringify({ scenarios_test: [dialog] })
      };
      commit(ADD_MESSAGE, {
        text: `Тест: ${dialog.name}`,
        author: 'Клиент',
        class: 'info'
      });

      let isDialogErrors = false;
      let isUser = true;

      // test steps
      for (let i in dialog.messages) {
        const message = dialog.messages[i];

        // send user message
        if (isUser) {
          commit(ADD_MESSAGE, {
            text: message,
            author: AUTHOR_NAME
          });
          const result = await dispatch(ALICE_REQUEST, message);
          if (!result) {
            isDialogErrors = true;
            break;
          }
          isUser = !isUser;
          continue;
        }
        isUser = !isUser;

        // check bot's answer
        let msg = getters.lastBotMessage;

        // simple equals string
        if (typeof message === 'string') {
          if (verbose) console.log(`test ${msg.text} == ${message}`);
          if (msg.text != message) {
            isDialogErrors = true;
            commit(ADD_MESSAGE, {
              text: `Тест не пройден:\nотвечено: ${msg.text}\nожидалось: ${message}`,
              buttons: [rerunButton],
              author: 'Клиент',
              class: 'error'
            });
            break; // end test
          }
        }

        // message tests
        if (typeof message === 'object') {
          if (!message.tests) {
            isDialogErrors = true;
            commit(ADD_MESSAGE, {
              text: `Тест не пройден: в объекте ` + JSON.stringify(message) + 'нет поля tests',
              buttons: [rerunButton],
              author: 'Клиент',
              class: 'error'
            });
            break;
          }

          let messageErrors = [];
          message.tests.forEach(testmessage => {
            let testType = Object.keys(testmessage)[0];
            let testVal = testmessage[testType];
            if (verbose) console.log(`test ${testType} ${testVal}`);
            // contains
            if (testType == 'contains' && !msg.text.includes(testVal)) {
              messageErrors.push(`ответ не содержит "${testVal}"`);
              return;
            }

            // not contains
            if (testType == 'not_contains' && msg.text.includes(testVal)) {
              messageErrors.push(`ответ содержит "${testVal}", но не должен`);
              return;
            }

            // not contains
            if (testType == 'one_of' && testVal.indexOf(msg.text) == -1) {
              messageErrors.push('не соответствует ни одному из ответов: ' + testVal.join(', '));
              return;
            }
          });

          // found message errors
          if (messageErrors.length > 0) {
            isDialogErrors = true;
            commit(ADD_MESSAGE, {
              text: 'Тест не пройден:\n' + messageErrors.join('\n'),
              buttons: [rerunButton],
              author: 'Клиент',
              class: 'error'
            });
            break;
          }
        }
        // end of message
      }

      commit(SET_TEST_SUCCESS, { name: dialog.name, success: !isDialogErrors });
      if (isDialogErrors) allFailedTests.push(dialog);
      if (!isDialogErrors) {
        commit(ADD_MESSAGE, {
          text: `Тест пройден`,
          buttons: [rerunButton],
          author: 'Клиент',
          class: 'success'
        });
      }
      // end of dialog
    }

    if (dialogs.length > 1) {
      if (allFailedTests.length > 0) {
        let buttons = allFailedTests.map(dialog => {
          return {
            title: dialog.name,
            payload: JSON.stringify({ scenarios_test: [dialog] })
          };
        });
        if (allFailedTests.length > 1) {
          buttons.push({
            title: 'все проваленные тесты',
            payload: JSON.stringify({ scenarios_test: allFailedTests })
          });
        }

        commit(ADD_MESSAGE, {
          text: 'Не все тесты пройдены :(',
          author: 'Клиент',
          buttons: buttons,
          class: 'error'
        });
      } else {
        commit(ADD_MESSAGE, {
          text: 'Все тесты пройдены: ' + dialogs.length,
          author: 'Клиент',
          class: 'success'
        });
      }
    }
    // end of dialogs test
  }
};

export const strict = !process.env.production;
