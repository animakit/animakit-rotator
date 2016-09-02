export default {
  scene: {
    position: 'relative',
    display:  'block',
  },
  container: {
    position:             'absolute',
    top:                  0,
    left:                 0,
    display:              'block',
    width:                '100%',
    height:               '100%',
    WebkitTransformStyle: 'preserve-3d',
    transformStyle:       'preserve-3d',
  },
  figure: {
    position:             'absolute',
    top:                  0,
    left:                 0,
    display:              'block',
    width:                '100%',
    height:               '100%',
    WebkitTransformStyle: 'preserve-3d',
    transformStyle:       'preserve-3d',
  },
  side: {
    position:                 'absolute',
    top:                      0,
    left:                     0,
    display:                  'block',
    width:                    '100%',
    height:                   '100%',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility:       'hidden',
  },
  sideShadow: {
    position:                 'absolute',
    top:                      0,
    left:                     0,
    display:                  'block',
    width:                    '100%',
    height:                   '100%',
    background:               '#000',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility:       'hidden',
    pointerEvents:            'none',
  },
  sideWrapper: {
    position:        'absolute',
    top:             '50%',
    left:            '50%',
    WebkitTransform: 'translate(-50%, -50%)',
    transform:       'translate(-50%, -50%)',
  },
};
