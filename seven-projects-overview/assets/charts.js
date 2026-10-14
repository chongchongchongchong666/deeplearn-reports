// 七项目总览图表脚本（IIFE 避免污染全局；颜色取自 CSS 变量）
(function () {
  'use strict';

  // ---------- 读取主题变量 ----------
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim() || '#4f6ef7';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#10b981';
  var ink = style.getPropertyValue('--ink').trim() || '#17233d';
  var muted = style.getPropertyValue('--muted').trim() || '#5b6b85';
  var rule = style.getPropertyValue('--rule').trim() || '#dde5f2';

  // ============================================================
  // 图 8：各项目核心指标一览（0-1 归一化指标柱状图）
  //   仅选取可同屏比较的「0~1 指标类」结果：
  //   01 mAP50 / 03 表情准确率 / 04 P@1 / 07 飞轮 mAP50
  // ============================================================
  var c1 = echarts.init(document.getElementById('chart-bars'), null, { renderer: 'svg' });
  c1.setOption({
    animation: false,
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (ps) {
        var p = ps[0];
        var tips = {
          '01 足球检测': 'mAP50（迁移学习）',
          '03 关键点/表情': '表情分类准确率',
          '04 图像检索': 'Precision@1',
          '07 头盔监管': 'mAP50（飞轮版）'
        };
        return p.name + '<br/>' + (tips[p.name] || '') + '：<b>' + p.value.toFixed(3) + '</b>';
      }
    },
    grid: { left: 54, right: 30, bottom: 34, top: 46 },
    xAxis: {
      type: 'category',
      data: ['01 足球检测', '03 关键点/表情', '04 图像检索', '07 头盔监管'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, interval: 0, fontSize: 12 }
    },
    yAxis: {
      type: 'value', min: 0, max: 1, name: '核心指标值',
      nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [{
      name: '核心指标',
      type: 'bar',
      barWidth: '44%',
      data: [
        { value: 0.816, itemStyle: { color: accent } },
        { value: 0.651, itemStyle: { color: accent2 } },
        { value: 0.748, itemStyle: { color: accent } },
        { value: 0.873, itemStyle: { color: accent2 } }
      ],
      itemStyle: { borderRadius: [9, 9, 0, 0] },
      label: {
        show: true, position: 'top', fontWeight: 700, color: ink,
        formatter: function (p) { return p.value.toFixed(3); }
      }
    }]
  });

  // ---------- 窗口自适应 ----------
  window.addEventListener('resize', function () { c1.resize(); });
})();
