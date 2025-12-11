const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  API_BASE_URL: isProduction 
    ? 'https://10257qh6684dd.vicp.fun/zheng_en_ci'
    : 'http://localhost:7001',
  VERIFICATION_CODE_URL: 'http://10.0.48.168:7001/api/v1/attendance/verification-code',
  APP_TITLE: 'AI坊学生管理系统',
  APP_VERSION: '1.0.0'
}

export default config
