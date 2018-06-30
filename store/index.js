import pjson from '~/package.json';

export const SET_ANSWERS = 'SET_ANSWERS';
export const ALICE_REQUEST = 'ALICE_REQUEST';
export const SET_IS_PROXY = 'SET_IS_PROXY';
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

export const AUTHOR_NAME = 'Я';

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
  userId: '',
  sessionId: '',
  sessionNew: true,
  messageId: 1,
  webhookURL: '',
  webhookURLs: []
});

export const mutations = {
  [SET_IS_PROXY](state, isProxy) {
    state.isProxy = isProxy;
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

  [SET_WEBHOOK_URL](state, webhookURL) {
    state.webhookURL = webhookURL;
    localStorage.setItem('webhookURL', webhookURL);
  },

  [SET_WEBHOOK_URLS](state, webhookURLs) {
    if (!webhookURLs) webhookURLs = [];
    state.webhookURLs = webhookURLs;
  },

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
        id: new Date().getTime(),
        date: new Date().toLocaleString()
      }
    };
    state.messages.push(message);
  }
};

export const getters = {
  randomGuid() {
    const S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
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
        if (state.isProxy) {
          responseData = await this.$axios.$post('/api/request', axiosData);
        } else {
          responseData = await this.$axios.$post(state.webhookURL, data);
        }

        commit(ADD_MESSAGE, {
          text: responseData.response.text,
          buttons: responseData.response.buttons,
          end_session: responseData.response.end_session,
          author: 'Робот'
        });

        if (responseData.response.end_session) {
          dispatch(SESSION_END);
        }
      } else {
        commit(ADD_MESSAGE, {
          text: 'Не указан адрес навыка, пожалуйста, введите его так: use https://localhost:1234',
          author: ''
        });
      }
    } catch (err) {
      commit(ADD_MESSAGE, {
        text: 'Ошибка запроса к ' + state.webhookURL + ' (см. консоль)',
        author: ''
      });
      console.error(err);
    }
  },

  [SET_WEBHOOK_URL]({ dispatch, commit, state }, url) {
    if (!url) {
      commit(ADD_MESSAGE, {
        text: 'Не указан адрес навыка, пожалуйста, введите его так: use https://localhost:1234',
        author: ''
      });
      return;
    }

    commit(SET_WEBHOOK_URL, url);
    commit(ADD_WEBHOOK_URL, url);
    commit(ADD_MESSAGE, {
      text:
        'Используется навык по адресу ' + url + (state.isProxy ? ', через прокси' : ', без прокси'),
      author: ''
    });
    dispatch(ALICE_REQUEST, '');
  },

  [SESSION_START]({ commit, getters }) {
    commit(SET_SESSION_ID, getters.randomGuid);
    commit(SET_SESSION_NEW, true);
    commit(SET_MESSAGE_ID, 1);
  },

  [SESSION_END]({ dispatch, commit }) {
    dispatch(SESSION_START);
    commit(ADD_MESSAGE, {
      text: '[Сессия закончена]',
      author: 'yandex-gialogs-client'
    });
  }
};

export const strict = !process.env.production;
