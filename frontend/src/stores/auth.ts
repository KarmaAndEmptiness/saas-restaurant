// src/stores/auth.ts
import { createStore } from 'vuex';

interface UserInfo {
  id: string;
  username: string;
  role: string;
}

interface AuthState {
  token: string;
  userInfo: UserInfo | null;
}

// 创建并导出 Vuex Store
export default createStore({
  state: (): AuthState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),
  mutations: {
    SET_TOKEN(state, token: string) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_USER_INFO(state, userInfo: UserInfo) {
      state.userInfo = userInfo;
    },
    CLEAR_TOKEN(state) {
      state.token = '';
      state.userInfo = null;
      localStorage.removeItem('token');
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userRoles: (state) => state.userInfo?.role || ''
  }
});