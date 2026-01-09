/**
 * 管理员页面工具类
 * 提供管理员页面常用的工具函数和数据处理方法
 *
 * @module views/AdminPage/js/AdminPageUtils
 * @description 封装管理员页面相关的工具函数，包括学生数据获取和处理
 */

import {ElMessage} from 'element-plus'
import SpecialPasswordApi from "../../../api/SpecialPasswordApi";
import StudentApi from "../../../api/StudentApi";
import {AdminPageConfig} from "./AdminPageConfig";
import type { StudentInfo, RawStudentData, LevelMap } from './types';

/**
 * 管理员页面工具类
 * 提供管理员页面相关的工具函数
 *
 * @class AdminPageUtils
 * @description 处理管理员页面中的数据获取和常用操作
 */
class AdminPageUtils {
	/**
	 * 验证特殊密码
	 * 验证提供的特殊密码是否正确
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码
	 * @returns {Promise<boolean>} 验证结果，true表示密码正确，false表示密码错误
	 * @example
	 * // 验证特殊密码
	 * const isValid = await AdminPageUtils.validateSpecialPassword('password123')
	 * if (isValid) {
	 *   console.log('密码正确')
	 * } else {
	 *   console.log('密码错误')
	 * }
	 */
	static async validateSpecialPassword(specialPassword: string): Promise<boolean> {
		try {
			const response = await SpecialPasswordApi.validateSpecialPassword(specialPassword)
			// response.data为true表示密码正确，null表示密码错误
			return response.data === true
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "网络问题"
			ElMessage.error(`验证密码失败: ${errorMessage}`)
			return false
		}
	}

	/**
	 * 获取学生综合信息
	 * 通过特殊密码获取指定ID范围内学生的综合信息
	 *
	 * @static
	 * @param {string} specialPassword - 特殊密码
	 * @returns {Promise<StudentInfo[]>} 学生综合信息数组
	 * @example
	 * // 获取ID 1-100 的学生综合信息
	 * const students = await AdminPageUtils.getStudentComprehensiveInfo('password123', 1, 100)
	 * console.log(students)
	 */
	static async getStudentComprehensiveInfo(specialPassword: string): Promise<StudentInfo[]> {
		try {
			// 1. 初始化变量
			const allRawStudents: RawStudentData[] = []; // 存储所有批次的原始数据
			let start = 1; // 每次请求的起始索引
			const batchSize = 1000; // 每批次获取的数量
			const stopThreshold = 500; // 停止循环的阈值（获取数<500则停止）

			// 2. 循环分批获取数据
			while (true) {
				const end = start + batchSize - 1; // 计算当前批次的结束索引（1-1000, 1001-2000,...）

				// 调用API获取当前批次的数据
				const response = await SpecialPasswordApi.getStudentComprehensiveInfo(
					specialPassword,
					start,
					end
				);

				// 获取当前批次的有效数据（兜底空数组）
				const currentBatch = response.data || [];
				// 将当前批次数据合并到总数组
				allRawStudents.push(...currentBatch);

				// 3. 判断是否停止循环：当前批次数据<500条则终止
				if (currentBatch.length < stopThreshold) {
					break;
				}

				// 4. 未停止则更新起始索引，准备下一批次请求
				start += batchSize;
			}

			// 5. 格式化所有获取到的学生数据（复用原格式化逻辑）
			// 定义等级名称映射（提取到外部，避免循环内重复定义）
			const levelMap: LevelMap = {
				0: '社团成员',
				1: '普通成员',
				2: '核心成员',
				3: '管理员'
			};

			return allRawStudents.map((student: RawStudentData): StudentInfo => {
				const studentLevel = student.levelCode ?? 0;
				const studentGender = student.gender ?? '';

				return {
					id: student.id ?? 0,
					studentId: String(student.studentId ?? ''),
					name: student.name ?? '',
					grade: student.grade ?? 1,
					major: student.major ?? '',
					classNum: student.classNum ?? 1,
					gender: studentGender,
					phoneNumber: student.phoneNumber ?? '',
					attendanceCount: student.attendanceCount ?? 0,
					totalPoints: student.totalPoints ?? 0,
					level: studentLevel,
					adminId: student.adminStudentInfoId ?? null,
					// 添加等级名称
					levelName: levelMap[studentLevel] ?? '未知',
					// 添加性别显示名称
					genderDisplay: studentGender === '男' ? '男' : studentGender === '女' ? '女' : '未知',
					// 使用StudentApi的getAvatarUrl方法生成头像URL
					avatarUrl: StudentApi.getAvatarUrl(student.id, AdminPageConfig.avatarSize) as string | null | undefined
				};
			});

		} catch (error) {
			// 异常处理：保留原逻辑，增强错误信息
			const errorMessage = error instanceof Error ? error.message : "网络问题";
			ElMessage.error(`获取学生综合信息失败, 原因: ${errorMessage}`);
			return [];
		}
	}
}

/**
 * 导出管理员页面工具类
 * @exports AdminPageUtils
 */
export default AdminPageUtils
