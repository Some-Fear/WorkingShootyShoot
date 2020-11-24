//creates a constant variable for the start button (the button the user clicks to start the game)
const startButton = document.getElementById("start-button")
//creates a constant variable for the instructions that tell the user what the game is about
const instructions = document.getElementById("instructions-text")
//creates a constant variable for the 500x500 area where the game takes place
const mainPlayArea = document.getElementById("playArea")
//creates a constant variable for the players charachter
const shooter = document.getElementById("playerCharacter")
//creates a constant variable for the images of the aliens
const alienImgs = ['images/alien-1.png', 'images/alien-2.png', 'images/alien-3.png', 'images/alien-4.png']
//creates a constant variable for the score board
const scoreCounter = document.querySelector('#score span')

let alienInterval

//this starts the game when the start button is clicked by the user
startButton.addEventListener("click", (event) => {
  playGame()
})

//this function controls what keys on the keyboard correspond to which actions on the screen
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

//this function controls the characters movement up the screen
function moveUp() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
  if (shooter.style.top === "0px") {
    return
  } else {
    let position = parseInt(topPosition)
    position -= 10
    shooter.style.top = `${position}px`
  }
}

//this function controls the characters movement down the screen
function moveDown() {
  let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
  if (shooter.style.top === "460px") {
    return
  } else {
    let position = parseInt(topPosition)
    position += 10
    shooter.style.top = `${position}px`
  }
}

//this function controls the bullets which the user fires at the enemies
function fireBullet() {
  let bullet = createBulletElement()
  mainPlayArea.appendChild(bullet)
  moveBullet(bullet)
}
//this function creates the bullets on the screen
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

//this function controls the movement of the bullets
function moveBullet(bullet) {
  let bulletInterval = setInterval(() => {
    let xPosition = parseInt(bullet.style.left)
    let aliens = document.querySelectorAll(".alien")
    aliens.forEach(alien => {
		//if the bullet collides with the alien, this creates the graphic representation 
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
  }, 5)
}

//this function randomly creates new alien enemies on the right side of the screen
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

//this function controls the enemies movement
function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'))
	//decides if the alien has died or if it has reached the goal and ended the game
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove()
      } else {
        gameOver()
      }
    } else {
      alien.style.left = `${xPosition - 1}px`
    }
  }, 20)
}

//this function checks the collision between the bullets and the enemies to decide wether the bullet hit or not
function checkBulletCollision(bullet, alien) {
  let bulletLeft = parseInt(bullet.style.left)
  let bulletTop = parseInt(bullet.style.top) + 13
  let bulletBottom = bulletTop - 10
  let alienTop = parseInt(alien.style.top)
  let alienBottom = alienTop - 29
  let alienLeft = parseInt(alien.style.left)
  //if the parameters of the bullet are within the parameters of the alien, the alien dies
  if (bulletLeft != 440 && bulletLeft + 10 >= alienLeft) {
    if (bulletTop <= alienTop && bulletBottom >= alienBottom) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

//this function decides if the player has died and a game over event must occur
function gameOver() {
  window.removeEventListener("keydown", shipControls)
  clearInterval(alienInterval)
  let aliens = document.querySelectorAll(".alien")
  aliens.forEach(alien => alien.remove())
  let bullets = document.querySelectorAll(".bullet")
  bullets.forEach(bullet => bullet.remove())
  setTimeout(() => {
    alert(`You Lose! The Aliens Have Slipped Past You And Have Taken Over Earth! Your Score Was ${scoreCounter.innerText}!`)
    shooter.style.top = "180px"
    startButton.style.display = "block"
    instructions.style.display = "block"
    scoreCounter.innerText = 0
  }, 1100)
}
//this function starts the game by removing the start button and instructions, then starting an interval of alien creation
function playGame() {
  startButton.style.display = 'none'
  instructions.style.display = 'none'
  window.addEventListener("keydown", shipControls)
  alienInterval = setInterval(() => { createAlien() }, 2100)
}
