import { sleep, check } from "k6";
import http from "k6/http";

export const options = {
  duration: "30s",
  vus: 1,
  thresholds: {
    http_req_duration: ["p(95)<20000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const credentials = {
    username: "test_" + Date.now(),
    password: "secret_" + Date.now(),
  };

  let res = http.post(
    "https://test-api.k6.io/user/register/",
    JSON.stringify(credentials),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(credentials);

  res = http.post(
    "https://test-api.k6.io/auth/token/login/",
    JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const accessToken = res.json().access;

  http.get("https://test-api.k6.io/my/crocodiles/", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  res = http.post(
    "https://test-api.k6.io/my/crocodiles/",
    JSON.stringify({
      name: "Random croc",
      sex: "M",
      date_of_birth: "2023-10-20",
    }),
    {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    }
  );
  const newCrocodileid = res.json().id;
  console.log("New crocodile ID:", newCrocodileid);

  res = http.get(`https://test-api.k6.io/my/crocodiles/${newCrocodileid}/`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("Requesting crocodile ID:", newCrocodileid);
  console.log("Response body:", res.body);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "crocodile data": (r) => {
      const responseData = r.json();
      return responseData.id === newCrocodileid;
    },
  });

  res = http.del(
    `https://test-api.k6.io/my/crocodiles/${newCrocodileid}/`,
    null,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  check(res, {
    "status is 204": (r) => r.status === 204,
  });
}
