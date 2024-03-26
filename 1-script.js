import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '30s',
  vus: 25,
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  http.get('http://test.k6.io/contacts.php');
  sleep(3);
}