import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

const sleep = (delay: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), delay))

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.interceptors.response.use(async r => {
  await sleep(1000);
  return r;
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  put: <T> (url: string, body: any) => axios.put<T>(url, body).then(responseBody),
  post: <T> (url: string, body: any) => axios.post<T>(url, body).then(responseBody),
  delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: () => requests.get<Activity[]>('/activities')
}

const agent = {
  Activities
}

export default agent;
