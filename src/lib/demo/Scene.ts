// 场景
import { BasicComponent } from "./components/BasicComponent";
import { EventDispatcher } from "./EventDispather";
export class Scene extends EventDispatcher {
  state: Record<string, any>;
  components: BasicComponent[];
  curComponentIndex: number;
  constructor(initState: Record<string, any>, components?: BasicComponent[]) {
    super();
    this.state = initState
    this.components = components || []
    this.curComponentIndex = -1
  }
  addComponent(component: BasicComponent | BasicComponent[]) {
    if (Array.isArray(component)) {
      this.components.concat(component)
    } else {
      this.components.push(component)
    }
    if (this.curComponentIndex == -1) {
      this.curComponentIndex = 0
    }
    return this
  }
  
}