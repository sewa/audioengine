import moment from 'moment';
import { get } from './service';
import { Clock, Transport, FMSynth } from 'Tone';

const init = () => {
  get('clock').subscribe((xhr) => {
    const { timestamp, bpm } = xhr.response;
    const nowUnix = moment().format('x');
    const interval_ms = 60000 / bpm;
    const diff   = nowUnix - timestamp;
    const error = diff % interval_ms;
    const offset = interval_ms - error;

    window.setTimeout(() => {
      Transport.start();
    }, offset);

    Transport.bpm.value = bpm;
  });
};

export {
  init
}
