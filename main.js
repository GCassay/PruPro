// Cargar módulos
var rolRecolector = require('rol.recolector'); // Obtener energía para transferir al Spawn
var rolRecargador = require('rol.recargador'); // Obtener energía para transferir a otras estructuras
var rolConstructor = require('rol.constructor'); // Obtener energía para construir estructuras

module.exports.loop = function () {

	console.log('TICK '+Game.time);

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
        // Comenzar construcción de un Container
        Game.rooms.sim.createConstructionSite(25, 22, STRUCTURE_CONTAINER); 
    }
    // Fin de la prueba (tick 2000)
    if(Game.time == 2000){
        var final = parseInt(Date.now()); // Se obtiene el Epoch Time del instante en que se alcanzan los 2000 ticks
        var inicio = parseInt(Memory.temporizador.epoch); // Se recoge el Epoch Time de inicio
        var tiempo = final - inicio; // Se calculan los milisegundos transcurridos
        // Se conoce el lapso de tiempo aproximado a través de los ticks definidos
        // Se usa como medida de tiempo el minuto
        var tiempo = Math.floor(tiempo / 60000); // Se convierten milisegundos a minutos
        console.log('TICKS TRANSCURRIDOS: 2.000 / TIEMPO TRANSCURRIDO:'+ tiempo +' minutos');
        // Se genera un elemento flag en el mapa indicando el final del contador
        Game.rooms.sim.createFlag(0, 0, 'PruebaFinalizada', COLOR_WHITE); 
    }

   // Limpiar memoria de creeps eliminados o que ya finalizaron su ciclo de vida
   for(var nombre in Memory.creeps) {
        if(!Game.creeps[nombre]) {
            delete Memory.creeps[nombre];
        }
    }
    // Filtros Creeps por rol
    var recolectores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector');
    var recargadores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargador');
    var constructores = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructor');
    
    // Estado de la construcción del Contenedor
    var pos = Game.rooms.sim.getPositionAt(34,23);
    var enConstruccion = pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    // Si el Contenedor sigue en construcción
    if(enConstruccion){
    // Para agilizar la creación de creeps, iniciar con un recolector
        if(recolectores.length < 1) {
            var nuevoRecolector = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,MOVE], undefined, {role: 'recolector'});
        }
    }
    else{
        
    }
    
    
    // Si la cantidad actual es menor a 2, crear un nuevo recolector
    if(recolectores.length < 2) {
        var nuevoRecolector = Game.spawns['Central'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'recolector'});
    }
	else{
		// Respawn Creeps Constructores
		
		// Si la cantidad actual es menor a 5, crear un nuevo constructor
		if(constructores.length < 5) {
			var nuevoConstructor = Game.spawns['Central'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'constructor'});
		}
		else{
			// Respawn Creeps Recargadores
			
			// Si la cantidad actual es menor a 2, crear un nuevo recargador
			if(recargadores.length < 2) {
				var nuevoRecargador = Game.spawns['Central'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'recargador'});
			}
		}
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
