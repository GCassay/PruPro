var rolRecolector = {
    // Función para recoger energía
    run: function(creep) {
        // Si el recolector lleva menos energía de la que puede transportar, intenta obtener más
        if(creep.carry.energy < creep.carryCapacity) {
            var recursos = creep.room.find(FIND_SOURCES);
            // Si no está en el rango de una fuente, desplazarse hasta una una
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        // Si el recolector está lleno y el Spawn Centro tiene aún capacidad, dirigirse hasta él y transferirla
        else if(Game.spawns['Centro'].energy < Game.spawns['Centro'].energyCapacity) {
            if(creep.transfer(Game.spawns['Centro'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Centro']);
            }
        }
    }
};

module.exports = rolRecolector;
