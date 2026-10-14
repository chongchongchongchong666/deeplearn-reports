// ============================================================
// 实验报告图表逻辑（ECharts，全部颜色取自 CSS 变量）
// ============================================================
(function () {
  'use strict';

  // ---- 读取主题 CSS 变量 ----
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var good = style.getPropertyValue('--good').trim();

  // 通用配置
  var palette = [accent, accent2, muted, accent + '99', accent2 + '99'];
  function makeChart(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    var c = echarts.init(el, null, { renderer: 'svg' });
    window.addEventListener('resize', function () { c.resize(); });
    return c;
  }
  var baseText = { color: muted, fontFamily: 'ISans, Microsoft YaHei, sans-serif' };

  // ============ 图3：YOLO 最终指标对比（分组柱状图：scratch / v1 / v2） ============
  var c1 = makeChart('chart-yolo-compare');
  if (c1) {
    c1.setOption({
      animation: false,
      color: [muted, accent2, accent],
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: {
        data: ['scratch 从零训练 (yolov8n 30轮)', 'transfer v1 (yolov8n 30轮)', 'transfer v2 (yolov8s 100轮)'],
        textStyle: baseText, top: 0
      },
      grid: { left: 60, right: 30, top: 55, bottom: 35 },
      xAxis: {
        type: 'category',
        data: ['mAP50', 'mAP50-95', 'Precision', 'Recall'],
        axisLabel: baseText, axisLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: 'value', max: 1,
        axisLabel: baseText, splitLine: { lineStyle: { color: rule } }
      },
      series: [
        {
          name: 'scratch 从零训练 (yolov8n 30轮)', type: 'bar', barMaxWidth: 30,
          data: [0.5321, 0.2973, 0.7361, 0.5247],
          itemStyle: { color: muted + '88', borderRadius: [5, 5, 0, 0] },
          label: { show: true, position: 'top', color: muted, fontFamily: 'JBMono', fontSize: 10 }
        },
        {
          name: 'transfer v1 (yolov8n 30轮)', type: 'bar', barMaxWidth: 30,
          data: [0.6664, 0.4188, 0.8934, 0.6471],
          itemStyle: { color: accent2, borderRadius: [5, 5, 0, 0] },
          label: { show: true, position: 'top', color: accent2, fontFamily: 'JBMono', fontSize: 10 }
        },
        {
          name: 'transfer v2 (yolov8s 100轮)', type: 'bar', barMaxWidth: 30,
          data: [0.816, 0.522, 0.908, 0.782],
          itemStyle: { color: accent, borderRadius: [5, 5, 0, 0] },
          label: { show: true, position: 'top', color: accent, fontFamily: 'JBMono', fontSize: 10, fontWeight: 700 }
        }
      ]
    });
  }

  // ============ 图4：YOLO 学习曲线（scratch/v1 各 30 轮，v2 优化版 100 轮） ============
  var scratchMap50 = [0.0,0.0018,0.2993,0.3661,0.389,0.4037,0.3991,0.4342,0.4435,0.4545,0.4562,0.4615,0.4583,0.4582,0.4636,0.4755,0.4778,0.4804,0.4873,0.4821,0.4971,0.4863,0.4959,0.5074,0.5139,0.5235,0.5353,0.5241,0.5335,0.5321];
  var scratchMap95 = [0.0,0.0004,0.1018,0.1389,0.1602,0.1719,0.158,0.2018,0.2215,0.226,0.2203,0.2369,0.2238,0.2265,0.2507,0.2479,0.2558,0.2637,0.2623,0.2627,0.2582,0.2708,0.2766,0.2709,0.2817,0.2898,0.2916,0.2918,0.2955,0.2971];
  var v1Map50 = [0.5219,0.5745,0.5441,0.5968,0.5865,0.5962,0.6241,0.6388,0.6285,0.6185,0.6364,0.6358,0.6364,0.6534,0.6482,0.6633,0.6543,0.6445,0.6607,0.6587,0.6588,0.6602,0.6603,0.6618,0.6591,0.6627,0.6635,0.6655,0.6608,0.6646];
  var v1Map95 = [0.3036,0.3166,0.3167,0.3363,0.3292,0.3503,0.3722,0.3659,0.3678,0.3829,0.3906,0.3927,0.392,0.3942,0.4033,0.4135,0.4053,0.3914,0.3992,0.4059,0.3918,0.3961,0.4107,0.4021,0.4074,0.4097,0.4172,0.419,0.4152,0.419];
  // v2 优化版（yolov8s, imgsz=832, 100 轮 + 数据增强）：results\transfer\results.csv 每轮真实指标
  var v2Map50 = [0.62777,0.65873,0.67631,0.68765,0.68443,0.69679,0.69132,0.6942,0.68619,0.71925,0.70784,0.71349,0.71767,0.71585,0.73195,0.72118,0.74561,0.71252,0.73187,0.72828,0.72549,0.73483,0.74079,0.72538,0.71852,0.74756,0.74885,0.74819,0.76175,0.76717,0.77441,0.75307,0.75484,0.76246,0.75964,0.75504,0.7488,0.74243,0.76202,0.75376,0.76764,0.75083,0.76296,0.76059,0.76566,0.75944,0.75894,0.75809,0.76147,0.76339,0.7721,0.77107,0.77949,0.77085,0.75908,0.76452,0.77958,0.76285,0.78258,0.77502,0.78539,0.77868,0.79546,0.7838,0.78246,0.77405,0.78906,0.77727,0.78755,0.793,0.78697,0.79664,0.79031,0.80542,0.79719,0.79295,0.80393,0.81064,0.80895,0.81297,0.81133,0.80653,0.80021,0.80774,0.80514,0.79428,0.79648,0.80504,0.79852,0.80874,0.79927,0.79685,0.80671,0.80757,0.80716,0.81156,0.80781,0.81224,0.81636,0.81619];
  var v2Map95 = [0.37591,0.40918,0.41403,0.4003,0.43006,0.42777,0.43381,0.41995,0.41252,0.45098,0.45191,0.44851,0.45565,0.46322,0.46242,0.44409,0.4556,0.44289,0.45904,0.46251,0.44262,0.47032,0.47118,0.44948,0.4436,0.46345,0.48257,0.48066,0.47606,0.48774,0.48644,0.48698,0.48681,0.48363,0.46627,0.49008,0.48347,0.47848,0.48711,0.49336,0.47616,0.47815,0.48193,0.48681,0.49648,0.49016,0.50006,0.49127,0.49441,0.49798,0.5051,0.48879,0.4978,0.49799,0.49925,0.49239,0.50132,0.49834,0.49853,0.50306,0.49833,0.5016,0.51895,0.50386,0.5082,0.5061,0.50653,0.50366,0.50684,0.50994,0.49875,0.5004,0.509,0.51163,0.51839,0.50737,0.51214,0.51492,0.51815,0.5201,0.51755,0.51663,0.51207,0.51505,0.51855,0.51203,0.50545,0.51726,0.52034,0.51518,0.51413,0.5185,0.51958,0.51332,0.51833,0.51892,0.51654,0.51967,0.51953,0.52265];
  var epochs = v2Map50.map(function (_, i) { return i + 1; });

  var c2 = makeChart('chart-yolo-curves');
  if (c2) {
    c2.setOption({
      animation: false,
      color: palette,
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: {
        data: ['scratch mAP50', 'scratch mAP50-95', 'v1 mAP50 (yolov8n)', 'v1 mAP50-95 (yolov8n)', 'v2 mAP50 (yolov8s)', 'v2 mAP50-95 (yolov8s)'],
        textStyle: baseText, top: 0
      },
      grid: { left: 60, right: 30, top: 55, bottom: 40 },
      xAxis: {
        type: 'category', data: epochs, name: 'Epoch',
        nameTextStyle: baseText, axisLabel: Object.assign({}, baseText, { interval: 9 }),
        axisLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: 'value', max: 0.9,
        axisLabel: baseText, splitLine: { lineStyle: { color: rule } }
      },
      series: [
        { name: 'scratch mAP50', type: 'line', data: scratchMap50, showSymbol: false, itemStyle: { color: muted }, lineStyle: { width: 2, type: 'solid' } },
        { name: 'scratch mAP50-95', type: 'line', data: scratchMap95, showSymbol: false, itemStyle: { color: muted }, lineStyle: { width: 1.5, type: 'dashed' } },
        { name: 'v1 mAP50 (yolov8n)', type: 'line', data: v1Map50, showSymbol: false, itemStyle: { color: accent2 }, lineStyle: { width: 2, type: 'solid' } },
        { name: 'v1 mAP50-95 (yolov8n)', type: 'line', data: v1Map95, showSymbol: false, itemStyle: { color: accent2 }, lineStyle: { width: 1.5, type: 'dashed' } },
        { name: 'v2 mAP50 (yolov8s)', type: 'line', data: v2Map50, showSymbol: false, itemStyle: { color: accent }, lineStyle: { width: 3 } },
        { name: 'v2 mAP50-95 (yolov8s)', type: 'line', data: v2Map95, showSymbol: false, itemStyle: { color: accent }, lineStyle: { width: 2, type: 'dashed' } }
      ]
    });
  }

  // ============ 图15：FER2013 混淆矩阵（热力图） ============
  var cmLabels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'];
  var cmData = [
    [0,0,260],[1,0,6],[2,0,60],[3,0,23],[4,0,74],[5,0,48],[6,0,11],
    [0,1,11],[1,1,29],[2,1,4],[3,1,0],[4,1,1],[5,1,5],[6,1,1],
    [0,2,61],[1,2,0],[2,2,235],[3,2,21],[4,2,67],[5,2,68],[6,2,37],
    [0,3,24],[1,3,0],[2,3,14],[3,3,778],[4,3,63],[5,3,26],[6,3,19],
    [0,4,41],[1,4,1],[2,4,38],[3,4,45],[4,4,418],[5,4,68],[6,4,7],
    [0,5,68],[1,5,3],[2,5,70],[3,5,36],[4,5,136],[5,5,267],[6,5,5],
    [0,6,9],[1,6,0],[2,6,47],[3,6,19],[4,6,12],[5,6,3],[6,6,349]
  ];
  var c3 = makeChart('chart-fer-cm');
  if (c3) {
    c3.setOption({
      animation: false,
      tooltip: {
        appendToBody: true,
        formatter: function (p) {
          return '真实: ' + cmLabels[p.value[1]] + '<br>预测: ' + cmLabels[p.value[0]] + '<br>样本数: ' + p.value[2];
        }
      },
      grid: { left: 90, right: 40, top: 20, bottom: 70 },
      xAxis: {
        type: 'category', data: cmLabels, name: '预测类别', nameLocation: 'middle', nameGap: 32,
        axisLabel: Object.assign({}, baseText, { rotate: 35 }),
        axisLine: { lineStyle: { color: rule } }, splitArea: { show: false }
      },
      yAxis: {
        type: 'category', data: cmLabels, name: '真实类别',
        axisLabel: baseText, axisLine: { lineStyle: { color: rule } }, splitArea: { show: false }
      },
      visualMap: {
        min: 0, max: 778, calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
        textStyle: baseText,
        inRange: { color: [bg2, accent2, accent] }
      },
      series: [{
        type: 'heatmap', data: cmData,
        label: {
          show: true, color: ink, fontFamily: 'JBMono', fontSize: 11,
          formatter: function (p) { return p.value[2] > 0 ? p.value[2] : ''; }
        },
        itemStyle: { borderColor: rule, borderWidth: 1 },
        emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.25)' } }
      }]
    });
  }

  // ============ 图18：检索 Precision@k 对比（分组柱状图） ============
  var c4 = makeChart('chart-retrieval');
  if (c4) {
    c4.setOption({
      animation: false,
      color: [accent, muted],
      tooltip: { trigger: 'axis', appendToBody: true, valueFormatter: function (v) { return v + '%'; } },
      legend: { data: ['CNN 特征检索', '随机基线'], textStyle: baseText, top: 0 },
      grid: { left: 60, right: 30, top: 55, bottom: 35 },
      xAxis: {
        type: 'category', data: ['Precision@1', 'Precision@5', 'Precision@10'],
        axisLabel: baseText, axisLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: 'value', max: 100, name: '准确率 (%)', nameTextStyle: baseText,
        axisLabel: baseText, splitLine: { lineStyle: { color: rule } }
      },
      series: [
        {
          name: 'CNN 特征检索', type: 'bar', barMaxWidth: 56,
          data: [74.8, 70.7, 68.4],
          itemStyle: { color: accent, borderRadius: [5, 5, 0, 0] },
          label: { show: true, position: 'top', color: accent, fontFamily: 'JBMono', fontWeight: 700, formatter: '{c}%' }
        },
        {
          name: '随机基线', type: 'bar', barMaxWidth: 56,
          data: [9.8, 10.0, 10.1],
          itemStyle: { color: muted + '88', borderRadius: [5, 5, 0, 0] },
          label: { show: true, position: 'top', color: muted, fontFamily: 'JBMono', formatter: '{c}%' }
        }
      ]
    });
  }
})();
