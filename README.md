# dnd-overlay-tool
This tool can be used to generate a grid, add graphical items, and/or rotate the screens very quickly, for DnD Sessions. 
It has a transparent background so that you can put anything (any Map ;)) behind it.

It consists of 2 windows, the main transparent window with the grid and one options window where you can control the grid.

## How it looks
![img_presentation.png](res/img_presentation.png)

## How it looks in an real-life DnD Session
![a](res/img_live_presentation1.jpg)

## How to run
`npm start`

## How to create executable
`npm run make` or `npm run package`

## Executable
Visit [releases](https://github.com/Jasonizl/dnd-overlay-tool/releases) to download the
latest build version including a bundled zip with the `.exe` for easy use.

## Application information
Uses [electron](https://github.com/electron/electron), [electron-forge](https://github.com/electron/forge) and [typescript](https://github.com/microsoft/TypeScript) as base technologies.

### Features:
* **resize, change color** and **adjust thickness of grid**
  * deactivate the grid by pressing the visible button in the top right
* draggable grid as a transparent window
  * left-click to drag
  * middle-mouse button to default back to initial position
* **rotate any screen** with the option to reset to initial orientation (initial = 0°)
* add **rectangle** or **circles** to the grid (for AOEs)
* add **cones** to the grid
  * cones work by putting a starting point, and endpoint
  * the angle can be adjusted by scrolling or pressing + - (15° per change, default 30°)
* add **square images** or **circular images** to the grid
  * elements can be moved again by clicking the row
  * custom names can be set via the input field
  * the color of the border / background of element can be adjusted via color picker
  * each element can be toggled by clicking the 👁️/⛔ icon
  * each element can be deleted by clicking the delete button
* add ruler to measure distance between two points
  * shows Euclidean (direct) and roundtrip (indirect) distance


### Rotation functionality
The rotation functionality is only available, if you have the necessary `ScreenOrientationChanger.exe` which is bundled in the release/download section.
Otherwise, you can check out https://github.com/Jasonizl/screen-orientation-changer.

## Project
I keep track of the tasks in the [GitHub project](https://github.com/users/Jasonizl/projects/1).

## Finally
This is also my first electron app, so any tips on improving, or issues, are welcome!