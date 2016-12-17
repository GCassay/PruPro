/**************************************************************************
 README
***************************************************************************
 1. Coordenadas para el primer Spawn -> X:25 Y:25
 2. Nombre asignado al primer Spawn -> Central
 3. Activar 'Show flags' en DISPLAY OPTIONS
 4. Contador de ticks y total de minutos en Consola
***************************************************************************/

// Cargar módulos
var rolRecolector = require('rol.recolector'); // Obtener energía para transferir al Spawn
var rolRecargador = require('rol.recargador'); // Obtener energía para transferir a otras estructuras
var rolConstructor = require('rol.constructor'); // Obtener energía para construir estructuras
var rolExplorador = require('rol.explorador'); // Buscar otras fuentes de energía y operar con ellas
var vias = require('via.recursos');

module.exports.loop = function () {

    // Control de tiempo y ticks de la prueba
    if(Game.time == 1){ // Se inicia el contador desde 1 ya que eventualmente la consola del simulador no muestra el registro del tick 0
        console.log('INICIO DE LA PRUEBA');
        if(!Memory.temporizador){ // Se guarda el Epoch Time del instante en que se posiciona el primer Spawn
            Memory.temporizador = {
              epoch: String(Date.now())
            };
        }
        // Comenzar construcción de un Container
        Game.rooms.sim.createConstructionSite(34, 23, STRUCTURE_CONTAINER); 
    }
    
    // Fin de la prueba (tick 2000)
    if(Game.time == 2000){
        var final = parseInt(Date.now()); // Se obtiene el Epoch Time del instante en que se alcanzan los 2000 ticks
        var inicio = parseInt(Memory.temporizador.epoch); // Se recoge el Epoch Time de inicio
        var tiempo = final - inicio; // Se calculan los milisegundos transcurridos
        // Se usa como medida de tiempo el minuto
        var tiempo = Math.floor(tiempo / 60000); // Se convierten milisegundos a minutos
        console.log('TIEMPO TRANSCURRIDO: '+ tiempo +' minutos');
        // Se genera un elemento flag en el mapa indicando el final del contador
        Game.rooms.sim.createFlag(25, 25, 'Tiempo Finalizado', COLOR_WHITE); 
        Game.creeps.suicide();
    }

   // Limpiar memoria de creeps eliminados o que ya finalizaron su ciclo de vida
   for(var nombre in Memory.creeps) {
        if(!Game.creeps[nombre]) {
            delete Memory.creeps[nombre];
        }
    }
    
    // Detener actividad al alcanzar los 2000 ticks
    if(Game.time < 2000){
    
        console.log('TICK '+Game.time); // Contador
        
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
                if(constructores.length == 3){ // Por la ubicación de la fuente, 3 es el número máximo de creeps que pueden acceder al mismo tiempo
                    var nuevoExplorador = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'explorador'});
                }
            }
            else{
                if(constructores.length < 2){ // Generar 2 constructores
                    var nuevoConstructor = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructor'});
                }
                else{ // Reciclar el creep inicial de recolector a constructor
                   var minion = Game.creeps['Multitarea'];
                   minion.memory.role = 'constructor';
                }
            }
        }
        // Si el Contenedor ya está disponible, empezar otras tareas
        else if(Game.time > 2){ // La orden de generar el ConstructionSite se da en el tick 1
            // Reciclar los 3 constructores iniciales a recargadores
            for(var nombre in Game.creeps) {
                var minion = Game.creeps[nombre];
                if(minion.memory.role == 'constructor') {
                    minion.memory.role = 'recargador';
                }
            }
            if(recolectores.length < 1){ // Mantener 1 recolector trabajando
                var nuevoRecolector = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recolector'});
            }
            else if(recargadores.length < 3){ // Mantener 3 recargadores trabajando
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
}
