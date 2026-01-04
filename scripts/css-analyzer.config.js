export default {
  content: [
    './index.html',
    './src/**/*.{js,vue,jsx,ts,tsx}',
  ],
  css: ['./src/**/*.{css,scss}'],
  extractors: [
    {
      extractor: (content) => {
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
        return broadMatches.concat(innerMatches)
      },
      extensions: ['html', 'vue', 'js', 'jsx', 'ts', 'tsx']
    }
  ],
  safelist: {
    standard: [
      /^el-/,
      /^dark$/,
      /^light$/,
      /^theme-toggle/,
      /data-v-/,
      /^v-/,
      /^is-/,
      /^has-/,
      /^echarts/,
      /^fullcalendar/,
    ],
    deep: [
      /^el-(button|input|select|table|dialog|message|notification|loading|popover|tooltip|dropdown|menu|form|form-item|card|tabs|tab-pane|pagination|date-picker|time-picker|upload|progress|tag|badge|alert|breadcrumb|steps|carousel|collapse|timeline|tree|transfer|cascader|color-picker|rate|slider|switch|radio|checkbox|divider|link|backtop|page-header|avatar|skeleton|empty|result|descriptions|statistic|anchor|affix|space|image|image-viewer|drawer|popconfirm|calendar|card|container|header|aside|main|footer|row|col|scrollbar|infinite-scroll|loading|message-box|notification|message|popover|tooltip|dropdown|menu|menu-item|submenu|menu-item-group|breadcrumb|breadcrumb-item|page-header|tabs|tab-pane|steps|step|carousel|carousel-item|collapse|collapse-item|timeline|timeline-item|tree|tree-node|transfer|cascader|cascader-panel|cascader-node|color-picker|rate|slider|switch|radio|radio-group|radio-button|checkbox|checkbox-group|checkbox-button|divider|link|backtop|page-header|avatar|skeleton|skeleton-item|empty|result|descriptions|descriptions-item|statistic|anchor|anchor-link|affix|space|space-item|image|image-viewer|drawer|popconfirm|calendar|card|container|header|aside|main|footer|row|col|scrollbar|infinite-scroll|loading|message-box|notification|message|popover|tooltip|dropdown|dropdown-menu|dropdown-item|menu|menu-item|submenu|menu-item-group|breadcrumb|breadcrumb-item|page-header|tabs|tab-pane|steps|step|carousel|carousel-item|collapse|collapse-item|timeline|timeline-item|tree|tree-node|transfer|cascader|cascader-panel|cascader-node|color-picker|rate|slider|switch|radio|radio-group|radio-button|checkbox|checkbox-group|checkbox-button|divider|link|backtop|page-header|avatar|skeleton|skeleton-item|empty|result|descriptions|descriptions-item|statistic|anchor|anchor-link|affix|space|space-item|image|image-viewer|drawer|popconfirm|calendar)/,
    ],
    greedy: [
      /^el-/,
      /^echarts/,
      /^fullcalendar/,
    ]
  },
  variables: true,
  keyframes: true,
  fontFace: true,
  rejected: true,
  rejectedCss: true,
  printRejected: false,
  stdin: false,
  stdout: false,
  minify: false,
  output: null,
  variables: true,
  keyframes: true,
  fontFace: true,
}

