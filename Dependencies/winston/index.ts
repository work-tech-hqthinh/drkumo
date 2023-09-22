import winston from 'winston'

const { format } = winston
const { combine, label, json, colorize, timestamp, printf, errors } = format

const _winston = winston.createLogger({ level: 'info' })

// _winston.add(
//   new winston.transports.Console({
//     format: combine(
//       label({ label: 'hqthinh' }),
//       timestamp(),
//       errors({ stack: false }),
//       json()
//     ),
//     handleExceptions: true,
//     handleRejections: true
//   })
// )

const formatMessage = (info: any) => {
  let { message }: { message: string } = info

  console.table(info);
  // Get the original error message
  const errorMessage: string =
    info[Symbol.for('splat')] &&
    info[Symbol.for('splat')][0] &&
    info[Symbol.for('splat')][0].message
  // Check that the original error message was concatenated to the message
  if (
    errorMessage !== undefined &&
    message.length >= errorMessage.length &&
    message.endsWith(errorMessage)
  ) {
    message = message.replace(errorMessage, ` => ${errorMessage}`)
  }
  const classname = info.name ? ` - [${info.name}]` : ''
  if (info.stack) {
    return `${info.timestamp} ${info.level}${classname}: ${message}\n${info.stack}`
  }
  return `${info.timestamp} ${info.level}${classname}: ${message}`
}

_winston.add(
  new winston.transports.Console({
    format: combine(
      label({ label: 'hqthinh 2' }),
      timestamp(),
      errors({ stack: false }),
      printf((info: any) => formatMessage(info)),
      json()
    ),
    handleExceptions: true,
    handleRejections: true
  })
)

_winston.info('go')
// _winston.error('ues')
