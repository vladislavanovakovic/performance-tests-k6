import { sleep,check } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '1m',
  vus: 30,
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ["rate<0.01"]
  },
};

export default function () {
  let res = http.get('https://test.k6.io/contacts.php');
  sleep(3);

  check (res, {
    'is status 200': (r) => r.status === 200,
    'text verification': (r) => r.body.includes("Contact us")

  })
  sleep(3);

}