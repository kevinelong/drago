# Go Game - 19x19 Board

A web-based implementation of the traditional Go game with a 19x19 board, featuring drag-and-drop stone placement and capture mechanics.

## Features

- **19x19 Go Board**: Traditional full-size Go board with star points
- **Drag & Drop Interface**: Intuitive stone placement by dragging from bowls
- **Stone Capture**: Drag opponent stones to their captured bowl
- **Game Rules**: Implements basic Go rules including:
  - Liberty counting
  - Stone capture
  - Ko rule (simplified)
  - Suicide prevention
- **Visual Feedback**: Smooth animations for stone placement and capture
- **Game Controls**: Pass, resign, and new game options
- **Responsive Design**: Works on desktop and mobile devices

## How to Play

### Basic Gameplay

1. **Starting the Game**: Open `index.html` in a web browser
2. **Placing Stones**: 
   - Drag stones from the black or white bowls to the board
   - Click on empty intersections to automatically place a stone from the current player's bowl
3. **Capturing Stones**: Drag opponent stones from the board to their captured bowl
4. **Turn Management**: The game automatically switches between black and white players

### Game Rules

- **Liberties**: Stones must have at least one empty adjacent intersection (liberty) to remain on the board
- **Capture**: Stones or groups without liberties are captured and removed
- **Ko Rule**: Prevents immediate recapture of the same position
- **Suicide**: Moves that would result in immediate capture of your own stones are not allowed (unless they capture opponent stones)

### Controls

- **Pass**: Skip your turn
- **Resign**: End the game and concede
- **New Game**: Start a fresh game

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `script.js` - Game logic and functionality
- `README.md` - This documentation

## Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies
- **Modern CSS**: Uses CSS Grid, Flexbox, and animations
- **Drag & Drop API**: Native HTML5 drag and drop functionality
- **Responsive Design**: Adapts to different screen sizes

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Drag and Drop API
- CSS Grid and Flexbox
- ES6 JavaScript features

## Getting Started

1. Download all files to a directory
2. Open `index.html` in a web browser
3. Start playing!

## Game Features

- **Stone Bowls**: Each player has 180 stones (standard Go set)
- **Captured Stones Display**: Visual representation of captured stones
- **Current Player Indicator**: Shows whose turn it is
- **Stone Count Tracking**: Displays remaining stones in bowls
- **Star Points**: Traditional 9 star points on the 19x19 board

Enjoy playing Go! 