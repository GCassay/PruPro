// Cargar módulos
var rolRecolector = require('rol.recolector');
var rolRecargador = require('rol.recargador');
var rolConstructor = require('rol.constructor');

module.exports.loop = function () {
   
   // Limpiar memoria de creeps eliminados o que ya finalizaron su ciclo de vida
   for(var nombre in Memory.creeps) {
        if(!Game.creeps[nombre]) {
            delete Memory.creeps[nombre];
        }
    }
    
    // Respawn Creeps Recolectores
    var recolectores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector'); 
    // Si la cantidad actual es menor a 2, crear un nuevo recolector
    if(recolectores.length < 1) {
        var nuevo = Game.spawns['Central'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'recolector'});
    }
    // Respawn Creeps Recargadores
    var recargadores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargador'); 
    // Si la cantidad actual es menor a 2, crear un nuevo recargador
    if(recolectores.length < 1) {
        var nuevo = Game.spawns['Central'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'recargador'});
    }
    // Respawn Creeps Constructores
    var constructores = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructor'); 
    // Si la cantidad actual es menor a 2, crear un nuevo constructor
    if(constructores.length < 1) {
        var nuevo = Game.spawns['Central'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'constructor'});
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
