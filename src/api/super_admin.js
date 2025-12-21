import axios from "axios";
import config from "@/config";

const api = axios.create({
	baseURL: config.API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

/**
 * 验证特殊密码（新增接口）
 * @param {String} specialPassword - 特殊密码
 * @returns {Promise} Promise对象
 */
export const validateSpecialPassword = async (specialPassword) => {
	try {
		const response = await api.get('/api/v1/super-admin/validate-special-password', {
			params: { 'special-password': specialPassword }
		})
		return response.data
	} catch (error) {
		throw new Error("网络错误");
	}
}
