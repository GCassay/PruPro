// Cargar módulos
var rolRecolector = require('rol.recolector');
var rolRecargador = require('rol.recargador');
var rolConstructor = require('rol.constructor');

module.exports.loop = function () {

	// Control de tiempo y ticks de la prueba
	//=====================================================
	// Inicio de la prueba (tick 0)
	if(Game.time == 0){
		console.log('INICIO DE LA PRUEBA');
		if(!Memory.temporizador){ // Se guarda el Epoch Time del instante en que se inicia el juego
			Memory.temporizador = {
			  epoch: String(Date.now())
			};
		}
		Game.rooms.sim.createConstructionSite(25, 22, STRUCTURE_CONTAINER); // Comenzar construcción de un Container
	}
	// Fin de la prueba (tick 2000)
	if(Game.time == 2000){
		var final = parseInt(Date.now()); // Se obtiene el Epoch Time del instante en que se alcanzan los 2000 ticks
		var inicio = parseInt(Memory.temporizador.epoch); // Se recoge el Epoch Time de inicio
		var tiempo = final - inicio; // Se calculan los milisegundos transcurridos
		// Se conoce el lapso de tiempo aproximado a través de los ticks definidos
		// Se usa como medida de tiempo el minuto
		var tiempo = Math.floor(tiempo / 60000); // Se convierten milisegundos a minutos
		console.log('TICKS:2.000 / TIEMPO TRANSCURRIDO:'+ tiempo +' minutos');
		Game.rooms.sim.createFlag(0, 0, 'PruebaFinalizada', COLOR_WHITE); // Se genera un elemento flag en el mapa
	}

   // Limpiar memoria de creeps eliminados o que ya finalizaron su ciclo de vida
   for(var nombre in Memory.creeps) {
		if(!Game.creeps[nombre]) {
			delete Memory.creeps[nombre];
		}
	}

	// Respawn Creeps Recolectores
	var recolectores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector');
	// Si la cantidad actual es menor a 2, crear un nuevo recolector
	if(recolectores.length < 2) {
		var nuevoRecolector = Game.spawns['Central'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'recolector'});
	}
	// Respawn Creeps Recargadores
	var recargadores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargador');
	// Si la cantidad actual es menor a 4, crear un nuevo recargador
	if(recargadores.length < 4) {
		var nuevoRecargador = Game.spawns['Central'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'recargador'});
	}
	// Respawn Creeps Constructores
	var constructores = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructor');
	// Si la cantidad actual es menor a 4, crear un nuevo constructor
	if(constructores.length < 4) {
		var nuevoConstructor = Game.spawns['Central'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'constructor'});
	}

	// Diferenciar creeps por su rol y asignar comportamiento
	for(var nombre in Game.creeps) {
		var minion = Game.creeps[nombre];
		if(minion.memory.role == 'recolector') {
			rolRecolector.run(minion);
		}
		if(minion.memory.role == 'recargador') {
			rolRecargador.run(minion);
		}
		if(minion.memory.role == 'constructor') {
			rolConstructor.run(minion);
		}
	}
}
