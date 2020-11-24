const startButton = document.getElementById("start-button")
const instructions = document.getElementById("instructions-text")
const mainPlayArea = document.getElementById("playArea")
const shooter = document.getElementById("playerCharacter")
const alienImgs = ['images/alien.png', 'images/alien.png', 'images/alien.png']
const scoreCounter = document.querySelector('#score span')

let alienInterval


startButton.addEventListener("click", (event) => {
  playGame()
})


function shipControls(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault()
    moveUp()
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    moveDown()
  } else if (event.key === " ") {
    event.preventDefault()
    fireBullet()
  }
}


function moveUp() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
  if (shooter.style.top === "40px") {
    return
  } else {
    let position = parseInt(topPosition)
    position -= 8
    shooter.style.top = `${position}px`
  }
}


function moveDown() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
  if (shooter.style.top === "460px") {
    return
  } else {
    let position = parseInt(topPosition)
    position += 8
    shooter.style.top = `${position}px`
  }
}


function fireBullet() {
  let bullet = createBulletElement()
  mainPlayArea.appendChild(bullet)
  moveBullet(bullet)
}

function createBulletElement() {
  let xPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'))
  let yPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('top'))
  let newBullet = document.createElement('img')
  newBullet.src = 'images/bullet.png'
  newBullet.classList.add('bullet')
  newBullet.style.left = `${xPosition}px`
  newBullet.style.top = `${yPosition - 10}px`
  return newBullet
}


function moveBullet(bullet) {
  let bulletInterval = setInterval(() => {
    let xPosition = parseInt(bullet.style.left)
    let aliens = document.querySelectorAll(".alien")
    aliens.forEach(alien => {
      if (checkBulletCollision(bullet, alien)) {
        alien.src = "images/explosion.png"
        alien.classList.remove("alien")
        alien.classList.add("dead-alien")
        scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100
      }
    })
    if (xPosition === 440) {
      bullet.remove()
    } else {
      bullet.style.left = `${xPosition + 4}px`
    }
  }, 20)
}


function createAlien() {
  let newAlien = document.createElement('img')
  let alienSpriteImg = alienImgs[Math.floor(Math.random()*alienImgs.length)]
  newAlien.src = alienSpriteImg
  newAlien.classList.add('alien')
  newAlien.classList.add('alien-transition')
  newAlien.style.left = '470px'
  newAlien.style.top = `${Math.floor(Math.random() * 430) + 30}px`
  mainPlayArea.appendChild(newAlien)
  moveAlien(newAlien)
}


function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'))
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove()
      } else {
        gameOver()
      }
    } else {
      alien.style.left = `${xPosition - 1}px`
    }
  }, 30)
}


function checkBulletCollision(bullet, alien) {
  let bulletLeft = parseInt(bullet.style.left)
  let bulletTop = parseInt(bullet.style.top)
  let bulletBottom = bulletTop - 10
  let alienTop = parseInt(alien.style.top)
  let alienBottom = alienTop - 30
  let alienLeft = parseInt(alien.style.left)
  if (bulletLeft != 440 && bulletLeft - 40 >= alienLeft) {
    if (bulletTop <= alienTop && bulletBottom >= alienBottom) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}


function gameOver() {
  window.removeEventListener("keydown", shipControls)
  clearInterval(alienInterval)
  let aliens = document.querySelectorAll(".alien")
  aliens.forEach(alien => alien.remove())
  let bullets = document.querySelectorAll(".bullet")
  bullets.forEach(bullet => bullet.remove())
  setTimeout(() => {
    alert(`Game Over! The aliens made it to Earth. Your final score is ${scoreCounter.innerText}!`)
    shooter.style.top = "180px"
    startButton.style.display = "block"
    instructions.style.display = "block"
    scoreCounter.innerText = 0
  }, 1100)
}

function playGame() {
  startButton.style.display = 'none'
  instructions.style.display = 'none'
  window.addEventListener("keydown", shipControls)
  alienInterval = setInterval(() => { createAlien() }, 2100)
}
