import ApiInterceptor from '@/composables/ApiInterceptor';
import config from '@/config';

class StudentApi {
	static api = ApiInterceptor.createInstance();

	static async getStudentPublicFieldValueById(studentInfoId, fieldName) {
		try {
			const response = await this.api.get('/api/v1/students/public-field-value-by-id', {
				params: {
					'student-info-id': studentInfoId,
					'field-name': fieldName,
				},
			});
			return response.data;
		} catch (error) {
			if (error.response) {
				const { status } = error.response;
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试或联系管理员');
				} else {
					throw new Error(error.response.data.message);
				}
			} else {
				throw new Error('网络错误，获取学生信息失败, 请检查网络连接');
			}
		}
	}

	/**
	 * 获取头像URL（辅助函数）
	 * @param studentInfoId - 学生数据库表主键ID
	 * @param avatarSize - 头像尺寸
	 * @returns 头像 URL
	 */
	static getAvatarUrl(studentInfoId, avatarSize = 64) {
		if (!studentInfoId) {
			return null;
		}
		return `${config.API_BASE_URL}/api/v1/students/avatar/${studentInfoId}?avatarSize=${avatarSize}`;
	}

	/**
	 * 通过数据库表主键 ID 获取学生等级
	 * @param studentInfoId - 学生数据库表主键ID
	 * @returns 响应数据，data字段为等级代码(0-3)
	 */
	static async getStudentLevelByInfoId(studentInfoId) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-level-by-info-id', {
				params: { 'student-info-id': studentInfoId },
			});
			return response.data;
		} catch (error) {
			if (error.response) {
				const { status } = error.response;
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试');
				} else {
					throw new Error(error.response.data.message);
				}
			} else {
				throw new Error('网络错误，获取学生等级失败，请检查网络连接');
			}
		}
	}
	/**
	 * 通过 token 获取学生数据库表主键 ID
	 * @param token - 用户登录凭证
	 * @returns 响应数据，data 字段为学生数据库表主键 ID
	 */
	static async getStudentDatabaseTableId(token) {
		try {
			const response = await this.api.get('/api/v1/students/get-student-database-table-id', {
				params: { token },
			});
			return response.data;
		} catch (error) {
			if (error.response) {
				const { status } = error.response;
				if (status >= 500) {
					throw new Error('服务器错误，请稍后重试');
				} else {
					throw new Error(error.response.data.message);
				}
			} else {
				throw new Error('网络错误，获取学生数据库表主键 ID 失败，请检查网络连接');
			}
		}
	}
}

export default StudentApi;
