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

		for (const fieldName of ["name", "gender", "college", "grade", "major"]) {
			const response = await StudentApi.getStudentPublicFieldValueById(studentInfoId, fieldName);
			if (response.code === 200) {
				student[fieldName] = response.data;
			} else if (response.message) {
				ElMessage.error(`获取学生个人信息失败：${response.message}`);
			} else {
				ElMessage.error('获取学生个人信息失败，请检查网络连接或联系管理员');
			}
		}
		student.avatarUrl = StudentApi.getAvatarUrl(studentInfoId, Config.AVATAR_SIZE);

		// 获取学生等级
		const levelResponse = await StudentApi.getStudentLevelByInfoId(studentInfoId);
		if (levelResponse.code === 200) {
			student.levelCode = levelResponse.data;
		} else if (levelResponse.message) {
			ElMessage.error(`获取学生等级失败：${levelResponse.message}`);
		} else {
			ElMessage.error('获取学生等级失败，请检查网络连接或联系管理员');
		}

		// 获取活动积分
		const pointsResponse = await PointsApi.getTotalActivityPointsByStudentInfoId(studentInfoId);
		if (pointsResponse.code === 200) {
			student.activityPoints = pointsResponse.data;
		} else if (pointsResponse.message) {
			ElMessage.error(`获取学生活动积分失败：${pointsResponse.message}`);
		} else {
			ElMessage.error('获取学生活动积分失败，请检查网络连接或联系管理员');
		}

		// 获取签到次数
		const attendanceResponse = await AttendanceApi.getTotalAttendanceCountByStudentInfoId(studentInfoId);
		if (attendanceResponse.code === 200) {
			student.attendanceCount = attendanceResponse.data;
		} else if (attendanceResponse.message) {
			ElMessage.error(`获取学生签到次数失败：${attendanceResponse.message}`);
		} else {
			ElMessage.error('获取学生签到次数失败，请检查网络连接或联系管理员');
		}

		student.attendancePoints = Math.round(student.attendanceCount * 0.64);
		student.totalPoints = student.activityPoints + student.attendancePoints;

		return student;
	}
}

export default PersonalInformation;
