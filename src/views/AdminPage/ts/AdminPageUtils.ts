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
import {adminPageConfig, AdminPageConfig} from "./AdminPageConfig";
import type {StudentInfo, RawStudentData, LevelMap} from './types';

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
					avatarUrl: StudentApi.getAvatarUrl(student.id, adminPageConfig.studentAvatarSize) as string | null | undefined
				};
			});

		} catch (error) {
			// 异常处理：保留原逻辑，增强错误信息
			const errorMessage = error instanceof Error ? error.message : "网络问题";
			ElMessage.error(`获取学生综合信息失败, 原因: ${errorMessage}`);
			return [];
		}
	}

	/**
	 * 搜索学生信息
	 * 根据多个搜索关键词在学生列表的所有字段（除了头像URL）中查找匹配的学生
	 * 学生必须匹配所有关键词（AND 逻辑）
	 *
	 * @static
	 * @param {StudentInfo[]} students - 学生列表
	 * @param {string[]} keywords - 搜索关键词数组
	 * @returns {StudentInfo[]} 匹配的学生列表
	 * @example
	 * // 单关键词搜索
	 * const students = AdminPageUtils.searchStudents(studentList, ['张三'])
	 * console.log(students)
	 *
	 * // 多关键词搜索（学生必须同时包含所有关键词）
	 * const computerStudents = AdminPageUtils.searchStudents(studentList, ['张三', '计算机'])
	 */
	static searchStudents(students: StudentInfo[], keywords: string[]): StudentInfo[] {
		// 如果关键词数组为空或全是空字符串，返回所有学生
		if (!keywords || keywords.length === 0 || keywords.every(k => !k || k.trim() === '')) {
			return students;
		}

		// 过滤空关键词并将每个关键词转为小写
		const lowerKeywords = keywords.filter(k => k && k.trim() !== '').map(k => k.toLowerCase().trim());

		// 第一步：先搜索匹配的学生
		const matchedStudents = students.filter((student) => {
			// 学生必须匹配所有关键词
			return lowerKeywords.every((lowerKeyword) => {
				return (
					// 唯一ID
					String(student.id).includes(lowerKeyword) ||
					// 学号
					student.studentId.toLowerCase().includes(lowerKeyword) ||
					// 姓名
					student.name.toLowerCase().includes(lowerKeyword) ||
					// 年级
					String(student.grade).includes(lowerKeyword) ||
					// 专业
					student.major.toLowerCase().includes(lowerKeyword) ||
					// 班级（包含"班"字）
					(String(student.classNum) + '班').includes(lowerKeyword) ||
					String(student.classNum).includes(lowerKeyword) ||
					// 性别（男/女）
					student.gender.toLowerCase().includes(lowerKeyword) ||
					// 性别显示（男/女/未知）
					student.genderDisplay.toLowerCase().includes(lowerKeyword) ||
					// 手机号
					student.phoneNumber.includes(lowerKeyword) ||
					// 签到次数
					String(student.attendanceCount).includes(lowerKeyword) ||
					// 总积分
					String(student.totalPoints).includes(lowerKeyword) ||
					// 等级（0, 1, 2, 3）
					String(student.level).includes(lowerKeyword) ||
					// 等级名称（社团成员、普通成员、核心成员、管理员）
					student.levelName.toLowerCase().includes(lowerKeyword) ||
					// 所属管理员ID
					(student.adminId !== null && String(student.adminId).includes(lowerKeyword))
				);
			});
		});

		// 第二步：收集匹配学生的ID集合（用于去重）
		const matchedStudentIds = new Set(matchedStudents.map(s => s.id));

		// 第三步：如果匹配的学生中有管理员，则添加他管理的所有学生
		matchedStudents.forEach(student => {
			// 如果匹配的学生是管理员（level = 3）
			if (student.level === 3) {
				// 查找所有由这个管理员管理的学生
				const managedStudents = students.filter(s => s.adminId === student.id);
				// 将这些学生添加到结果中
				managedStudents.forEach(s => matchedStudentIds.add(s.id));
			}
		});
		// 第四步：根据ID集合返回最终结果
		return students.filter(student => matchedStudentIds.has(student.id));
	}

}

/**
 * 导出管理员页面工具类
 * @exports AdminPageUtils
 */
export default AdminPageUtils
