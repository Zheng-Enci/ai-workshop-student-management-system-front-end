/**
 * 学生信息管理类
 * 使用单例模式管理学生个人信息
 * 类创建时自动从localStorage获取token并调用接口获取学生信息
 *
 * @module stores/ts/StudentManager
 * @description 提供学生信息管理、登录状态检查等功能
 * @author ZhengEnCi zheng_enci_work@foxmail.com
 * @remarks 区别于user.ts，本文件专门针对学生用户，包含学号(studentId)等学生特有字段
 */

import StudentApi from '@/api/ts/StudentApi'
import {useRouter} from 'vue-router'

/**
 * 学生信息接口定义
 * @interface StudentInfo
 * @property {number} databaseId - 数据库表ID
 * @property {string} studentId - 学号
 * @property {string} name - 姓名
 * @property {string} gender - 性别
 * @property {string} phoneNumber - 手机号
 * @property {string} college - 学院
 * @property {number} grade - 年级
 * @property {string} major - 专业
 * @property {number} classNum - 班级
 */
export interface StudentInfo {
	databaseId: number
	studentId: string
	name: string
	gender: string
	phoneNumber: string
	college: string
	grade: number
	major: string
	classNum: number
}

/**
 * 学生信息管理类
 * 使用单例模式，应用启动时自动初始化
 */
class StudentManager {
	/** 学生信息 */
	public studentInfo: StudentInfo | null = null

	/** 用户认证token */
	public token: string | null = null

	/**
	 * 构造函数
	 * 创建实例时自动初始化：从localStorage获取token，token不存在则跳转登录，存在则调用接口获取学生信息和数据库ID
	 */
	constructor() {
		const cachedData = localStorage.getItem('studentInfo')
		const cachedTime = localStorage.getItem('studentInfoSavedTime')

		if (cachedData && cachedTime) {
			const cacheAge = Date.now() - parseInt(cachedTime)
			const twentyFourHours = 24 * 60 * 60 * 1000

			if (cacheAge < twentyFourHours) {
				this.studentInfo = JSON.parse(cachedData)
				this.token = localStorage.getItem('token')
				return
			}
		}

		const token = localStorage.getItem('token')
		if (!token) {
			useRouter().push('/login')
			return
		}

		this.token = token

		Promise.all([
			StudentApi.getStudentProfile(token),
			StudentApi.getStudentDatabaseId(token)
		])
			.then(([profileRes, idRes]) => {
				if (profileRes.code === 200 && idRes.code === 200) {
					this.studentInfo = {
						...profileRes.data,
						databaseId: idRes.data
					}
					localStorage.setItem('studentInfo', JSON.stringify(this.studentInfo))
					localStorage.setItem('studentInfoSavedTime', Date.now().toString())
				} else {
					this.logout()
					useRouter().push('/login')
				}
			})
			.catch(() => {
				this.logout()
				useRouter().push('/login')
			})
	}

	/**
	 * 获取学号
	 * @returns {string | null} 学号或null
	 */
	public getStudentId(): string | null {
		return this.studentInfo?.studentId ?? null
	}

	/**
	 * 获取学生数据库ID
	 * @returns {number | null} 数据库ID或null
	 */
	public getDatabaseId(): number | null {
		return this.studentInfo?.databaseId ?? null
	}

	/**
	 * 获取学生姓名
	 * @returns {string | null} 姓名或null
	 */
	public getName(): string | null {
		return this.studentInfo?.name ?? null
	}

	/**
	 * 获取性别
	 * @returns {string | null} 性别或null
	 */
	public getGender(): string | null {
		return this.studentInfo?.gender ?? null
	}

	/**
	 * 获取手机号
	 * @returns {string | null} 手机号或null
	 */
	public getPhoneNumber(): string | null {
		return this.studentInfo?.phoneNumber ?? null
	}

	/**
	 * 获取学院
	 * @returns {string | null} 学院或null
	 */
	public getCollege(): string | null {
		return this.studentInfo?.college ?? null
	}

	/**
	 * 获取年级
	 * @returns {number | null} 年级或null
	 */
	public getGrade(): number | null {
		return this.studentInfo?.grade ?? null
	}

	/**
	 * 获取专业
	 * @returns {string | null} 专业或null
	 */
	public getMajor(): string | null {
		return this.studentInfo?.major ?? null
	}

	/**
	 * 获取班级
	 * @returns {number | null} 班级或null
	 */
	public getClassNum(): number | null {
		return this.studentInfo?.classNum ?? null
	}

	/**
	 * 学生登出
	 * 清除所有学生相关状态
	 *
	 * @returns {void}
	 */
	public logout(): void {
		this.studentInfo = null
		this.token = null
		localStorage.removeItem('token')
		localStorage.removeItem('studentInfo')
		localStorage.removeItem('studentInfoSavedTime')
	}
}

/**
 * 学生管理单例实例
 * 应用启动时自动创建并初始化
 */
const studentManager = new StudentManager()

export default studentManager
