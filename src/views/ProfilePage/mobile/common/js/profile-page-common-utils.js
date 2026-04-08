/**
 * 个人信息页面工具模块
 * 提供个人信息页面相关的工具函数
 *
 * @module views/ProfilePage/mobile/common/js/profile-page-common-utils
 * @description 提供图片压缩、文件处理等工具函数
 */

import ProfilePageConfig from '@/views/ProfilePage/mobile/common/js/profile-page-common-config'

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
			if (file.size <= ProfilePageConfig.UPLOAD_AVATAR_SIZE) {
				resolve(file)
				return
			}

			const reader = new FileReader()

			reader.onload = e => {
				const img = new Image()

				img.onload = () => {
					let { width } = img
					let { height } = img

					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')

					const tryCompress = () => {
						if (width <= 1 || height <= 1) {
							canvas.width = width
							canvas.height = height
							ctx.drawImage(img, 0, 0, width, height)
							canvas.toBlob(blob => {
								if (!blob) {
									reject(new Error('图片压缩失败'))
									return
								}
								const compressedFile = new File([blob], file.name, {
									type: file.type || 'image/jpeg',
									lastModified: Date.now()
								})
								resolve(compressedFile)
							}, file.type || 'image/jpeg')
							return
						}

						canvas.width = width
						canvas.height = height
						ctx.drawImage(img, 0, 0, width, height)

						canvas.toBlob(blob => {
							if (!blob) {
								reject(new Error('图片压缩失败'))
								return
							}

							if (blob.size <= ProfilePageConfig.UPLOAD_AVATAR_SIZE) {
								const compressedFile = new File([blob], file.name, {
									type: file.type || 'image/jpeg',
									lastModified: Date.now()
								})
								resolve(compressedFile)
							} else {
								width = Math.floor(width * 0.5)
								height = Math.floor(height * 0.5)
								setTimeout(tryCompress, 50)
							}
						}, file.type || 'image/jpeg')
					}

					tryCompress()
				}

				img.onerror = () => {
					reject(new Error('图片加载失败'))
				}

				img.src = e.target.result
			}

			reader.onerror = () => {
				reject(new Error('文件读取失败'))
			}

			reader.readAsDataURL(file)
		})
	}
}

export default ProfilePageUtils
