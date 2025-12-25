import StudentApi from "@/api/StudentApi";

import AttendanceApi from "@/api/AttendanceApi";
import PointsApi from "@/api/PointsApi";
import Config from "./Config";
import {ElMessage} from "element-plus";

class PersonalInformation {
	// 创建学生对象模板
	static createStudentObject(studentInfoId) {
		return {
			studentInfoId,
			name: null,
			gender: null,
			college: null,
			grade: null,
			major: null,
			levelCode: null,
			avatarUrl: null,
			totalPoints: 0,
			attendanceCount: 0,
			attendancePoints: 0,
			activityPoints: 0
		};
	}

	// 获取学生个人信息
	static async getStudentProfileByStudentInfoId(studentInfoId) {
		const student = PersonalInformation.createStudentObject(studentInfoId);

		// 批量获取基本信息字段（并行）
		const fieldNames = ["name", "gender", "college", "grade", "major"];
		const fieldPromises = fieldNames.map(fieldName =>
			StudentApi.getStudentPublicFieldValueById(studentInfoId, fieldName)
				.then(response => {
					if (response.code === 200) {
						return { fieldName, value: response.data };
					} else if (response.message) {
						ElMessage.error(`获取学生个人信息失败：${response.message}`);
					} else {
						ElMessage.error('获取学生个人信息失败，请检查网络连接或联系管理员');
					}
					return null;
				})
				.catch(() => {
					ElMessage.error(`获取学生${fieldName}失败，请检查网络连接或联系管理员`);
					return null;
				})
		);

		// 批量获取扩展信息（并行）
		const [levelPromise, pointsPromise, attendancePromise] = [
			StudentApi.getStudentLevelByInfoId(studentInfoId)
				.then(response => {
					if (response.code === 200) return response.data;
					if (response.message) ElMessage.error(`获取学生等级失败：${response.message}`);
					else ElMessage.error('获取学生等级失败，请检查网络连接或联系管理员');
					return null;
				})
				.catch(() => {
					ElMessage.error('获取学生等级失败，请检查网络连接或联系管理员');
					return null;
				}),

			PointsApi.getTotalActivityPointsByStudentInfoId(studentInfoId)
				.then(response => {
					if (response.code === 200) return response.data;
					if (response.message) ElMessage.error(`获取学生活动积分失败：${response.message}`);
					else ElMessage.error('获取学生活动积分失败，请检查网络连接或联系管理员');
					return null;
				})
				.catch(() => {
					ElMessage.error('获取学生活动积分失败，请检查网络连接或联系管理员');
					return null;
				}),

			AttendanceApi.getTotalAttendanceCountByStudentInfoId(studentInfoId)
				.then(response => {
					if (response.code === 200) return response.data;
					if (response.message) ElMessage.error(`获取学生签到次数失败：${response.message}`);
					else ElMessage.error('获取学生签到次数失败，请检查网络连接或联系管理员');
					return null;
				})
				.catch(() => {
					ElMessage.error('获取学生签到次数失败，请检查网络连接或联系管理员');
					return null;
				})
		];

		// 等待所有请求完成
		const fieldResults = await Promise.all(fieldPromises);
		const [levelCode, activityPoints, attendanceCount] = await Promise.all([levelPromise, pointsPromise, attendancePromise]);

		// 填充基本信息字段
		fieldResults.forEach(result => {
			if (result && result.fieldName) {
				student[result.fieldName] = result.value;
			}
		});

		// 填充扩展信息
		student.avatarUrl = StudentApi.getAvatarUrl(studentInfoId, Config.AVATAR_SIZE);
		student.levelCode = levelCode;
		student.activityPoints = activityPoints || 0;
		student.attendanceCount = attendanceCount || 0;

		student.attendancePoints = Math.round(student.attendanceCount * 0.64);
		student.totalPoints = student.activityPoints + student.attendancePoints;

		return student;
	}
}

export default PersonalInformation;
