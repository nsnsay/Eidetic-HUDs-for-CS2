
# 欢迎使用 `EideticHM`：CS2 观战 HUD

[英文](https://kimi.moonshot.cn/chat/README.md)

`EideticHM` 是一个专为直播主播和赛事组织者设计的开源观战 HUD，基于 [CS2 HUD 项目](https://github.com/drweissbrot/cs-hud) 开发。

---

## 使用方法

1. 从 [发布页面](https://github.com/nsnsay/Eidetic-HUDs-for-CS2/releases/) 下载最新版本的程序。
2. 将 `gamestate_integration_eidetic_hud.cfg` 文件复制到 CS2 配置文件夹中（路径为 `/game/csgo/cfg/`）。
3. **重要提示** ：请严格按照以下顺序操作：

* 先安装 `EideticHM`。
* ***最后以管理员身份运行EideticHM！！！*重要***

---

## 功能说明

### 团队标志

* 首次打开程序时，程序会在 `%appdata%/EideticHM` 自动生成一个文件夹。
* 将团队标志图片放置在该目录下的 `team-logos` 子文件夹中。
* **命名规则** ：文件名必须与 HUD 中显示的团队名称完全一致，格式为 `[团队名称].png`。
* 团队标志将自动显示在 HUD 中。

### 性能问题

如果您遇到性能问题，请尝试以下优化：

* 在 OBS 中进行捕获时，请使用 **窗口捕获** 来捕获 `ehm-window.exe`，而不是使用浏览器源。

### OBS 和 vMix 捕获

* 创建一个新的浏览器源，并粘贴以下 URL：`http://127.0.0.1:31982/hud/index.html?transparent`。

### HUD 无法正常工作

* 请重新检查 **使用方法：步骤 2** 中的操作。

---

如需进一步帮助，请通过以下方式联系我们：

* **Discord 社区** ：[加入我们](https://discord.gg/u38Cmu5Zf7)
* **邮箱** ：[troupqgog512956@gmail.com](mailto:troupqgog512956@gmail.com)

我们希望 `EideticHM` 能提升您的直播和赛事组织体验！
