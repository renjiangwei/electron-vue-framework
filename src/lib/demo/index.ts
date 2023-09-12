import { SensorComponent } from './components/SensorComponent'
import { ReaderComponent } from './components/ReaderComponent'
import { Scene } from './Scene'
import { reactive, watch } from 'vue'

enum StateEnum {
  STOP,
  START,
  END,
  ERROR
}
const state = reactive<{
  state: StateEnum
}>({
  state: 0
})
const scene = new Scene(state)
scene.addEventListener('Sensor Start', function (this: Scene) {
  const c = this.components.find(i => i.name === 'Sensor')
  console.log(c, 'ccc')
  if (c) {
    c.start()
  }
})
watch(() => state.state, (val) => {
  if (val === StateEnum.START) {
    scene.dispatchEvent({
      type: 'Sensor Start'
    })
  }
}, {
  immediate: true
})


state.state = 1

let s = new SensorComponent()
s.addEventListener('Sensor 1', function (this: SensorComponent) {
  console.log(this, 'this')
  console.log('Sensor 1')
})
s.name = 'Sensor'
s.dispatchEvent({
  type: 'Sensor 1'
})
s.add('afterActive', () => {
  console.log('after')
})
scene.addComponent(s)


let reader = new ReaderComponent()
reader.name = 'Reader'
reader.addEventListener('Start Reader', () => {
  reader.start()
})
scene.addComponent(reader)