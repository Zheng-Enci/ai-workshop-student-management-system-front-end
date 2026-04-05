import ProfilePageConfig from '@/views/ProfilePage/js/ProfilePageConfig'

/**
 * 个人信息页面工具类
 */
class ProfilePageUtils {
	/**
	 * 压缩图片到指定大小以内
	 * @param file - 图片文件
	 * @returns - 压缩后的文件
	 */
	static compressImage(file) {
		return new Promise((resolve, reject) => {
			// 1. 原图体积已达标，直接返回（避免无效压缩）
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

					// 核心：仅缩尺寸的递归压缩逻辑（移除最小尺寸限制）
					const tryCompress = () => {
						// 极端终止条件（避免无限递归：宽/高缩到≤1时强制返回，防止canvas异常）
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

						// 仅执行一次：设置画布尺寸 + 绘制图片
						canvas.width = width
						canvas.height = height
						ctx.drawImage(img, 0, 0, width, height)

						// 转换为Blob（无质量参数，纯靠尺寸压缩）
						canvas.toBlob(blob => {
							if (!blob) {
								reject(new Error('图片压缩失败'))
								return
							}

							// 体积达标则返回，未达标则继续缩小尺寸
							if (blob.size <= ProfilePageConfig.UPLOAD_AVATAR_SIZE) {
								const compressedFile = new File([blob], file.name, {
									type: file.type || 'image/jpeg',
									lastModified: Date.now()
								})
								resolve(compressedFile)
							} else {
								// 每次缩小到90%（无最小尺寸限制，仅靠此比例逐步缩小）
								width = Math.floor(width * 0.5)
								height = Math.floor(height * 0.5)
								// 延迟执行避免阻塞UI
								setTimeout(tryCompress, 50)
							}
						}, file.type || 'image/jpeg') // 仅传文件类型，无质量参数
					}

					// 启动压缩流程
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
