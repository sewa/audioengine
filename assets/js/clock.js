import moment from 'moment';
import { get } from './service';

const init = () => {
  get('clock').subscribe((xhr) => {
    const { timestamp, bpm } = xhr.response;
    const time = moment(timestamp);
  });
};

export {
  init
}
