import { sleep,check } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '30s',
  vus: 25,
  thresholds: {
    http_req_duration: ['p(95)<5000'],
  },
};

export default function () {
  let res = http.get('http://test.k6.io/contacts.php');
  sleep(3);

  check (res, {
    'is status 200': (r) => r.status === 200,
    'text verification': (r) => r.body.includes("support@k6.io")

  })
  sleep(3);

}