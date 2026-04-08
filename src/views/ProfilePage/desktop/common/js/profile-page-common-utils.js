/**
 * 个人信息页面工具模块
 * 提供个人信息页面相关的工具函数
 *
 * @module views/ProfilePage/desktop/common/js/profile-page-common-utils
 * @description 提供图片压缩、文件处理等工具函数
 */

import ProfilePageConfig from '@/views/ProfilePage/desktop/common/js/profile-page-common-config'

/**
 * 个人信息页面工具类
 * 包含各种工具方法，用于处理个人信息页面的业务逻辑
 */
class ProfilePageUtils {
	/**
	 * 压缩图片到指定大小以内
	 * 使用Canvas API对图片进行尺寸压缩，直到文件大小符合要求
	 * 采用递归方式逐步缩小图片尺寸，直到满足大小限制
	 *
	 * @param {File} file - 需要压缩的图片文件对象
	 * @returns {Promise<File>} 压缩后的文件对象
	 * @throws {Error} 如果图片加载失败或压缩失败，抛出错误
	 */
	static compressImage(file) {
		return new Promise((resolve, reject) => {
			// 第一步：检查原图体积是否已达标，如果已达标则直接返回（避免无效压缩）
			if (file.size <= ProfilePageConfig.UPLOAD_AVATAR_SIZE) {
				resolve(file)
				return
			}

			// 创建FileReader用于读取文件
			const reader = new FileReader()

			// 文件读取成功后的处理
			reader.onload = e => {
				// 创建Image对象用于加载图片
				const img = new Image()

				// 图片加载成功后的处理
				img.onload = () => {
					// 获取图片原始尺寸
					let { width } = img
					let { height } = img

					// 创建Canvas用于图片压缩
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')

					/**
					 * 递归压缩函数
					 * 核心逻辑：仅通过缩小尺寸来压缩图片，不使用质量参数
					 * 采用递归方式逐步缩小图片尺寸，直到满足大小限制
					 */
					const tryCompress = () => {
						// 极端终止条件：避免无限递归
						// 当宽或高缩小到≤1时强制返回，防止canvas异常
						if (width <= 1 || height <= 1) {
							canvas.width = width
							canvas.height = height
							ctx.drawImage(img, 0, 0, width, height)
							// 转换为Blob
							canvas.toBlob(blob => {
								if (!blob) {
									reject(new Error('图片压缩失败'))
									return
								}
								// 创建压缩后的文件对象
								const compressedFile = new File([blob], file.name, {
									type: file.type || 'image/jpeg',
									lastModified: Date.now()
								})
								resolve(compressedFile)
							}, file.type || 'image/jpeg')
							return
						}

						// 设置画布尺寸并绘制图片
						canvas.width = width
						canvas.height = height
						ctx.drawImage(img, 0, 0, width, height)

						// 将Canvas转换为Blob（无质量参数，纯靠尺寸压缩）
						canvas.toBlob(blob => {
							if (!blob) {
								reject(new Error('图片压缩失败'))
								return
							}

							// 检查压缩后的文件大小是否达标
							if (blob.size <= ProfilePageConfig.UPLOAD_AVATAR_SIZE) {
								// 体积达标，创建文件对象并返回
								const compressedFile = new File([blob], file.name, {
									type: file.type || 'image/jpeg',
									lastModified: Date.now()
								})
								resolve(compressedFile)
							} else {
								// 体积未达标，继续缩小尺寸（每次缩小到50%）
								width = Math.floor(width * 0.5)
								height = Math.floor(height * 0.5)
								// 延迟执行避免阻塞UI线程
								setTimeout(tryCompress, 50)
							}
						}, file.type || 'image/jpeg') // 仅传文件类型，无质量参数
					}

					// 启动压缩流程
					tryCompress()
				}

				// 图片加载失败的处理
				img.onerror = () => {
					reject(new Error('图片加载失败'))
				}

				// 设置图片源，触发加载
				img.src = e.target.result
			}

			// 文件读取失败的处理
			reader.onerror = () => {
				reject(new Error('文件读取失败'))
			}

			// 开始读取文件为DataURL
			reader.readAsDataURL(file)
		})
	}
}

export default ProfilePageUtils
