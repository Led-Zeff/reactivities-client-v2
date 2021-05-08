import { makeAutoObservable, runInAction } from 'mobx';
import { history } from '../..';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/user';
import { store } from './store';

export default class UserStore {
  user: User | null = null;
  fbAccessToken: string | null = null;
  fbLoading = false;
  refreshTokenTomeout: any;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Accounts.login(creds);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.setUser(user);
      history.push('/activities');
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.stopRefreshTokenTimer();
    this.user = null;
    history.push('/');
  }

  getUser = async () => {
    try {
      const user = await agent.Accounts.current();
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.setUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Accounts.register(creds);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.setUser(user);
      history.push('/activities');
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  setUser = (user: User) => this.user = user;
  setDisplayname = (name: string) => this.user ? this.user.displayName = name : null;

  setImage = (imageUrl?: string) => {
    if (this.user) {
      this.user.image = imageUrl;
    }
  }

  setFbAccessToken = async () => {
    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.fbAccessToken = response.authResponse.accessToken;
      }
    });
  };

  facebookLogin = () => {
    this.fbLoading = true;
    const apiLogin = (accessToken: string) => {
      agent.Accounts.fbLogin(accessToken).then(user => {
        runInAction(() => {
          store.commonStore.setToken(user.token);
          this.startRefreshTokenTimer(user);
          this.setUser(user);
        })
        history.push('/activities');
      })
      .catch(console.log)
      .finally(() => runInAction(() => this.fbLoading = false));
    };

    if (this.fbAccessToken) {
      apiLogin(this.fbAccessToken);
    } else {
      window.FB.login(response => {
        if (response.status === 'connected') {
          apiLogin(response.authResponse.accessToken);
        }
      }, { scope: 'public_profile,email' });
    }
  };

  refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.Accounts.refreshToken();
      runInAction(() => this.user = user);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  private startRefreshTokenTimer(user: User) {
    const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTomeout = setTimeout(this.refreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTomeout);
  }
}