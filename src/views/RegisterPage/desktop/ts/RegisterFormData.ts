/**
 * 注册表单数据类
 *
 * @description 封装注册表单的数据模型和默认值
 * @class RegisterFormData
 */

/**
 * 注册表单数据结构接口
 * @interface IRegisterFormData
 */
interface IRegisterFormData {
	name: string
	studentId: string
	gender: string
	phoneNumber: string
	college: string
	major: string
	grade: string
	classNum: number | null
	password: string
	confirmPassword: string
	invitationCode: string
}

/**
 * 默认表单数据值
 * @constant DEFAULT_FORM_DATA
 */
const DEFAULT_FORM_DATA: IRegisterFormData = {
	name: '',
	studentId: '',
	gender: '',
	phoneNumber: '',
	college: '',
	major: '',
	grade: '',
	classNum: null,
	password: '',
	confirmPassword: '',
	invitationCode: ''
}

export default class RegisterFormData implements IRegisterFormData {
	/**
	 * 学生姓名
	 * @type {string}
	 */
	public name: string

	/**
	 * 学号，长度为10位数字，起始范围为20-30
	 * @type {string}
	 */
	public studentId: string

	/**
	 * 性别（男/女）
	 * @type {string}
	 */
	public gender: string

	/**
	 * 手机号，长度为11位数字，起始范围为13-19
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
	 * 年级（一至五年级）
	 * @type {string}
	 */
	public grade: string

	/**
	 * 班级（一至一百的数字）
	 * @type {number | null}
	 */
	public classNum: number | null

	/**
	 * 密码（六至十六位）
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
	 * @constructor
	 * @param {Partial<IRegisterFormData>} initialData - 可选的初始数据
	 */
	constructor(initialData: Partial<IRegisterFormData> = {}) {
		const data = { ...DEFAULT_FORM_DATA, ...initialData }
		this.name = data.name
		this.studentId = data.studentId
		this.gender = data.gender
		this.phoneNumber = data.phoneNumber
		this.college = data.college
		this.major = data.major
		this.grade = data.grade
		this.classNum = data.classNum
		this.password = data.password
		this.confirmPassword = data.confirmPassword
		this.invitationCode = data.invitationCode
	}

	/**
	 * 获取用于提交的数据对象
	 * @method toSubmitData
	 * @returns {Object} 转换后的提交数据（年级和班级转为数字类型）
	 */
	public toSubmitData(): Omit<IRegisterFormData, 'grade' | 'classNum' | 'confirmPassword'> & {
		grade: number | undefined
		classNum: number | undefined
	} {
		return {
			name: this.name,
			studentId: this.studentId,
			gender: this.gender,
			phoneNumber: this.phoneNumber,
			college: this.college,
			major: this.major,
			grade: this.grade ? Number(this.grade) : undefined,
			classNum: this.classNum ? Number(this.classNum) : undefined,
			password: this.password,
			invitationCode: this.invitationCode
		}
	}
}
