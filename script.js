// ── GRAB ELEMENTS FROM THE HTML ──
const introScreen = document.getElementById('intro-screen')
const creationScreen = document.getElementById('creation-screen')
const gameScreen = document.getElementById('game-screen')

const startBtn = document.getElementById('start-btn')
const confirmBtn = document.getElementById('confirm-btn')

const playerNameInput = document.getElementById('player-name')
const playerEthnicityInput = document.getElementById('player-ethnicity')

// ── PLAYER DATA ──
let player = {
  name: '',
  ethnicity: '',
  hunger: 100,
  happiness: 100,
  health: 100,
  stress: 0,
  vesselPercent: 0
}

// ── SCREEN 1 → SCREEN 2 ──
startBtn.addEventListener('click', function() {
  introScreen.classList.add('hidden')
  creationScreen.classList.remove('hidden')
})

// ── SCREEN 2 → SCREEN 3 ──
confirmBtn.addEventListener('click', function() {
  const name = playerNameInput.value.trim()
  const ethnicity = playerEthnicityInput.value

  if (name === '' || ethnicity === '') {
    alert('Tell us who you are first.')
    return
  }

  player.name = name
  player.ethnicity = ethnicity

  console.log('Player created:', player)

  creationScreen.classList.add('hidden')
  gameScreen.classList.remove('hidden')
})
