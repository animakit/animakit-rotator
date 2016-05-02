# AnimakitRotator

React component for three-dimensional rotation of content blocks.
Supports up to 6 blocks, different sizes and X/Y axis.

## [Demo](http://askd.github.io/animakit/#/rotator)

## Installation

```
npm install animakit-rotator
```

## Usage

```javascript
<AnimakitRotator side="one">
  <div key="one">Side One</div>
  <div key="two">Side Two</div>
  ...
  <div key="six">Up to Six Sides</div>
</AnimakitRotator>
```

## Properties

| Property | Required | Type | Default Value  | Available Values  | Description |
| ----- | ----- | ----- | ----- | ----- | ----- |
| side | true | string | Key of the first child | Key of the component child | Current visible side, that contains a child with the corresponding key  |
| axis | false | string | `X` | `X`, `Y` | Axis of rotation |
| shadow | false | bool |  | `true`, `false` | Shadow on the rotator side. If you use 4 or less sides, it will be visible only while rotation |
| background | false | string |  | Any color in hexadecimal format | Color of the rotator side, transparent by default |
| duration | false | number | `1000` | Any integer number | Duration of rotation |
| easing | false | string | `cubic-bezier(.165, .84, .44, 1)` | Any [easing function](http://easings.net/) | Easing function of rotation |


## Origin

AnimakitRotator is the part of Animakit.
See http://askd.github.io/animakit for more details.
