// 老师书写的代码可读性更加的强，使用的老师的方式
(() => {
  let isRepeat = false;
  // 接口初始化
  const init = () => {
    initEven();
  };
  const initEven = () => {
    userName.addEventListener("blur", onUserNameBlur);
    formContainer.addEventListener("submit", onFormSubmit);
  };
  // 注册提交事件
  const onFormSubmit = async (e) => {
    e.preventDefault();
    const loginId = userName.value.trim();
    const nickname = userNickname.value.trim();
    const loginPwd = userPassword.value.trim();
    const userPwd = userConfirmPassword.value.trim();
    // 对四个变量进行验证，不能为空，且两次密码一致
    if (!checkVar(loginId, nickname, loginPwd, userPwd)) {
      return;
    }
    // 请求数据
    // const response = await fetch("https://study.duyiedu.com/api/user/reg", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     loginId,
    //     nickname,
    //     loginPwd,
    //   }),
    // });
    // const result = await response.json();
    // if (result.code !== 0) {
    //   window.alert(result.msg);
    //   return;
    // }
    const response = await fnFetch({
      url: "/api/user/reg",
      method: "POST",
      params: {
        loginId,
        nickname,
        loginPwd,
      },
    });
    response && window.location.replace("/login.html");
  };

  const checkVar = (loginId, nickname, loginPwd, userPwd) => {
    switch (true) {
      case !loginId:
        window.alert("账号不能为空");
        return;
      case !nickname:
        window.alert("昵称不能为空");
        return;
      case !loginPwd:
        window.alert("密码不能为空");
        return;
      case !userPwd:
        window.alert("确认密码不能为空");
        return;
      case loginPwd !== userPwd:
        window.alert("两次输入的密码不一致");
        return;
      case isRepeat:
        window.alert("账号已经存在");
        return;
      default:
        return true;
    }
  };

  //验证账号是否已经存在
  const onUserNameBlur = async () => {
    const loginId = userName.value.trim();
    if (!loginId) {
      return;
    }
    // const response = await fetch(
    //   `https://study.duyiedu.com/api/user/exists?loginId=${loginId}`
    // );
    // const result = await response.json();
    // isRepeat = result.data;
    // if (isRepeat) {
    //   window.alert("账号已经存在");
    // }
    // if (result.code !== 0) {
    //   window.alert(result.msg);
    // }
    const res = await fnFetch({
      url: "/api/user/exists",
      method: "GET",
      params: {
        loginId,
      },
    });

    isRepeat = res;
    if (isRepeat) {
      window.alert("账号已经存在");
    }
  };

  init();
})();
