import { ref, computed } from 'vue'

export class FlameDisplayController {
  private _weeklyCount = ref(0)
  private _isVisible = ref(false)

  public get weeklyCount(): number {
    return this._weeklyCount.value
  }

  public set weeklyCount(value: number) {
    this._weeklyCount.value = value
    this.updateVisibility()
  }

  public get isVisible(): boolean {
    return this._isVisible.value
  }

  public get displayCount(): number {
    return this._weeklyCount.value
  }

  public get flameStyle(): Record<string, string> {
    return {
      display: this._isVisible.value ? 'inline-flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }

  public get countStyle(): Record<string, string> {
    return {
      position: 'absolute',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#fff',
      textShadow: '0 0 2px rgba(0,0,0,0.8)',
      zIndex: '1'
    }
  }

  constructor(initialCount: number = 0) {
    this._weeklyCount.value = initialCount
    this.updateVisibility()
  }

  public updateCount(count: number): void {
    this._weeklyCount.value = count
    this.updateVisibility()
  }

  public show(): void {
    this._isVisible.value = true
  }

  public hide(): void {
    this._isVisible.value = false
  }

  public toggle(): void {
    this._isVisible.value = !this._isVisible.value
  }

  private updateVisibility(): void {
    this._isVisible.value = this._weeklyCount.value >= 3
  }

  public reset(): void {
    this._weeklyCount.value = 0
    this._isVisible.value = false
  }
}

export const flameController = new FlameDisplayController()
