/**
 * 用户状态管理Store类型声明文件
 * 为user.js提供TypeScript类型支持
 *
 * @file user.d.ts
 * @description 定义UserStore的类型声明
 */

import { Store } from 'pinia'

/**
 * 用户信息接口
 * @interface UserInfo
 */
export interface UserInfo {
	/** 用户ID */
	id?: number
	/** 用户名 */
	username?: string
	/** 用户邮箱 */
	email?: string
	/** 用户头像URL */
	avatar?: string
	/** 用户昵称 */
	nickname?: string
	/** 学生学号 */
	studentId?: string
	/** 学生数据库表ID */
	studentDatabaseTableId?: number
	/** 其他动态属性 */
	[key: string]: any
}

/**
 * 学生等级信息接口
 * @interface StudentLevel
 */
export interface StudentLevel {
	/** 等级数值 */
	level: number
	/** 等级名称 */
	name: string
	/** 当前积分 */
	points: number
	/** 下一等级所需积分 */
	nextLevelPoints: number
}

/**
 * User Store状态接口
 * @interface UserState
 */
export interface UserState {
	/** 用户是否已登录 */
	isLoggedIn: boolean
	/** 用户信息对象 */
	userInfo: UserInfo | null
	/** 用户认证token */
	token: string | null
	/** 学生等级信息 */
	studentLevel: StudentLevel | null
}

/**
 * User Store类型定义
 * @interface UserStore
 */
export interface UserStore extends Store<'user', UserState> {
	/** 用户ID */
	userId: number | null
	/** 用户名 */
	username: string | null
	/** 是否已认证 */
	isAuthenticated: boolean

	/**
	 * 设置用户信息和token
	 * @param info - 用户信息对象
	 * @param token - 用户认证token
	 */
	setUserInfo(info: UserInfo | null, token: string | null): void

	/**
	 * 设置学生等级信息
	 * @param level - 学生等级信息对象
	 */
	setStudentLevel(level: StudentLevel | null): void

	/**
	 * 用户登出
	 */
	logout(): void

	/**
	 * 从本地存储初始化用户状态
	 */
	initFromStorage(): void
}

/**
 * 使用用户Store的组合式函数
 * @returns {UserStore} 用户Store实例
 */
export declare function useUserStore(): UserStore

export default useUserStore
