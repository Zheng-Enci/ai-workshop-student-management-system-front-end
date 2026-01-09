// 管理员页面配置类
export class AdminPageConfig {
	public readonly superAdminAvatarSize_desktop: number = 256;
	public readonly superAdminInfoId: number = 2;
	public readonly studentAvatarSize: number = 128;
}

// 导出默认实例
export const adminPageConfig = new AdminPageConfig();
