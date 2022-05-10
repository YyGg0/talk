(async () => {
  let page = 0;
  let size = 10;
  let chatTotal = 0;
  let sendType = "enter";
  // 获取dom
  const chatContent = document.querySelector(".content-body");
  // 初始化
  const init = () => {
    setUserMessage();
    getCharList("botton");
    initEvents();
  };
  // 注册事件
  const initEvents = () => {
    sendMessage.addEventListener("click", onsendAndGet);
    chatContent.addEventListener("scroll", onhistory);
    arrContainer.addEventListener("click", onarrContainer);
    // console.log(Array.isArray(selectContainer.children));
    Array.from(selectContainer.children).forEach((child) => {
      child.addEventListener("click", onselectContainer);
    });
    whatMessage.addEventListener("keyup", onwhatMessage);
    closeBtn.addEventListener("click", oncloseBtn);
  };
  // 关闭窗口事件
  const oncloseBtn = () => {
    sessionStorage.removeItem("token");
    window.location.replace(baseUrl + "login.html");
  };
  // 键盘输出
  const onwhatMessage = (e) => {
    // console.log(e.keyCode, e.ctrlKey);
    if (
      (e.keyCode === 13 && sendType === "enter" && !e.ctrlKey) ||
      (e.keyCode === 13 && sendType === "ctrlEnter" && e.ctrlKey)
    ) {
      sendMessage.click();
    }
  };
  // 子项展示事件
  const onselectContainer = function () {
    // 点击事件前先去除之前有的
    const hasOn = document.querySelector(".select-item.on");
    hasOn && hasOn.classList.remove("on");
    this.classList.add("on");
    sendType = this.getAttribute("type");
    // console.log(sendType);
    selectContainer.style.display = "none";
  };

  // 点击展示
  const onarrContainer = () => {
    selectContainer.style.display = "block";
  };
  // 滚动条往上，返回历史记录
  const onhistory = () => {
    if (chatContent.scrollTop === 0) {
      // console.log(chatTotal);
      if (chatTotal <= (page + 1) * size) {
        return;
      }
      page++;
      getCharList("top");
    }
    // console.log(chatContent.scrollTop);
  };
  // 发送信息
  const onsendAndGet = async () => {
    const content = whatMessage.value.trim();
    if (!content) {
      window.alert("发送消息为空");
      return;
    }
    setCharLists([{ from: "user", content }], "botton");
    whatMessage.value = "";
    // 发送信息
    const res = await fnFetch({
      url: "/api/chat",
      method: "POST",
      params: { content },
    });
    setCharLists([{ from: "robot", content: res.content }], "botton");
  };
  // 设置个人信息
  const setUserMessage = async () => {
    const res = await fnFetch({
      url: "/api/user/profile",
      method: "GET",
      params: {},
    });
    // console.log(res);
    nickName.innerHTML = res.nickname;
    accountName.innerHTML = res.loginId;
    loginTime.innerHTML = formaDate(res.lastLoginTime);
  };
  // 获取聊天信息
  const getCharList = async (state) => {
    const res = await fnFetch({
      url: "/api/chat/history",
      method: "GET",
      params: {
        page,
        size,
      },
    });
    chatTotal = res.chatTotal;
    setCharLists(res.data, state);
  };
  // 设置历史聊天记录
  const setCharLists = async (res, state) => {
    res.reverse();
    // console.log(res);
    let robotContents;
    // let userContents;
    if (!res.length) {
      // console.log(1);
      robotContents = `
            <div class="chat-container robot-container">
              <img src="./img/robot.jpg" alt="" />
              <div class="chat-txt">
                您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
              </div>
            </div>
      `;
      chatContent.innerHTML = robotContents;
      return;
    }
    const whatContents = res
      .map((item) => {
        return item.from === "robot"
          ? `<div class="chat-container robot-container">
              <img src="./img/robot.jpg" alt="" />
              <div class="chat-txt">
                ${item.content}
              </div>
            </div>`
          : `<div class="chat-container avatar-container">
              <img src="./img/avtar.png" alt="" />
              <div class="chat-txt">${item.content}</div>
            </div>
    `;
      })
      .join("");
    // console.log(whatContents);
    // 滚动到最下面
    let bottonSize;
    if (state === "botton") {
      chatContent.innerHTML += whatContents;
      bottonSize =
        chatContent.children[chatContent.children.length - 1].offsetTop;
      chatContent.scrollTop = bottonSize;
    } else if (state === "top") {
      chatContent.innerHTML = whatContents + chatContent.innerHTML;
    }
  };

  init();
})();
