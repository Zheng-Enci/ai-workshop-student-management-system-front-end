import AttendanceApi from '../../../api/ts/AttendanceApi'

class AttendanceAnalysis {
	static async getAttendanceCountByDate(date?: string): Promise<number> {
		try {
			const count = await AttendanceApi.getTodayAttendanceCount(date)
			return count
		} catch (error: any) {
			throw error
		}
	}
}

export default AttendanceAnalysis
