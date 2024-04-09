import { sleep,check } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '30s',
  vus: 15,
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ["rate<0.01"]
  },
};

export default function () {
  let res = http.get('http://kube.local/');
  sleep(3);

  check (res, {
    'is status 200': (r) => r.status === 200,

  })
  sleep(3);

}