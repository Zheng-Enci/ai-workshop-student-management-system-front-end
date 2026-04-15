/**
 * 注册表单数据类
 *
 * @description 封装注册表单的数据模型和默认值
 * @class RegisterFormData
 */
export default class RegisterFormData {
	/**
	 * 学生姓名
	 * @type {string}
	 */
	public name: string

	/**
	 * 学号（10位数字，20-30开头）
	 * @type {string}
	 */
	public studentId: string

	/**
	 * 性别（男/女）
	 * @type {string}
	 */
	public gender: string

	/**
	 * 手机号（11位，13-9开头）
	 * @type {string}
	 */
	public phoneNumber: string

	/**
	 * 学院（下拉选择）
	 * @type {string}
	 */
	public college: string

	/**
	 * 专业（手动输入）
	 * @type {string}
	 */
	public major: string

	/**
	 * 年级（1-5）
	 * @type {string}
	 */
	public grade: string

	/**
	 * 班级（1-100的数字）
	 * @type {number | null}
	 */
	public classNum: number | null

	/**
	 * 密码（6-16位）
	 * @type {string}
	 */
	public password: string

	/**
	 * 确认密码（与密码一致）
	 * @type {string}
	 */
	public confirmPassword: string

	/**
	 * 邀请码（UUID格式）
	 * @type {string}
	 */
	public invitationCode: string

	/**
	 * 构造函数 - 初始化表单数据为默认值
	 */
	constructor() {
		this.name = ''
		this.studentId = ''
		this.gender = ''
		this.phoneNumber = ''
		this.college = ''
		this.major = ''
		this.grade = ''
		this.classNum = null
		this.password = ''
		this.confirmPassword = ''
		this.invitationCode = ''
	}

	/**
	 * 重置表单数据为默认值
	 * @method reset
	 */
	public reset(): void {
		this.name = ''
		this.studentId = ''
		this.gender = ''
		this.phoneNumber = ''
		this.college = ''
		this.major = ''
		this.grade = ''
		this.classNum = null
		this.password = ''
		this.confirmPassword = ''
		this.invitationCode = ''
	}

	/**
	 * 获取用于提交的数据对象
	 * @method toSubmitData
	 * @returns {Object} 转换后的提交数据（年级和班级转为数字类型）
	 */
	public toSubmitData(): {
		name: string
		studentId: string
		gender: string
		phoneNumber: string
		college: string
		major: string
		grade: number | null
		classNum: number | null
		password: string
		confirmPassword: string
		invitationCode: string
	} {
		return {
			name: this.name,
			studentId: this.studentId,
			gender: this.gender,
			phoneNumber: this.phoneNumber,
			college: this.college,
			major: this.major,
			grade: this.grade ? Number(this.grade) : null,
			classNum: this.classNum ? Number(this.classNum) : null,
			password: this.password,
			confirmPassword: this.confirmPassword,
			invitationCode: this.invitationCode
		}
	}
}
