import Sketch, { P5 } from 'react-p5'

import './App.css'

let x = 0
const canvasWidth = 960
const canvasHeight = 640

let y = canvasHeight * 0.2

const updateY = setInterval(() => {
  y = y < canvasHeight ? y + 5 : canvasHeight * 0.2
}, 100)

export function App() {
  const setup = (p5: P5, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef)
    p5.background(41, 49, 58)
  }

  const draw = (p5: P5) => {
    x = x < canvasWidth ? x + 1 : 0
    p5.background(41, 49, 58, 2)
    p5.fill(255, 255, 255).ellipse(x, y, 8).noStroke()
    p5.fill(0, 0, 0).rect(canvasWidth - 80, 0, 80, 48)
    p5.textSize(28)
    p5.fill(255, 255, 255).text(x.toString().padStart(3, '0'), canvasWidth - 64, 32)
  }

  return (
    <div className="App">
      <Sketch setup={setup} draw={draw} />
    </div>
  )
}
