var rolRecolector = {
    // Función para recoger energía
    run: function(creep) {
        // Si el recolector lleva menos energía de la que puede transportar, intenta obtener más
        if(creep.carry.energy < creep.carryCapacity) {
            var recursos = creep.room.find(FIND_SOURCES);
            // Si no está en el rango de una fuente, desplazarse hasta una una
            if(creep.harvest(recursos[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(recursos[0]);
            }
        }
        // Si el recolector está lleno y el Spawn Centro tiene aún capacidad, dirigirse hasta él y transferirla
        else if(Game.spawns['Central'].energy < Game.spawns['Central'].energyCapacity) {
            if(creep.transfer(Game.spawns['Central'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Central']);
            }
        }
    }
};

module.exports = rolRecolector;
