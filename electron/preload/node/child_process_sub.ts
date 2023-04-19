console.log('``````````````````````````````````````````````````')
process.on('message', (data) => {
  console.log(data, 'sub')
})
process.send({b: 2})
