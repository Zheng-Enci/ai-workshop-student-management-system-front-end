import {getAvatarUrl, getStudentLevelByInfoId, getStudentPublicFieldValueById} from "@/api/student";

const loadStudentInfoByStartId = async (startId = 1, limit = 30) => {
	// 创建一个数组来存储学生信息
	const students = []

	// 设置总数和当前加载计数
	totalCount.value = limit
	loadedCount.value = 0

	// 从 startId 开始，逐个加载学生信息
	while (loadedCount.value < totalCount.value) {
		const studentInfoId = startId + loadedCount.value
		const item = {
			studentInfoId,
			name: null,
			gender: null,
			college: null,
			grade: null,
			major: null,
			levelCode: null,
			hasAvatar: true, // 添加这个属性
			avatarUrl: null,
			totalPoints: 0, // 添加默认总积分
			signInPoints: 0, // 添加默认签到积分
			activityPoints: 0 // 添加默认活动积分
		}

		try {
			// 查询所有可公开字段：name, gender, college, grade, major
			const [nameResponse, genderResponse, collegeResponse, gradeResponse, majorResponse, levelResponse] = await Promise.all([
				getStudentPublicFieldValueById(studentInfoId, 'name').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'gender').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'college').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'grade').catch(() => ({code: 400, data: null})),
				getStudentPublicFieldValueById(studentInfoId, 'major').catch(() => ({code: 400, data: null})),
				getStudentLevelByInfoId(studentInfoId).catch(() => ({code: 400, data: null}))
			])

			// 填充学生信息
			if (nameResponse.code === 200 && nameResponse.data) {
				item.name = nameResponse.data
			}
			if (genderResponse.code === 200 && genderResponse.data) {
				item.gender = genderResponse.data
			}
			if (collegeResponse.code === 200 && collegeResponse.data) {
				item.college = collegeResponse.data
			}
			if (gradeResponse.code === 200 && gradeResponse.data) {
				item.grade = parseInt(gradeResponse.data)
			}
			if (majorResponse.code === 200 && majorResponse.data) {
				item.major = majorResponse.data
			}
			if (levelResponse.code === 200 && levelResponse.data !== null && levelResponse.data !== undefined) {
				item.levelCode = parseInt(levelResponse.data)
			}

			// 加载头像
			item.avatarUrl = getAvatarUrl(studentInfoId, 256)
			students.push(item)
			loadedCount.value++
		} catch (error) {
			// 出错时也要增加计数，避免无限循环
			loadedCount.value++
		}
	}

	return students
}
