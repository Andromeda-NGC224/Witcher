let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["палка"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "палка", power: 5 },
  { name: "кинжал", power: 30 },
  { name: "молот", power: 50 },
  { name: "меч", power: 100 },
];
const monsters = [
  {
    name: "гуль",
    level: 2,
    health: 15,
  },
  {
    name: "черт",
    level: 8,
    health: 60,
  },
  {
    name: "волколак",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "town square",
    "button text": [
      "Пойти в магазин",
      "Пойти в пещеру",
      "Сразиться с Волколаком",
    ],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Вы находитесь на городской площади. Вы видите вывеску с надписью "Магазин".',
  },
  {
    name: "store",
    "button text": [
      "Купить 10 здоровья (10 золота)",
      "Купить оружие (30 золота)",
      "Пойти на городскую площадь",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Вы вошли в магазин.",
  },
  {
    name: "cave",
    "button text": [
      "Сразиться со гулем",
      "Сразиться с чертом",
      "Пойти на городскую площадь",
    ],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Вы вошли в пещеру. Вы видите каких-то монстров.",
  },
  {
    name: "fight",
    "button text": ["Атаковать", "Уклониться", "Сбежать"],
    "button functions": [attack, dodge, goTown],
    text: "Вы сражаетесь с монстром.",
  },
  {
    name: "kill monster",
    "button text": [
      "            ",
      "Пойти на городскую площадь",
      "            ",
    ],
    "button functions": [goTown, goTown, goTown],
    text: "Монстр кричит «Арг!», когда умирает. Вы получаете очки опыта и находите золото.",
  },
  {
    name: "lose",
    "button text": ["       ", "ЗАНОВО?", "       "],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;",
  },
  {
    name: "win",
    "button text": ["       ", "ЕЩЕ РАЗ?", "       "],
    "button functions": [restart, restart, restart],
    text: "&#x2665; Вы победили Волколака! ВЫ ВЫИГРАЛИ ИГРУ! &#x1F389;",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "У вас недостаточно золота, чтобы купить здоровье.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Теперь у вас есть " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " В вашем инвентаре есть: " + inventory;
    } else {
      text.innerText = "У вас недостаточно золота, чтобы купить оружие.";
    }
  } else {
    text.innerText = "У вас уже есть самое мощное оружие!";
    button2.innerText = "Продать оружие за 15 золотых.";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Вы продали " + currentWeapon + ".";
    text.innerText += " В вашем инвентаре есть: " + inventory;
  } else {
    text.innerText = "Не продавайте свое единственное оружие!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = monsters[fighting].name + " атакован.";
  text.innerText += " Вы атаковали его " + weapons[currentWeapon].name + ".";
  health -= monsters[fighting].level;
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Вы промазали";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Оружие " + inventory.pop() + " сломалось.";
    currentWeapon--;
  }
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "Вы уклонились от атаки " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}
