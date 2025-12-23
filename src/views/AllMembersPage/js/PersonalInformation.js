import StudentApi from "@/api/StudentApi";

import Config from "./Config.js";

class PersonalInformation {
	// 静态字段映射配置 - 统一使用简洁写法
	static FIELD_MAPPING = {
		name: { field: 'name', api: StudentApi.getStudentPublicFieldValueById},
		gender: { field: 'gender', api: StudentApi.getStudentPublicFieldValueById},
		college: { field: 'college', api: StudentApi.getStudentPublicFieldValueById},
		grade: { field: 'grade', api: StudentApi.getStudentPublicFieldValueById},
		major: { field: 'major', api: StudentApi.getStudentPublicFieldValueById},
		levelCode: { field: 'level', api: StudentApi.getStudentLevelByInfoId}
	};
	
	// 获取字段映射配置的静态方法
	static getFieldMapping() {
		return PersonalInformation.FIELD_MAPPING;
	}

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

	// 获取单个字段信息
	static async fetchField(studentInfoId, fieldName, apiFunction) {
		try {
			const response = await apiFunction(studentInfoId, fieldName);
			return response || { code: 400, data: null };
		} catch (error) {
			return { code: 400, data: null };
		}
	}

	// 批量获取所有字段信息
	static async fetchAllFields(studentInfoId) {
		const fieldMapping = PersonalInformation.getFieldMapping();
		return Promise.all(
			Object.entries(fieldMapping).map(([key, config]) =>
				PersonalInformation.fetchField(studentInfoId, config.field, config.api)
					.then(response => ({ key, response }))
			)
		);
	}

	// 根据响应更新学生对象
	static updateStudentFromResponses(student, responses) {
		const fieldMapping = PersonalInformation.getFieldMapping();
		responses.forEach(({ key, response }) => {
			const config = fieldMapping[key];

			if (response && response.code === 200 && response.data !== null && response.data !== undefined) {
				student[key] = config.transform ? config.transform(response.data) : response.data;
			}
		});
	}

	// 获取学生信息
	static async getStudentPersonalInformationByStudentInfoId(studentInfoId) {
		const student = PersonalInformation.createStudentObject(studentInfoId);

		try {
			// 获取所有字段信息
			const responses = await PersonalInformation.fetchAllFields(studentInfoId);

			// 更新学生信息
			PersonalInformation.updateStudentFromResponses(student, responses);

			// 加载头像
			student.avatarUrl = StudentApi.getAvatarUrl(studentInfoId, Config.AVATAR_SIZE);
		} catch (error) {
			console.error(`获取学生${studentInfoId}信息失败:`, error);
		}

		return student;
	}
}

// 也可以导出整个类
export default PersonalInformation;
