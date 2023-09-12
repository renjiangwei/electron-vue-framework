import { LifeCircle } from './types'
import { EventDispatcher } from '../EventDispather'
export class BasicComponent extends EventDispatcher {
  protected beforeActive: Function;
  protected afterActive: Function;
  data: any;
  name: string;
  constructor() {
    super()
    this.beforeActive = () => {}
    this.afterActive = () => {}
    this.name = ''
  }
  add (type: LifeCircle | 'data', arg: Function | any) {
    // if (type == 'beforeActive') {
    //   this.beforeActive = arg
    // }
    this[type] = arg
    return this
  }
  start () {}
  end () {}
}