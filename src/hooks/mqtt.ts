// data.on && data.taskList && data.taskList.taskType && data.taskList.taskinfo && data.taskList.taskDetail
let data = {
  on: true,
  taskList: {
    taskType: 'IN',
    taskinfo: 'DF2131241',
    taskDetail: [{
      num: 1,
      epc: 'sadv',
      submitStatus: '未核查',
      originalSerial: 'asdaf',
      name: 'Name'
    }]
  }
}

console.log(JSON.stringify(data))