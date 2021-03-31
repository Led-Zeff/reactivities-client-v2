import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValues } from '../models/activity';
import { Photo, Profile } from '../models/profile';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';

const sleep = (delay: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), delay))

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(async r => {
  await sleep(500);
  return r;
}, (error: AxiosError) => {
  const {data, status, config} = error.response!;
  switch(status) {
    case 400:
      if (!data.errors) {
        toast.error(data.title);
      }
      console.log(data)
      if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/not-found');
      }
      if (data.errors) {
        const modalStateErrors = [];
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            modalStateErrors.push(data.errors[key]);
          }
        }

        throw modalStateErrors.flat();
      } else {
        toast.error(data);
      }
      break;
    case 401:
      toast.error('Unauthorized');
      break;
    case 404:
      history.push('/not-found');
      break;
    case 500:
      store.commonStore.setServerError(data);
      history.push('/server-error');
      break;
  }

  return Promise.reject(error);
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  put: <T> (url: string, body: any) => axios.put<T>(url, body).then(responseBody),
  post: <T> (url: string, body: any) => axios.post<T>(url, body).then(responseBody),
  delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: () => requests.get<Activity[]>('/activities'),
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
  uploadPhoto: (file: Blob) => {
    const formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: { 'Content-type': 'multipart/form-data' }
    });
  },
  setMainPhoto: (id: string) => requests.put(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
}

const agent = {
  Activities,
  Accounts,
  Profiles
}

export default agent;
