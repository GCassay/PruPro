// Cargar módulos
var rolRecolector = require('rol.recolector'); // Obtener energía para transferir al Spawn
var rolRecargador = require('rol.recargador'); // Obtener energía para transferir a otras estructuras
var rolConstructor = require('rol.constructor'); // Obtener energía para construir estructuras
var rolExplorador = require('rol.explorador'); // Buscar otras fuentes de energía y operar con ellas

module.exports.loop = function () {

    // Control de tiempo y ticks de la prueba
    if(Game.time == 1){
        console.log('INICIO DE LA PRUEBA');
        if(!Memory.temporizador){ // Se guarda el Epoch Time del instante en que se inicia el juego
            Memory.temporizador = {
              epoch: String(Date.now())
            };
        }
        // Comenzar construcción de un Container
        Game.rooms.sim.createConstructionSite(34, 23, STRUCTURE_CONTAINER); 
    }
    console.log('TICK '+Game.time); // Contador
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
        Game.rooms.sim.createFlag(25, 25, 'Tiempo Finalizado', COLOR_WHITE); 
    }

   // Limpiar memoria de creeps eliminados o que ya finalizaron su ciclo de vida
   for(var nombre in Memory.creeps) {
        if(!Game.creeps[nombre]) {
            delete Memory.creeps[nombre];
        }
    }
    // Filtros de Creeps por rol
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
            if(constructores.length < 1){
                var primerRecolector = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], 'Multitarea', {role: 'recolector'});
            }
            if(constructores.length == 3){
                var nuevoExplorador = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'explorador'});
            }
        }
        else{
            if(constructores.length < 2){ // Generar 2 constructores
                var nuevoConstructor = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructor'});
            }
            else{ // Reciclar el creep inicial de recolector a constructor
               var creep = Game.creeps['Multitarea'];
               creep.memory.role = 'constructor';
            }
        }
    }
    // Si el Contenedor ya está disponible, empezar otras tareas
    else if(Game.time > 2){ // Ignorar los ticks iniciales mientras se procesa la orden de crear Contenedor
        // Reciclar los 3 constructores iniciales a recargadores
        for(var nombre in Game.creeps) {
            var minion = Game.creeps[nombre];
            if(minion.memory.role == 'constructor') {
                minion.memory.role = 'recargador';
            }
        }
        if(recolectores.length < 1){ // Debe haber trabajando 1 recolector
        console.log("?????");
            var nuevoRecolector = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recolector'});
        }
        else if(recargadores.length < 5){ // Debe haber trabajando 5 recargadores
            var nuevoRecargador = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recargador'});
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
        if(minion.memory.role == 'explorador') {
            rolExplorador.run(minion);
        }
    }
}
