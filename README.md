# dnd-overlay-tool
This tool can be used to generate a grid, and/or rotate the screens very quickly, for DnD Sessions. It has a transparent background so that you can put anything behind it.

![img_1.png](res/img_1.png)

## How to run
`npm start`

## How to create executable
`npm run make`

## Application information
Uses [electron](https://github.com/electron/electron), [electron-forge](https://github.com/electron/forge) and [typescript](https://github.com/microsoft/TypeScript) as base technologies.

### Features:
* resize, change color and adjust thickness of grid
* draggable grid as a transparent window
  * left-click to drag
  * middle-mouse button to default back to initial position
* rotate any screen with the option to reset to initial orientation (initial = 0°) 

### Rotation functionality
The rotation functionality is only available, if you have the necessary `ScreenOrientationChanger.exe` which is bundled in the release/download section.
Otherwise, you can check out https://github.com/Jasonizl/screen-orientation-changer.

## Project
I keep track of the tasks in the [GitHub project](https://github.com/users/Jasonizl/projects/1).

## Finally
This is also my first electron app, so any tips on improving, or issues, are welcome!