/**
 * 原始学生数据接口
 */
export type RawStudentData = {
	id?: number
	studentId?: string | number
	name?: string
	college?: string
	grade?: number
	major?: string
	classNum?: number
	gender?: string
	phoneNumber?: string
	attendanceCount?: number
	totalPoints?: number
	levelCode?: number
	adminStudentInfoId?: number | null
}
