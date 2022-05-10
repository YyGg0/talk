(() => {
  // 习惯一个函数完成一个功能
  // 定义一个程序入口
  function init() {
    //   对所有事件进行注册
    allEvents();
  }

  const allEvents = () => {
    formContainer.addEventListener("submit", updates);
  };

  const updates = async (e) => {
    // 去掉默认事件
    e.preventDefault();
    const loginId = userName.value.trim();
    const loginPwd = userPassword.value.trim();
    if (!loginId || !loginPwd) {
      window.alert("用户或者密码不能为空");
    }
    // const res = await fetch("https://study.duyiedu.com/api/user/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     loginId,
    //     loginPwd,
    //   }),
    // });
    // const result = await res.json();
    // if (result.code !== 0) {
    //   window.alert(result.msg);
    //   return;
    // }
    const res = await fnFetch({
      url: "/api/user/login",
      method: "POST",
      params: { loginId, loginPwd },
    });
    res && window.location.replace("/index.html");
  };

  init();
})();
