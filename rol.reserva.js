var rolReserva = {
    
	run: function(creep) {
	    
        // Si el creep lleva menos energía de la que puede transportar, intenta obtener más
        if(creep.carry.energy < creep.carryCapacity) {
            
            var punto = Game.rooms.sim.getPositionAt(43,44);
            var fuente = punto.findClosestByRange(FIND_SOURCES_ACTIVE);
            // Si no está en el rango de una fuente, desplazarse hasta una una
            if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                creep.moveTo(fuente);
            }
        }
        // Si el creep está lleno, dirigirse a una estructura
        else{
            // Priorizar transferencia al contenedor
            var p = Game.rooms.sim.getPositionAt(34,23);
            var contenedor = p.findClosestByRange(FIND_STRUCTURES);
            if(contenedor){
                if(creep.transfer(contenedor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(contenedor);
                }
            }
            // Si el contenedor aún se está construyendo, transferir energía al Spawn
            else if(creep.transfer(Game.spawns['Central'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Central']);
            }
        }
    }
};

module.exports = rolReserva;
