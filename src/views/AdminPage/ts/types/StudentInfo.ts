/**
 * 学生信息接口
 */
export interface StudentInfo {
	id: number
	studentId: string
	name: string
	grade: number
	major: string
	classNum: number
	gender: string
	phoneNumber: string
	attendanceCount: number
	totalPoints: number
	level: number
	adminId: number | null
	levelName: string
	genderDisplay: string
	avatarUrl?: string | null
}
