import pjson from "~/package.json";

export const SET_ANSWERS = "SET_ANSWERS";
export const ALICE_REQUEST = "ALICE_REQUEST";
export const SET_USER_ID = "SET_USER_ID";
export const SET_SESSION_ID = "SET_SESSION_ID";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const SET_WEBHOOK_URL = "SET_WEBHOOK_URL";

export const AUTHOR_NAME = "Я";

export const state = () => ({
  // data
  messages: [],

  // constants
  name: pjson.name,
  version: pjson.version,
  description: pjson.description,
  homepage: pjson.homepage,

  // app state
  userId: "",
  sessionId: "",
  webhookURL: ""
});

export const mutations = {
  [SET_USER_ID](state, userId) {
    state.userId = userId;
  },

  [SET_SESSION_ID](state, sessionId) {
    state.sessionId = sessionId;
  },

  [SET_WEBHOOK_URL](state, webhookURL) {
    state.webhookURL = webhookURL;
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

export const actions = {
  async [ALICE_REQUEST]({ commit, state }, command) {
    commit(ADD_MESSAGE, {
      text: command,
      author: AUTHOR_NAME
    });
    const offset = new Date().getTimezoneOffset() / 60;
    const timezone = "GMT" + (offset < 0 ? "+" : "-") + Math.abs(offset);
    const userAgent = "popstas/yandex-dialogs-client/" + state.version;

    const data = {
      meta: {
        locale: "ru-RU",
        timezone: timezone,
        client_id: userAgent
      },
      request: {
        command: command,
        original_utterance: command,
        type: "SimpleUtterance",
        payload: {}
      },
      session: {
        message_id: 0,
        new: true,
        session_id: state.sessionId,
        user_id: state.userId
      },
      version: "1.0"
    };

    const axiosData = { post: data, url: state.webhookURL };

    try {
      if (state.webhookURL) {
        let responseData = await this.$axios.$post('/api/request', axiosData);
        // let responseData = await this.$axios.$post(state.webhookURL, data);

        commit(ADD_MESSAGE, {
          text: responseData.response.text,
          author: "Робот"
        });
      } else {
        commit(ADD_MESSAGE, {
          text:
            "Не указан адрес навыка, пожалуйста, введите его так: use https://localhost:1234",
          author: ""
        });
      }
    } catch (err) {
      commit(ADD_MESSAGE, {
        text: "Ошибка запроса к " + state.webhookURL,
        author: ""
      });
    }
  },

  [SET_WEBHOOK_URL]({ commit, state }, url) {
    if (!url) {
      commit(ADD_MESSAGE, {
        text:
          "Не указан адрес навыка, пожалуйста, введите его так: use https://localhost:1234",
        author: ""
      });
      return;
    }

    commit(SET_WEBHOOK_URL, url);
    commit(ADD_MESSAGE, {
      text: "Используется навык по адресу " + url,
      author: ""
    });
    localStorage.setItem("webhookURL", url);
  }
};

export const strict = process.env.NODE_ENV !== "production";
