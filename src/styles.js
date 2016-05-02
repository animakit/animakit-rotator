export default {
  root: {
    all: 'initial',
    font: 'inherit',
    position: 'relative',
    display: 'block'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'block',
    width: '100%',
    height: '100%',
    '-webkit-transform-style': 'preserve-3d',
    'transform-style': 'preserve-3d'
  },
  figure: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'block',
    width: '100%',
    height: '100%',
    '-webkit-transform-style': 'preserve-3d',
    'transform-style': 'preserve-3d'
  },
  side: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'block',
    width: '100%',
    height: '100%',
    '-webkit-backface-visibility': 'hidden',
    'backface-visibility': 'hidden'
  },
  sideShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'block',
    width: '100%',
    height: '100%',
    background: '#000',
    '-webkit-backface-visibility': 'hidden',
    'backface-visibility': 'hidden',
    'pointer-events': 'none'
  },
  sideWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    '-webkit-transform': 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)'
  }
}
