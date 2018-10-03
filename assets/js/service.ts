import { ajax } from 'rxjs/ajax'
import { forkJoin } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

const get = (endpoint: string) => (
  ajax.get(`/api/${endpoint}`)
);

const getAll = (endpoints: Array<string>) => (
  forkJoin(endpoints.map(endpoint => get(endpoint)))
    .pipe(
      mergeMap(xhrs => endpoints.map(
        (endpoint, idx) => ({ endpoint, response: xhrs[idx].response })
      ))
    )
)

export {
  get,
  getAll
}
