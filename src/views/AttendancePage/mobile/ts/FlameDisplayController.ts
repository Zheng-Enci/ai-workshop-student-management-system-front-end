import { ref } from 'vue'

/**
 * 火焰显示控制器
 * 用于管理签到页面火焰图标的显示状态和计数
 */
export class FlameDisplayController {
  /** 内部响应式引用：每周签到计数 */
  private _weeklyCount = ref(0)

  /**
   * 获取每周签到计数
   * @returns 当前签到次数
   */
  public get weeklyCount(): number {
    return this._weeklyCount.value
  }

  /**
   * 设置每周签到计数
   * @param value - 新的签到次数
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set weeklyCount(value: number) {
    this._weeklyCount.value = value
  }

  /**
   * 获取显示计数（与weeklyCount相同，用于模板显示）
   * @returns 当前签到次数
   */
  public get displayCount(): number {
    return this._weeklyCount.value
  }

  /**
   * 构造函数
   * @param initialCount - 初始签到次数，默认为0
   */
  constructor(initialCount: number = 0) {
    this._weeklyCount.value = initialCount
  }

  /**
   * 更新签到计数
   * @param count - 新的签到次数
   */
  public updateCount(count: number): void {
    this._weeklyCount.value = count
  }
}

export const flameController = new FlameDisplayController()
