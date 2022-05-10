const BASE_URL = "https://study.duyiedu.com";
const fnFetch = async ({ url, method = "GET", params = {} }) => {
  let result = null;
  let headersToken = {};
  sessionStorage.token &&
    (headersToken.authorization = "Bearer " + sessionStorage.token);
  if (method === "GET" && Object.keys(params).length) {
    url +=
      "?" +
      Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
  }
  // console.log(url);
  try {
    const response = await fetch(BASE_URL + url, {
      method,
      headers: { "Content-Type": "application/json", ...headersToken },
      body: method === "GET" ? null : JSON.stringify(params),
    });
    const token = response.headers.get("Authorization");
    // console.log(token);
    // 对用户权限信息进行存储
    token && (sessionStorage.token = token);
    result = await response.json();
    if (result.code === 0) {
      if (result.hasOwnProperty("chatTotal")) {
        result.data = {
          chatTotal: result.chatTotal,
          data: result.data,
        };
      }
      return result.data;
    } else {
      if ((result.status = 401)) {
        window.alert("权限错误");
        window.location.replace(baseUrl + "login.html");
        return;
      }
      window.alert(result.msg);
    }
  } catch (e) {
    console.log(e);
  }
};
