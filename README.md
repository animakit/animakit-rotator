# AnimakitRotator

React component for the 3D rotation of the blocks.
Supports up to 6 blocks, different sizes, and X/Y axis.

## Usage

```javascript
<AnimakitRotator side={this.state.loading}>
  <Button />
  <Loader />
</AnimakitRotator>
```

## [Demo](https://animakit.github.io/#/rotator)

## Installation

```
npm install animakit-rotator
```

## Properties

| Property | Required | Type | Default Value  | Available Values  | Description |
| ----- | ----- | ----- | ----- | ----- | ----- |
| side | true | string | Key of the first child | Key of the component child | Current visible side, that contains a child with the corresponding key  |
| axis | false | string | `X` | `X`, `Y` | Axis of rotation |
| shadow | false | bool |  | `true`, `false` | Shadow on the rotator side. If you use 4 or less sides, it will be visible only while rotation |
| background | false | string |  | Any color in hexadecimal format | Color of the rotator side, transparent by default |
| duration | false | number | `1000` | Any integer number | Duration of rotation |
| easing | false | string | `cubic-bezier (.165,.84,.44,1)` | Any [easing function](http://easings.net/) | Easing function of rotation |

## Limitations

The appearance of the components may be affected due to the absolute positioning, so it is preferable to use fixed width or non-breakable spaces.

## Origin

AnimakitRotator is the part of Animakit.
See https://animakit.github.io for more details.

<a href="https://evilmartians.com/?utm_source=animakit">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>
