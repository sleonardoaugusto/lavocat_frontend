import bus from '@/utils/bus'

const EVENT_NAME = 'modal:toggle'

function open(payload = {}) {
  const props = { ...payload.props, show: true }
  bus.emit(EVENT_NAME, { ...payload, props })
}

function close(props) {
  bus.emit(EVENT_NAME, { props: { ...props, show: false } })
}

function listen(fn) {
  bus.on(EVENT_NAME, fn)
}

function off(fn) {
  bus.off(EVENT_NAME, fn)
}

export default { open, close, listen, off }
