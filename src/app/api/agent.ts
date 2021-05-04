import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Activity, ActivityFormValues } from '../models/activity';
import { PaginatedResult } from '../models/pagination';
import { FollowPredicate, Photo, Profile, ProfileFormValues } from '../models/profile';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';
import { handleError } from './errorHandler';

const sleep = (delay: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), delay))

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(async r => {
  await sleep(500);

  const pagination = r.headers['pagination'];
  if (pagination) {
    r.data = new PaginatedResult(r.data, JSON.parse(pagination));
    // return r as AxiosResponse<PaginatedResult<>>
  }

  return r;
}, (error: AxiosError) => {
  handleError(error);
  return Promise.reject(error);
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T> (url: string, config?: AxiosRequestConfig) => axios.get<T>(url, config).then(responseBody),
  put: <T> (url: string, body: any) => axios.put<T>(url, body).then(responseBody),
  post: <T> (url: string, body: any) => axios.post<T>(url, body).then(responseBody),
  delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: (params: URLSearchParams) => requests.get<PaginatedResult<Activity[]>>('/activities', {params}),
  detail: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (acitivity: ActivityFormValues) => requests.post<void>('/activities', acitivity),
  update: (acitivity: ActivityFormValues) => requests.put<void>(`/activities/${acitivity.id}`, acitivity),
  delete: (id: string) => requests.delete<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

const Accounts = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user),
};

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  update: (profile: ProfileFormValues) => requests.put('/profiles', profile),
  uploadPhoto: (file: Blob) => {
    const formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: { 'Content-type': 'multipart/form-data' }
    });
  },
  setMainPhoto: (id: string) => requests.put(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
  getFollowings: (username: string, predicate: FollowPredicate) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`)
}

const agent = {
  Activities,
  Accounts,
  Profiles
}

export default agent;
