import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { store } from '../stores/store';

export function handleError(error: AxiosError) {
  const {data, status, config, headers} = error.response!;
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
      if (status === 401 && headers['www-authenticate'].startsWith('Bearer error="invalid_token"')) {
        store.userStore.logout();
        toast.error('Session expired');
      }
      break;
    case 404:
      history.push('/not-found');
      break;
    case 500:
      store.commonStore.setServerError(data);
      history.push('/server-error');
      break;
  }
}
