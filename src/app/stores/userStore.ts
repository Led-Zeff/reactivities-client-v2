import { makeAutoObservable } from 'mobx';
import { history } from '../..';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/user';
import { store } from './store';

export default class UserStore {
  user: User | null = null;

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
      this.setUser(user);
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  }

  getUser = async () => {
    try {
      const user = await agent.Accounts.current();
      this.setUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  setUser = (user: User) => this.user = user;
}