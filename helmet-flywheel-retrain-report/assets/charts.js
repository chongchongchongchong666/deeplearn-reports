// 图表初始化脚本（IIFE 避免污染全局作用域；颜色全部取自 CSS 变量）
(function () {
  'use strict';

  // ---------- 读取主题变量 ----------
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim() || '#4f6ef7';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#10b981';
  var ink = style.getPropertyValue('--ink').trim() || '#17233d';
  var muted = style.getPropertyValue('--muted').trim() || '#5b6b85';
  var rule = style.getPropertyValue('--rule').trim() || '#dde5f2';
  var warn = style.getPropertyValue('--warn').trim() || '#f59e0b';
  var danger = style.getPropertyValue('--danger').trim() || '#ef4444';

  /** 通用：注册 resize 监听（窗口尺寸变化时图表自适应） */
  function autoResize(chart) {
    window.addEventListener('resize', function () { chart.resize(); });
  }

  // ============================================================
  // 图 2：训练集构成（原生 vs 飞轮增强）
  // ============================================================
  var c1 = echarts.init(document.getElementById('chart-data'), null, { renderer: 'svg' });
  c1.setOption({
    animation: false,
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: { top: 0, textStyle: { color: muted } },
    grid: { left: 50, right: 20, bottom: 30, top: 46 },
    xAxis: {
      type: 'category',
      data: ['原生样本', 'copy-paste 拼贴', '光度/退化增强', '合计训练集'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, interval: 0 }
    },
    yAxis: {
      type: 'value', name: '图片数',
      nameTextStyle: { color: muted },
      splitLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted }
    },
    series: [{
      name: '图片数',
      type: 'bar',
      barWidth: '46%',
      data: [
        { value: 613, itemStyle: { color: accent } },
        { value: 340, itemStyle: { color: accent2 } },
        { value: 247, itemStyle: { color: warn } },
        { value: 1200, itemStyle: { color: accent } }
      ],
      label: { show: true, position: 'top', color: ink, fontWeight: 700 },
      itemStyle: { borderRadius: [8, 8, 0, 0] }
    }]
  });
  autoResize(c1);

  // ============================================================
  // 图 3：核心指标对比（基线 vs 飞轮版）
  // ============================================================
  var c2 = echarts.init(document.getElementById('chart-compare'), null, { renderer: 'svg' });
  c2.setOption({
    animation: false,
    tooltip: { appendToBody: true, trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, textStyle: { color: muted } },
    grid: { left: 54, right: 24, bottom: 30, top: 50 },
    xAxis: {
      type: 'category',
      data: ['mAP50', 'Precision', 'Recall'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, interval: 0, fontWeight: 700 }
    },
    yAxis: {
      type: 'value', min: 0.7, max: 0.9,
      axisLabel: { color: muted, formatter: '{value}' },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [
      {
        name: '基线（613 张）',
        type: 'bar', barWidth: '28%',
        data: [0.8613, 0.8110, 0.8570],
        itemStyle: { color: muted, borderRadius: [7, 7, 0, 0] },
        label: { show: true, position: 'top', color: muted, formatter: function (p) { return p.value.toFixed(4); } }
      },
      {
        name: '飞轮版（1200 张）',
        type: 'bar', barWidth: '28%',
        data: [0.8733, 0.8386, 0.8668],
        itemStyle: { color: accent2, borderRadius: [7, 7, 0, 0] },
        label: { show: true, position: 'top', color: accent2, fontWeight: 700, formatter: function (p) { return p.value.toFixed(4); } }
      }
    ]
  });
  autoResize(c2);

  // ============================================================
  // 图 4：mAP50 训练曲线（实测 results.csv 数据）
  // ============================================================
  // 基线 54 轮（runs/helmet_yolov8s/results.csv）
  var baseCurve = [0.38941, 0.48841, 0.27146, 0.6878, 0.6531, 0.70511, 0.47693, 0.76512,
    0.7899, 0.76588, 0.73455, 0.8012, 0.80406, 0.78596, 0.77388, 0.76046, 0.80208,
    0.83288, 0.78958, 0.81165, 0.8011, 0.82491, 0.82668, 0.82207, 0.76324, 0.76156,
    0.81742, 0.84798, 0.82903, 0.79526, 0.83272, 0.81964, 0.84307, 0.82652, 0.79178,
    0.83011, 0.82208, 0.82961, 0.86052, 0.81515, 0.82997, 0.85916, 0.78321, 0.84068,
    0.83307, 0.83085, 0.83457, 0.82806, 0.81624, 0.83094, 0.85497, 0.84343, 0.83515, 0.8432];

  // 飞轮版 41 轮（runs/helmet_flywheel/results.csv，第 26 轮最优 0.87318）
  var flyCurve = [0.73288, 0.61487, 0.00725, 0.45344, 0.65149, 0.77226, 0.72912, 0.80831,
    0.8151, 0.80451, 0.80201, 0.80282, 0.80949, 0.84249, 0.81833, 0.83518, 0.83668,
    0.82619, 0.85461, 0.85183, 0.85142, 0.82019, 0.80403, 0.8561, 0.83899, 0.87318,
    0.81249, 0.85823, 0.86014, 0.83041, 0.83279, 0.82594, 0.85084, 0.83072, 0.83943,
    0.84912, 0.82689, 0.86074, 0.85658, 0.85996, 0.84579];

  var epochs = [];
  for (var i = 1; i <= 54; i++) epochs.push(i);

  /** 生成曲线 series 数据：补齐缺失轮次为 null，保证 x 轴连续 */
  function toSeries(arr) {
    var out = [];
    for (var e = 1; e <= 54; e++) out.push(e <= arr.length ? arr[e - 1] : null);
    return out;
  }

  var c3 = echarts.init(document.getElementById('chart-curve'), null, { renderer: 'svg' });
  c3.setOption({
    animation: false,
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      valueFormatter: function (v) { return v == null ? '-' : Number(v).toFixed(4); }
    },
    legend: { top: 0, textStyle: { color: muted } },
    grid: { left: 54, right: 24, bottom: 34, top: 54 },
    xAxis: {
      type: 'category', data: epochs, boundaryGap: false,
      name: 'Epoch', nameTextStyle: { color: muted },
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted }
    },
    yAxis: {
      type: 'value', min: 0, max: 1,
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [
      {
        name: '基线 mAP50', type: 'line', data: toSeries(baseCurve),
        showSymbol: false, smooth: true,
        lineStyle: { width: 2.5, color: muted },
        markPoint: {
          symbol: 'pin', symbolSize: 46,
          itemStyle: { color: muted },
          label: { color: '#fff', fontWeight: 700, formatter: '最优\n0.8605' },
          data: [{ coord: [38, 0.86052] }]
        }
      },
      {
        name: '飞轮版 mAP50', type: 'line', data: toSeries(flyCurve),
        showSymbol: false, smooth: true,
        lineStyle: { width: 3, color: accent2 },
        areaStyle: { color: 'rgba(16,185,129,.10)' },
        markPoint: {
          symbol: 'pin', symbolSize: 52,
          itemStyle: { color: accent2 },
          label: { color: '#fff', fontWeight: 700, formatter: '最优\n0.8732' },
          data: [{ coord: [25, 0.87318] }]
        },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: danger, type: 'dashed', width: 1.5 },
          label: { color: danger, formatter: '基线最终 0.8613', position: 'insideEndTop' },
          data: [{ yAxis: 0.8613 }]
        }
      }
    ]
  });
  autoResize(c3);

  // ---------- Mermaid 初始化（流程图） ----------
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: true, theme: 'neutral', securityLevel: 'loose' });
  }
})();
