const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt("Add your level", "100");

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, mosnterHealth, playerHealth) {

	let logEntry = {
		event: ev,
		value: val,
		finalMonsterHealth: mosnterHealth,
		finalPlayerHealth: playerHealth
	};

	switch(ev){
		case LOG_EVENT_PLAYER_ATTACK:
			logEntry.target = 'MONSTER';
			break;
		case LOG_EVENT_PLAYER_ATTACK:
			logEntry.target = 'MONSTER';
			break;
		case LOG_EVENT_PLAYER_STRONG_ATTACK:
			logEntry.target = 'MONSTER'
			break;
		case LOG_EVENT_MONSTER_ATTACK:
			logEntry.target = 'PLAYER'
			break;
		case LOG_EVENT_PLAYER_HEAL:
			logEntry.target = 'PLAYER'
			break;
		default:
				logEntry = {}
	}
	battleLog.push(logEntry)
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentPlayerHealth -= playerDamage;

	writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("almost dead but bonus saved u");
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
		alert("u won");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'Player Won',
			currentMonsterHealth,
			currentPlayerHealth
		);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
		alert("u lose");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'Monster Won',
			currentMonsterHealth,
			currentPlayerHealth
		);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
		alert("draw");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'Draw',
			currentMonsterHealth,
			currentPlayerHealth
		);
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDemage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
	const logEvent = mode === MODE_ATTACK ? LOG_EVENT_MONSTER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

  const damage = dealMonsterDamage(maxDemage);
	currentMonsterHealth -= damage;
	
	writeToLog(
		logEvent,
		damage,
		currentMonsterHealth,
		currentPlayerHealth
	);

  endRound();
}

function attackHandler() {
  attackMonster("ATTACK");
}

function strongAttackHandler() {
  attackMonster("STRONG_ATTACK");
}

function healPlayerHandler() {
	let healValue;
	
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
	currentPlayerHealth += healValue;
	writeToLog(
		LOG_EVENT_PLAYER_HEAL,
		healValue,
		currentMonsterHealth,
		currentPlayerHealth
	);
  endRound();
}

function printLogHangler(){
	let i = 0;
	for(const logEntry of battleLog){
		console.log(`#${i}`);
		for(const key in logEntry){
			console.log(`${key}: ${logEntry[key]}`);
		}
		
	}
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener('click', printLogHangler)
