// ── GRAB ELEMENTS ──
const introScreen    = document.getElementById('intro-screen')
const creationScreen = document.getElementById('creation-screen')
const gameScreen     = document.getElementById('game-screen')
const startBtn       = document.getElementById('start-btn')
const confirmBtn     = document.getElementById('confirm-btn')
const playerNameInput     = document.getElementById('player-name')
const playerEthnicityInput = document.getElementById('player-ethnicity')
const sceneText      = document.getElementById('scene-text')
const decisionText   = document.getElementById('decision-text')
const choiceA        = document.getElementById('choice-a')
const choiceB        = document.getElementById('choice-b')
const vesselPercent  = document.getElementById('vessel-percent')
const vesselFill     = document.getElementById('vessel-fill')
// ── ADD FLASH OVERLAY TO BODY ──
const flashOverlay = document.createElement('div')
flashOverlay.id = 'flash-overlay'
document.body.appendChild(flashOverlay)

// ── ADD KEY MOMENT OVERLAY TO BODY ──
document.body.insertAdjacentHTML('beforeend', `
  <div id="key-moment-overlay">
    <span class="warning-symbol">— KEY MOMENT —</span>
    <h2 class="warning-title">CHOOSE CAREFULLY</h2>
    <p class="warning-sub">What happens next shapes who you become.<br>There is no perfect answer.</p>
    <button id="key-moment-btn">I UNDERSTAND</button>
  </div>
`)

// ── ADD DAY TRANSITION TO BODY ──
document.body.insertAdjacentHTML('beforeend', `
  <div id="day-transition">
    <span id="day-transition-text"></span>
  </div>
`)

// ── TYPEWRITER EFFECT ──
function typeText(element, text, speed, callback) {
  element.textContent = ''
  let i = 0
  const timer = setInterval(function() {
    element.textContent += text[i]
    i++
    if (i >= text.length) {
      clearInterval(timer)
      if (callback) callback()
    }
  }, speed || 18)
}

// ── SCREEN FLASH ──
function flashScreen(color, intensity) {
  flashOverlay.style.background = color || 'rgba(139,0,0,0.15)'
  flashOverlay.style.opacity = intensity || '1'
  setTimeout(() => { flashOverlay.style.opacity = '0' }, 80)
}

// ── VESSEL PULSE ──
function pulseVessel() {
  const vessel = document.getElementById('vessel-body')
  vessel.style.animation = 'none'
  vessel.offsetHeight
  vessel.style.animation = 'vesselGrow 1.5s ease forwards'
}

// ── UPDATE STAT BARS WITH COLOR ──
function updateStats() {
  const stats = [
    { id: 'bar-hunger',    val: player.hunger },
    { id: 'bar-happiness', val: player.happiness },
    { id: 'bar-health',    val: player.health },
  ]

  stats.forEach(function(s) {
    const bar = document.getElementById(s.id)
    bar.style.width = s.val + '%'
    if (s.val > 60)      { bar.style.background = '#2d6a2d' }
    else if (s.val > 30) { bar.style.background = '#8b6914' }
    else                  { bar.style.background = '#8b0000' }
  })

  const stressBar = document.getElementById('bar-stress')
  stressBar.style.width = player.stress + '%'
  stressBar.style.background = player.stress > 60 ? '#8b0000' : '#5a2d2d'

  vesselPercent.textContent = player.vessel
  vesselFill.style.height   = player.vessel + '%'

  const vesselBody = document.getElementById('vessel-body')
  if (player.vessel > 0) {
    const glow = Math.min(player.vessel * 0.4, 20)
    vesselBody.style.boxShadow = `0 0 ${glow}px rgba(139,0,0,0.6), inset 0 0 ${glow/2}px rgba(139,0,0,0.2)`
  }
}

// ── DAY TRANSITION ANIMATION ──
function dayTransition(label, callback) {
  const overlay = document.getElementById('day-transition')
  const text    = document.getElementById('day-transition-text')
  text.textContent = label
  overlay.classList.add('active')
  setTimeout(function() {
    overlay.classList.remove('active')
    setTimeout(callback, 400)
  }, 1200)
}

// ── KEY MOMENT SCREEN ──
function showKeyMoment(callback) {
  const overlay = document.getElementById('key-moment-overlay')
  const btn     = document.getElementById('key-moment-btn')
  overlay.classList.add('active')
  flashScreen('rgba(139,0,0,0.2)')

  btn.onclick = function() {
    overlay.classList.remove('active')
    setTimeout(callback, 500)
  }
}
// ── PLAYER DATA ──
let player = {
  name:      '',
  ethnicity: '',
  hunger:    100,
  happiness: 100,
  health:    100,
  stress:    0,
  vessel:    0
}

// ── SCREEN 1 → SCREEN 2 ──
startBtn.addEventListener('click', function() {
  introScreen.classList.add('hidden')
  creationScreen.classList.remove('hidden')
})

// ── SCREEN 2 → SCREEN 3 ──
confirmBtn.addEventListener('click', function() {
  const name      = playerNameInput.value.trim()
  const ethnicity = playerEthnicityInput.value

  if (name === '' || ethnicity === '') {
    alert('Tell us who you are first.')
    return
  }

  player.name      = name
  player.ethnicity = ethnicity

  creationScreen.classList.add('hidden')
  gameScreen.classList.remove('hidden')
  loadDay1()
})

// ── UPDATE STATS ON SCREEN ──
function updateStats() {
  document.getElementById('bar-hunger').style.width    = player.hunger    + '%'
  document.getElementById('bar-happiness').style.width = player.happiness + '%'
  document.getElementById('bar-health').style.width    = player.health    + '%'
  document.getElementById('bar-stress').style.width    = player.stress    + '%'
  vesselPercent.textContent  = player.vessel
  vesselFill.style.height    = player.vessel + '%'
}

// ── SET SCENE ──
function setScene(scene, decision, btnA, btnB) {
  choiceA.classList.add('hidden')
  choiceB.classList.add('hidden')
  decisionText.textContent = ''

  typeText(sceneText, scene, 18, function() {
    setTimeout(function() {
      typeText(decisionText, decision, 14, function() {
        choiceA.textContent = btnA
        choiceB.textContent = btnB
        choiceA.classList.remove('hidden')
        choiceB.classList.remove('hidden')
      })
    }, 300)
  })
}

// ── SHOW OUTCOME THEN CONTINUE ──
function showOutcome(outcomeText, nextFn) {
  decisionText.textContent = ''
  choiceA.classList.add('hidden')
  choiceB.classList.add('hidden')
  flashScreen('rgba(255,255,255,0.04)')

  typeText(sceneText, outcomeText, 22, function() {
    setTimeout(function() {
      choiceB.classList.remove('hidden')
      choiceB.textContent = 'CONTINUE →'
      choiceB.onclick = function() {
        const label = document.getElementById('day-label').textContent
        dayTransition(label.split('—')[0].trim(), nextFn)
      }
    }, 800)
  })
}

// ══════════════════════════════════════
// DAY 1 — THE PHONE
// ══════════════════════════════════════
function loadDay1() {
  updateStats()
  document.getElementById('day-label').textContent = 'DAY 1 — CHILDHOOD'

  setScene(
    "It's a Tuesday. You're 10 years old and just got home from school. " +
    "Almost every kid in your class has a phone now. They share videos, " +
    "play games together, and make plans without you. You feel it — that " +
    "quiet sting of being left out. You drop your backpack and find your " +
    "parents in the kitchen. You know what you want to ask.",

    "Your parents listen. They tell you a phone comes with things you " +
    "can't fully see yet — apps that watch you, data that follows you, " +
    "a trail that never fully disappears. But they won't force anything. " +
    "It's your choice.",

    'GET THE PHONE',
    'WAIT. NOT YET.'
  )

  choiceA.onclick = function() {
    player.happiness = 100
    player.vessel    = 8
    updateStats()
    showOutcome(
      "Your parents order the phone. It arrives two days later. " +
      "You stay up past midnight setting it up — apps, accounts, a username. " +
      "Your friends add you immediately. For the first time in weeks " +
      "you feel like you belong. Somewhere, quietly, a profile begins to form.",
      loadDay2
    )
  }

  choiceB.onclick = function() {
    player.happiness = 75
    player.vessel    = 0
    updateStats()
    showOutcome(
      "You tell your parents you'll wait. They seem relieved. " +
      "At school the next day someone asks why you're not on the group chat. " +
      "You shrug it off but it stays with you all day. " +
      "No data was collected. No profile was started. " +
      "But that silence has its own cost.",
      loadDay2
    )
  }
}

// ══════════════════════════════════════
// DAY 2 — THE SCHOOL PHOTO
// ══════════════════════════════════════
function loadDay2() {
  document.getElementById('day-label').textContent = 'DAY 2 — CHILDHOOD'

  setScene(
    "It's picture day at school. The photographer lines everyone up. " +
    "After the photos are taken, your teacher mentions the school " +
    "will post class photos on their public website so parents can see them. " +
    "Your friend leans over and whispers — their older brother said those " +
    "photos stay online forever and anyone can find them.",

    "Do you tell your teacher you don't want your photo posted publicly, " +
    "or do you go along with it like everyone else?",

    'POST IT. ITS FINE.',
    'OPT OUT QUIETLY.'
  )

  choiceA.onclick = function() {
    player.vessel    = Math.min(100, player.vessel + 5)
    player.happiness = Math.min(100, player.happiness + 5)
    updateStats()
    showOutcome(
      "Your photo goes up with the rest of the class. " +
      "Your mom shares it on Facebook before you even get home. " +
      "Your face is now indexed, tagged, and stored on three different servers. " +
      "You smile in the photo. You had no idea.",
      loadDay3
    )
  }

  choiceB.onclick = function() {
    player.vessel  = Math.min(100, player.vessel + 0)
    player.stress  = Math.min(100, player.stress + 5)
    updateStats()
    showOutcome(
      "You quietly tell your teacher you'd rather not be on the website. " +
      "She looks surprised but says okay. " +
      "Some kids notice and ask why. You don't really have an answer yet. " +
      "Your face stays off the internet for one more day.",
      loadDay3
    )
  }
}

// ══════════════════════════════════════
// DAY 3 — KEY LIFE CHOICE (warning)
// ══════════════════════════════════════
function loadDay3() {
  document.getElementById('day-label').textContent = 'DAY 3 — CHILDHOOD'
  dayTransition('DAY 3', function() {
    showKeyMoment(loadDay3Choice)
  })
}

function loadDay3Choice() {
  setScene(
    "A new kid moved into your neighborhood. He's in your grade " +
    "and doesn't know anyone yet. At lunch he sits alone. " +
    "Your current friend group is popular — they already made a group chat " +
    "and started talking about how the new kid is weird. " +
    "You've talked to him once. He seemed fine. Just quiet.",

    "Your friends want you to ignore him and stay in the group. " +
    "But something about it doesn't sit right with you.",

    'STAY WITH THE GROUP.',
    'SIT WITH THE NEW KID.'
  )

  choiceA.onclick = function() {
    player.happiness = Math.min(100, player.happiness + 5)
    player.stress    = Math.min(100, player.stress + 10)
    player.vessel    = Math.min(100, player.vessel + 3)
    updateStats()
    showOutcome(
      "You stay with your friends. The group chat grows. " +
      "You get added to more apps, more platforms. " +
      "The new kid eats alone for the rest of the week. " +
      "You try not to think about it. " +
      "Your social circle is comfortable. But something feels off.",
      loadDay4
    )
  }

  choiceB.onclick = function() {
    player.happiness = Math.min(100, player.happiness - 5)
    player.stress    = Math.min(100, player.stress - 5)
    player.vessel    = Math.min(100, player.vessel + 0)
    updateStats()
    showOutcome(
      "You grab your lunch and walk over. His name is Marcus. " +
      "He's into the same games as you. " +
      "Your other friends notice and go quiet in the group chat. " +
      "You just made things complicated. " +
      "But you also just made a real friend.",
      loadDay4
    )
  }
}

// ── DAY 4 PLACEHOLDER ──
function loadDay4() {
  document.getElementById('day-label').textContent = 'DAY 4 — CHILDHOOD'
  sceneText.textContent    = "The story continues. Day 4 coming next."
  decisionText.textContent = ''
  choiceA.classList.add('hidden')
  choiceB.classList.add('hidden')
}