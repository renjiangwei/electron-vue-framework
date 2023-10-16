<template>
  <div class="container">
    <div class="pen-container">
      <div>
        <input type="color" v-model="tempColor">
        <input type="text" v-model="tempColor" style="width: 70px;">
        <input type="text" v-model="tempName">
        <button @click="addColor">添加</button>
      </div>
      <div v-for="(item, index) in colorCacheList">
        <input type="radio" name="color1" @change="handleSelectColor(item.color)" :key="item.name + index">
        <div class="color-demo" :style="{backgroundColor: item.color}"></div>
        <span style="margin-left: 10px;">{{ item.name }}</span>
        <span style="margin-left: 10px;">{{ item.color }}</span>
        <input type="color" v-model="item.color">
        <button @click="handleRemoveColor(index, item.color)">移除</button>
      </div>
      <div>
        <button @click="handlePenDraw">画笔</button>
        <button @click="handleRangeDraw">油桶</button>
        <button @click="handleMosaic">马赛克</button>
      </div>
    </div>
    
    <div class="cavnas-container">
      <div class="col" v-if="visibleRuler">
        <div v-for="item in divide">{{ item }}</div>
      </div>
      <div class="row" v-if="visibleRuler">
        <div v-for="item in divide">{{ item }}</div>
      </div>
      <canvas :width="width" :height="width" ref="canvasRef" id="canvas"></canvas>
      <div>
        <div>
          <label for="width">宽度</label>
          <input type="number" min="0" v-model="width" name="width" @input="handleWidthChange">
        </div>
        <div>
          <label for="divide">分割数量</label>
          <input type="number" min="0" v-model="divide" name="divide" @change="handleDivideChange">
          <input type="checkbox" v-model="visibleRuler">
        </div>
        <div>
          <input type="color" v-model="color"> :: {{ color }}
          <input type="text" v-model="color">
        </div>
        <div>
          <label>初始颜色</label>
          <input type="color" v-model="initColor"> :: {{ initColor }}
          <input type="text" v-model="initColor">
          <button @click="applyColor">应用初始颜色</button>
        </div>
        <div>
          <button @click="handleExport">导出</button>
          <input type="file" @change="handeImport" accept="image/*">
          <button @click="handleClear">清空</button>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue';
enum DrawStatus {
  Stop,
  Draw,
  Clear
}
enum CursorType {
  Single,
  Range,
  Mosaic
}

const mosaicAlpha = '0.6'
const colorCacheList = ref<{name: string, color:string}[]>([])
const tempColor = ref('#ffffff');
const selectedColor = ref('');
const handleSelectColor = (e) => {
  selectedColor.value = e
}
const handleRemoveColor = (index: number, removeColor: string) => {
  colorCacheList.value.splice(index, 1)
  if (removeColor == selectedColor.value) {
    selectedColor.value = ''
  }
}
const tempName = ref('defaultName');
const addColor = () => {
  colorCacheList.value.push({
    color: tempColor.value,
    name: tempName.value,
  })
}

const cursorType = ref(CursorType.Single)

const handleRangeDraw = () => {
  cursorType.value = CursorType.Range
  const c = document.querySelector('.container') as HTMLDivElement
  c.style.cursor = 'url("/src/assets/range.cur") 2 12, pointer'
}
const handlePenDraw = () => {
  cursorType.value = CursorType.Single
  const c = document.querySelector('.container') as HTMLDivElement
  c.style.cursor = 'url("/src/assets/ppp.cur") 5 5, pointer'
}
const handleMosaic = () => {
  cursorType.value = CursorType.Mosaic
  const c = document.querySelector('.container')
  c.style.cursor = 'url("/src/assets/mosaic.cur"), pointer'
}
const visibleRuler = ref(false)

const drawStatus = ref(DrawStatus.Stop)

const width = ref(400)
const divide = ref(20)
const unit = computed(() => {
  return width.value / divide.value
})
const color = ref('#000000')
const initColor = ref('#ffffff')
const canvasRef = ref<HTMLCanvasElement>()


const applyColor = () => {
  const applyColor = window.confirm('应用初始颜色？')
  if (applyColor) {
    clear(initColor.value)
  }
}

const clear = (initC: string = '#ffffff') => {
  const context = canvasRef.value!.getContext('2d')!
  context.fillStyle = initC
  context.fillRect(0, 0, width.value, width.value)
  context.fillStyle = color.value
}
const handleDivideChange = () => {
  clear()
}

const colorRangeList = ref<{x: number, y: number}[]>([])
const checkedGrid = ref<boolean[][]>([[]]);

const getNextByPoint = (x: number, y: number, pointColor: string) => {
  // 检查过就结束
  if (checkedGrid.value[x]?.[y]) {
    return
  }
  const c = getPointColor(x, y);
  if (c === pointColor) {
    colorRangeList.value.push({
      x,
      y,
    })
  } else {
    // 颜色不同可以直接结束，
    return
  }
  if (checkedGrid.value[x]) {
    checkedGrid.value[x][y] = true
  } else {
    checkedGrid.value[x] = [];
    checkedGrid.value[x][y] = true
  }
  let allDirections = [
    {
      dx: 0, dy: -unit.value,
    },
    {
      dx: 0, dy: unit.value
    },
    {
      dx: -unit.value, dy: 0,
    },
    {
      dx: unit.value, dy: 0,
    }
  ]

  for(let i of allDirections) {
    const newX = x + i.dx;
    const newY = y + i.dy;
    if (newX < 0 || newX > width.value || newY < 0 || newY > width.value) {
      continue;
    }
    if (checkedGrid.value[newX] && checkedGrid.value[newX][newY]) {
      // 周围的点检查过就跳过，检查其他点
      continue;
    }
    getNextByPoint(newX, newY, pointColor)
  }
}
const getPointColor = (x: number, y: number) => {
  const ctx = canvasRef.value?.getContext('2d')
  const data = ctx?.getImageData(x, y, 1, 1).data!
  return 'rgba(' + data[0] + ',' + data[1] +',' + data[2] + ',' + (data[3] / 255) + ')';
}
const getRange = (x: number, y: number) => {
  const context = canvasRef.value!.getContext('2d')!
  const rangeColor = getPointColor(x, y)
  colorRangeList.value = []
  checkedGrid.value = []
  getNextByPoint(x,y,rangeColor)
  colorRangeList.value.forEach(point => {
    const xth = Math.floor(point.x / unit.value)
    const yth = Math.floor(point.y / unit.value)
    context.fillStyle = selectedColor.value || color.value
    context?.fillRect(xth * unit.value, yth * unit.value, unit.value, unit.value)
  })
}
const draw = (e: PointerEvent) => {
  const context = canvasRef.value!.getContext('2d')!
  const x = e.offsetX
  const y = e.offsetY
  const xth = Math.floor(x / unit.value)
  const yth = Math.floor(y / unit.value)
  if (cursorType.value == CursorType.Single) {
    context.fillStyle = selectedColor.value || color.value
    console.log('single')
    context?.fillRect(xth * unit.value, yth * unit.value, unit.value, unit.value)
  } else if (cursorType.value == CursorType.Range) {
    getRange(x, y)
    console.log('range')
  } else if (cursorType.value == CursorType.Mosaic) {
    const data = context?.getImageData(x, y, 1, 1).data!
    const c = 'rgba(' + data[0] + ',' + data[1] +',' + data[2] + ',' + (data[3] / 255 * mosaicAlpha) + ')';
    context.fillStyle = c;
    context?.fillRect(xth * unit.value, yth * unit.value, unit.value, unit.value)
  }
}
const clearRect = (e: PointerEvent) => {
  const context = canvasRef.value!.getContext('2d')!
  const x = e.offsetX
  const y = e.offsetY
  const xth = Math.floor(x / unit.value)
  const yth = Math.floor(y / unit.value)
  context.fillStyle = initColor.value
  context?.fillRect(xth * unit.value, yth * unit.value, unit.value, unit.value)
}
const init = () => {
  // canvasRef.value?.addEventListener('click', (e:PointerEvent) => {
  //   draw(e)
  // })
  // canvasRef.value?.addEventListener('contextmenu', (e:PointerEvent) => {
  //   clearRect(e)
  // })
  canvasRef.value?.addEventListener('mousedown', (e: PointerEvent) => {
    if (e.button == 2) {
      drawStatus.value = DrawStatus.Clear
      clearRect(e)
      return
    }
    if (drawStatus.value == DrawStatus.Stop) {
      drawStatus.value = DrawStatus.Draw
    }
    if (drawStatus.value == DrawStatus.Draw) {
      draw(e)
    }
  })
  canvasRef.value?.addEventListener('mousemove', (e: PointerEvent) => {
    if (drawStatus.value == DrawStatus.Draw) {
      requestAnimationFrame(() => {
        draw(e)
      })
    } else if (drawStatus.value == DrawStatus.Clear) {
      clearRect(e)
    }
  })
  canvasRef.value?.addEventListener('mouseup', (e: PointerEvent) => {
    if (drawStatus.value == DrawStatus.Draw || drawStatus.value  == DrawStatus.Clear) {
      drawStatus.value = DrawStatus.Stop
    }
  })
  canvasRef.value?.addEventListener('mouseenter', (e: PointerEvent) => {
  })
  canvasRef.value?.addEventListener('mouseleave', (e: PointerEvent) => {
    drawStatus.value = DrawStatus.Stop;
  })
}
onMounted(() => {
  init()
})

const handleExport = () => {
  const canvas = canvasRef.value!
  const dataURL = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = dataURL

  const d = new Date()
  const t = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()
  a.download = 'canvas-' + t + '.png'
  a.click()
}
const handleClear = () => { 
  const isClear = window.confirm('清空？')

  if (isClear) {
    clear()
  }
}

const unitWithPx = computed(() => {
  return unit.value + 'px'
})

const handleWidthChange = (e) => {
  const value = e.target.value
  if (value) {
    width.value = value
  } else {
    width.value = 100
  }
}

const handeImport = (e: Event) => {
  const ctx = canvasRef.value?.getContext('2d')!
  const f = (e.target as HTMLInputElement).files
  console.log(f, 'f')
  if (f && f.length) {
    const file = f[0]
    const reader = new FileReader();

      // 读取文件完成后的回调函数
      reader.onload = function(event) {
        const img = new Image();

        // 图片加载完成后的回调函数
        img.onload = function() {
          // 将图片绘制到Canvas中
          ctx.drawImage(img, 0, 0);
        };

        // 设置图片的src为读取到的文件数据
        img.src = event.target.result;
      };

      // 读取文件数据
      reader.readAsDataURL(file);
  
  }
  
}

</script>
<style lang="less" scoped>
.container {
  padding-top: 20px;
  // display: flex;flex-direction: column;align-items: center;
  // gap: 20px;
  width: 100%;
}

.pen-container {
  position: absolute;
  left: 10px;
  .color-demo {
    width: 10px;
    height: 10px;
    display: inline-block;
  }
}

#canvas {
  border: 1px solid #000;
}
.cavnas-container {
  position: absolute;
  right: 10px;  
  font-size: v-bind(unit);

  .col {
    width: 100%;
    position: absolute;
    left: 0;
    top: -20px;
    display: flex;
    div {
      width: v-bind(unitWithPx);
      text-align: center;
    }
  }
  .row {
    height: 100%;
    position: absolute;
    left: -20px;
    top: 0;
    display: flex;
    flex-direction: column;
    div {
      direction: rtl;
      height: v-bind(unitWithPx);
      display: flex;
      align-items: center;
    }
  }
}

</style>