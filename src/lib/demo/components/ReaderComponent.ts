import { BasicComponent } from "./BasicComponent";

export class ReaderComponent extends BasicComponent {
  constructor () {
    super()
  }
  start () {
    this.beforeActive()
    console.log('reader开始读取')
    this.afterActive()
  }
  end () {
    console.log('reader结束读取')
  }
}