import { ajax } from 'rxjs/ajax';

const get = (endpoint: string) => (
  ajax.get(`/api/${endpoint}`)
);

export {
  get
}
