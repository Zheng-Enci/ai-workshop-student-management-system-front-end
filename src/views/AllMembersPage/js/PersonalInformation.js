import StudentApi from "@/api/StudentApi";

import AttendanceApi from "@/api/AttendanceApi";
import PointsApi from "@/api/PointsApi";
import Config from "./Config";

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
			if ("code" in response && response.code === 200) {
				student[fieldName] = response.data;
			}
		}
		student.avatarUrl = StudentApi.getAvatarUrl(studentInfoId, Config.AVATAR_SIZE);
		student.activityPoints = await PointsApi.getTotalActivityPointsByStudentInfoId(studentInfoId);
		student.attendanceCount = await AttendanceApi.getTotalAttendanceCountByStudentInfoId(studentInfoId);
		student.attendancePoints = Math.round(student.attendanceCount * 0.64);
	}
}
