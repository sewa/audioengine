import { ajax } from 'rxjs/ajax';

const baseUrl = "http://localhost:4000/api";

const get = (endpoint: string) => (
  ajax.get(`/api/${endpoint}`)
);

export {
  get
}
