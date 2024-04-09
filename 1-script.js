import { sleep,check } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '30s',
  vus: 5,
  thresholds: {
    http_req_duration: ['p(95)<20000'],
    http_req_failed: ["rate<0.01"]
  },
};

export default function () {

  var domain = 'https://test-api.k6.io/'
  let res = http.get( domain,
    {
      tags: {
        name: 'Homepage',
      },
    }
  );

  check(res, {
    'is status 200': (r) => r.status === 200,
    'text verification': (r) => r.body.includes('Collection of HTTP and WebSocket APIs for experimentation with k6'
      ),
  });
  sleep(1);

  const credentials = {
    username: 'test_' + Date.now(),
    password: 'secret_' + Date.now(),
}
   res = http.post(
  'https://test-api.k6.io/user/register/',
  JSON.stringify(credentials),
  {
      headers: {
          'Content-Type': 'application/json'
      }
  }
);
console.log(credentials)
 res = http.post(
  'https://test-api.k6.io/auth/token/login/',
  JSON.stringify(
      {
          username: credentials.username,
          password: credentials.password
      }
  ),
  {
      headers: {
          'Content-Type': 'application/json'
      }
  }
);

const accessToken = res.json().access;

http.get(
  'https://test-api.k6.io/my/crocodiles/',
  {
      headers:{
          Authorization: 'Bearer ' + accessToken
      }
  }
)
res = http.post(
  'https://test-api.k6.io/my/crocodiles/',
  JSON.stringify(
      {
          name: "Random croc",
          sex: "M",
          date_of_birth: "2023-10-20"
      }
  ),
  {
      headers:{
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'

      }
  },

);
const newCrocodileid = res.json().id;

res = http.get(
  `https://test-api.k6.io/my/crocodiles/${newCrocodileid}/`,
  {
      headers:{
          Authorization: 'Bearer ' + accessToken
      }
  }
);
check(res,{
  'status is 200': (r) => r.status === 200,
  'crocodile id': (r) => r.json().id === newCrocodileid
});
console.log(newCrocodileid)

res = http.del(
  `https://test-api.k6.io/my/crocodiles/${newCrocodileid}/`,
  null,
  {
      headers:{
          Authorization: 'Bearer ' + accessToken
      }
  }
);
check(res, {
  'is status 204': (r) => r.status === 204
});

}