# 📄 deeplearn 报告中心（GitHub Pages 站点）

> 本目录既是本地报告存放地，也是 **GitHub Pages 站点仓库**。
> 🌐 线上地址：**https://chongchongchongchong666.github.io/deeplearn-reports/**

---

## 一、站点内容

| 路径 | 说明 |
| ---- | ---- |
| `index.html` | 🏠 入口页（报告中心导航卡片） |
| `seven-projects-overview/` | 🗂️ 七大项目总览（作用/功能/结果 + 14 张实测配图） |
| `helmet-flywheel-retrain-report/` | 🔄 07 数据飞轮重训总结报告 |
| `dl-cv-experiment-report/` | 📊 CV 实验完整报告（HTML 版） |
| `dl-cv-experiment-report.pdf` | 📕 实验报告 PDF 版 |
| `d2l-symbols-notes.html` | 📖 D2L 符号速查笔记 |

每个报告目录结构：`xxx.html`（双击可本地打开）+ `assets/`（图片与 charts.js）+ `_shared/`（ECharts/Mermaid 库与字体，**不要删**，线上渲染依赖）。

---

## 二、本地更新后同步上线

报告内容有改动时，在本目录执行三条命令即可重新发布：

```powershell
# 1) 进入仓库目录（需代理开启，git 已配置 http.proxy=127.0.0.1:7897）
cd f:\deeplearn\reports

# 2) 提交改动
git add -A
git commit -m "update: 更新报告内容"

# 3) 推送（GitHub Pages 自动重新构建，约 1 分钟生效）
git push
```

> ⚠️ 前提：v2rayN 正在运行（代理端口 7897 开放）。
> 若想恢复直连：`git config --global --unset http.proxy`

---

## 三、新增一份报告的流程

1. 用 html-report 技能在本目录下生成新报告文件夹（含 html + assets + _shared）
2. 在 `index.html` 的卡片网格里补一个 `<a class="card" href="./新报告/xxx.html">` 卡片
3. 执行上面「二」的三条命令推送上线

---

## 四、相关地址

- 🌐 站点：https://chongchongchongchong666.github.io/deeplearn-reports/
- 📦 仓库：https://github.com/chongchongchongchong666/deeplearn-reports
- ⚙️ Pages 设置：仓库 Settings → Pages（Source: main 分支根目录，已开启）
