import { BasicComponent } from './BasicComponent';

export class SensorComponent extends BasicComponent {
  constructor() {
    super();
  }
  start () {
    this.beforeActive()
    // 维护data
    console.log('开始读取')
    this.afterActive()
  }
  end () {
    console.log('停止读取')
  }
  
}
