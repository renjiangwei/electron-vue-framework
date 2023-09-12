import { SerialPort, SerialPortMock } from 'serialport'

// var serialPort = new SerialPort({
//   path: 'COM1',
//   baudRate: 9600
// });
// SerialPort.list().then((ports) => {
//   console.log(ports, 'ports')
// })


SerialPortMock.binding.createPort('COM2', {
  echo: true,
})
SerialPortMock.list().then((ports) => {
  console.log(ports, 'mock ports')
})


const port = new SerialPortMock({
  path: 'COM2',
  baudRate: 9600,
})
port.on('open', () => {
  console.log('open')
  // port.emit('data', JSON.stringify({message: 'ad'}))
  // port.emit('data', JSON.stringify({message: 'asf'}))
  // port.emit('data', JSON.stringify({message: 'asf'}))
  port.port.emitData(JSON.stringify({message: 'ad'}))
  port.port.emitData(JSON.stringify({message: 'asf'}))
})

port.on('data', async (data) => {
  console.log(data.toString(), 'data')
  // port.port.close()
})



// import { MockBinding } from '@serialport/binding-mock'
// import { SerialPortStream } from '@serialport/stream'
// import { ReadlineParser } from '@serialport/parser-readline'

// // Create a port and enable the echo and recording.
// MockBinding.createPort('/dev/ROBOT', { echo: true, record: true })
// const port = new SerialPortStream({ binding: MockBinding, path: '/dev/ROBOT', baudRate: 14400 })

// /* Add some action for incoming data. For example,
// ** print each incoming line in uppercase */
// const parser = new ReadlineParser()
// port.pipe(parser).on('data', line => {
//   console.log(line.toUpperCase())
// })

// // wait for port to open...
// port.on('open', () => {
//   // ...then test by simulating incoming data
//   port.port.emitData("Hello, world!\n")
//   port.port.emitData("Hello, world2!\n")
//   port.port.emitData("Hello, world3!\n")
// })

