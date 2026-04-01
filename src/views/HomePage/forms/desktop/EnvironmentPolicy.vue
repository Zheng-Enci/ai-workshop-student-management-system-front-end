<script setup>
import { ref } from 'vue'
import { OfficeBuilding } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'

const environmentPolicyVisible = ref(false)
const isClosingEnvironmentPolicy = ref(false)

const showEnvironmentPolicy = () => {
	environmentPolicyVisible.value = true
}

const closeEnvironmentPolicy = () => {
	if (isClosingEnvironmentPolicy.value) { return }
	isClosingEnvironmentPolicy.value = true

	const dialogWrapper = document.querySelector('.environment-policy-overlay')
	if (dialogWrapper) {
		dialogWrapper.style.display = 'none'
		dialogWrapper.style.visibility = 'hidden'
		dialogWrapper.style.opacity = '0'
	}

	environmentPolicyVisible.value = false

	setTimeout(() => {
		isClosingEnvironmentPolicy.value = false
	}, 0)
}

defineExpose({
	ElDialog,
	showEnvironmentPolicy,
	closeEnvironmentPolicy,
	environmentPolicyVisible,
	isClosingEnvironmentPolicy
})
</script>

<template>
	<el-dialog
		v-if="environmentPolicyVisible"
		v-model="environmentPolicyVisible"
		title="厦门工学院人工智能创作坊日常环境保障机制"
		width="80%"
		:before-close="closeEnvironmentPolicy"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:append-to-body="true"
		:teleported="true"
		modal-class="environment-policy-overlay"
		class="encironment-policy-dialog"
	>
		<div class="encironment-policy-content">
			<div class="encironment-policy-section">
				<h3 class="encironment-policy-section-title">
					<el-icon><office-building /></el-icon>
					第一章 总则
				</h3>
				<div class="encironment-policy-content">
					<p>
						<strong>第一条 目的：</strong>
						为保障厦门工学院人工智能创作坊（以下简称"创作坊"）拥有整洁、舒适、安全、高效的工作与学习环境，
						维护设备安全，培养使用者良好习惯，提升空间利用效率，特制定本保障机制。
					</p>
					<p><strong>第二条 适用范围：</strong>本机制适用于所有进入并使用创作坊的师生。</p>
					<p><strong>第三条 核心原则：</strong>“谁使用，谁负责；人走场清，物归原位；共同维护，持续改进”。</p>
				</div>
			</div>

			<div class="encironment-policy-section">
				<h3 class="encironment-policy-section-title">
					<el-icon><office-building /></el-icon>
					第二章 日常行为规范
				</h3>
				<div class="encironment-policy-content">
					<p><strong>第四条 个人工位区域（桌椅）管理：</strong></p>
					<ol>
						<li><strong>人走椅归：</strong>使用者离开工位时，必须将座椅完全推入桌下，保持整齐划一，不得阻碍通道。</li>
						<li>
							<strong>桌面整洁：</strong>
							<ul>
								<li>
									<strong>物品精简：</strong>
									桌面仅限放置与当前工作/学习直接相关的设备（如电脑、开发板）、资料、必要文具及饮用水杯。
									严禁堆放食物、零食等无关杂物。
								</li>
								<li><strong>资料规整：</strong>文件、书籍、笔记本、科研设备等应整齐摆放或及时收纳，避免杂乱无章。</li>
								<li><strong>桌面整洁：</strong>离开前需清理桌面灰尘、碎屑、水渍、污迹，保持桌面清洁。</li>
							</ul>
						</li>
						<li>
							<strong>垃圾自清：</strong>
							个人产生的废纸、饮料瓶、零食包装等垃圾，必须自行投入指定垃圾桶内，
							不得遗留在桌面或地面。垃圾桶内垃圾超过3/4时，应将垃圾打包带走，换上新的垃圾袋。
						</li>
					</ol>

					<p><strong>第五条 公共区域及地面卫生：</strong></p>
					<ol>
						<li><strong>公共责任：</strong>所有使用者均有责任维护公共区域（如过道、讨论区、设备陈列区周边）的整洁。</li>
						<li><strong>地面无杂物：</strong>不得随意丢弃任何物品（包括纸屑、线缆、工具、个人物品等）在地面。发现地面有垃圾或杂物，人人有责随手捡起投入垃圾桶。</li>
						<li><strong>液体防护：</strong>小心取用液体（水、饮料），如有泼洒，需立即清理干净，防止滑倒及损坏设备或地面。</li>
						<li><strong>设备线缆：</strong>使用公共设备（如显示器、打印机、排插）时，线缆应尽量整理，避免缠绕绊脚。使用完毕应恢复原状。</li>
						<li><strong>使用后复原：</strong>使用公共设备（如机械臂、实验小车、VR设备等）后，必须将其关闭、线缆整理归位、相关配件放回原处，恢复设备区初始整洁状态。</li>
					</ol>

					<p><strong>第六条 节能与安全：</strong></p>
					<ol>
						<li><strong>人走灯灭：</strong>最后离开创作坊（或创作坊内独立区域/房间）的人员，有责任检查并关闭该区域所有照明灯具（包括主灯、氛围灯、台灯等）。</li>
						<li><strong>空调/风扇管理：</strong>夏季空调温度设定建议不低于22℃。最后离开者需确认关闭空调或风扇。避免无人时长时间运行。</li>
						<li><strong>门窗管理：</strong>最后离开创作坊者，需确认关闭所有门窗，做好防盗措施。</li>
						<li>
							<strong>断电检查：</strong>
							对于非24小时运行的公共设备（如公用电脑、显示屏、饮水机、部分实验设备），
							最后离开者或设备使用者有责任确认其已关闭或处于安全待机状态（符合设备要求）。
						</li>
						<li><strong>消防安全：</strong>保持所有消防通道、灭火器及电箱前畅通无阻，严禁遮挡。</li>
					</ol>
				</div>
			</div>

			<div class="encironment-policy-section">
				<h3 class="encironment-policy-section-title">
					<el-icon><office-building /></el-icon>
					第三章 责任分工与监督机制
				</h3>
				<div class="encironment-policy-content">
					<p><strong>第七条 使用者责任：</strong>每位使用者是自身使用区域（工位及周边）和所使用公共设备的第一卫生责任人，必须严格遵守第二章各项规范。</p>
					<p><strong>第八条 值日制度：</strong>由常驻团队按日排班，督促当日使用者遵守规范。检查并确保照明、空调关闭，门窗锁好，卫生情况整洁。</p>
					<p><strong>第九条 定期深度清洁：</strong>每周定期进行地面拖洗、桌面深度擦拭、设备除尘等。</p>
					<p><strong>第十条 管理员巡查：</strong>创作坊负责老师进行不定期巡查，检查卫生状况、设备归位以及安全情况。</p>
					<p><strong>第十一条 相互监督与提醒：</strong>鼓励使用者之间相互友好提醒，共同维护良好环境。发现严重或反复违规行为，可向管理员反映。</p>
					<p>
						<strong>第十二条 处理措施：</strong>
						对于屡教不改或造成设备损坏、安全隐患的严重违规行为：
						暂停其使用创作坊权限一定期限。并且通报其所在院系或指导老师。需承担清洁或维修责任。
					</p>
				</div>
			</div>

			<div class="encironment-policy-section">
				<h3 class="encironment-policy-section-title">
					<el-icon><office-building /></el-icon>
					第四章 附则
				</h3>
				<div class="encironment-policy-content">
					<p>
						<strong>第十三条 温馨提醒：</strong>
						请爱惜创作坊内所有设施设备。保持环境整洁不仅关乎形象，更能提升专注力、减少干扰、
						预防事故、延长设备寿命，最终惠及每一位使用者。
					</p>
					<p><strong>第十四条 宣传与教育：</strong>本机制后续张贴于创作坊醒目位置。所有新进入者需在首次使用前阅读并知晓本规定。创作坊定期通过会议、通知等方式进行宣贯。</p>
					<p><strong>第十五条 修订：</strong>本机制将根据实际运行情况和反馈进行定期评估和修订。</p>
					<p><strong>第十六条 生效日期：</strong>本机制自发布之日起生效。</p>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<style scoped>
.encironment-policy-dialog {
	overflow-y: auto;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.encironment-policy-content {
	max-height: 80vh;
	overflow-y: auto;
	padding: 20px 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.encironment-policy-section {
	margin-bottom: 24px;
	background: #fff;
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.encironment-policy-section-title {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
	color: #303133;
	font-size: 18px;
	font-weight: 600;
}

.encironment-policy-content {
	line-height: 1.8;
	color: #606266;
}

.encironment-policy-content p {
	margin-bottom: 12px;
	text-align: justify;
}

.encironment-policy-content ol,
.encironment-policy-content ul {
	margin-bottom: 12px;
	padding-left: 24px;
}

.encironment-policy-content li {
	margin-bottom: 8px;
	line-height: 1.6;
}

@media (max-width: 768px) {
	.encironment-policy-content {
		padding: 16px 0;
	}
	
	.encironment-policy-section {
		padding: 12px;
	}
	
	.encironment-policy-section-title {
		font-size: 16px;
	}
}
</style>
