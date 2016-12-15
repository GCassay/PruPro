var rolConstructor = {

    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) { // Creep en Modo Construcción / Sin energía
            creep.memory.building = false; // Pasar a Modo Recolección para obtener más energía
            creep.say('recolectando');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) { // Creep en Modo Recolección / Full energía
            creep.memory.building = true; // Pasar a Modo Construcción para comenzar a construir
            creep.say('construyendo');
        }
        if(creep.memory.building) { // Creep en Modo Construcción / Con energía
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES); // Localizar punto de construcción y construir
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) { // Desplazarse hasta el punto si no está cerca
                    creep.moveTo(targets[0]);
                }
            }
        }
        else { // Modo Recolección 
            var sources = creep.room.find(FIND_SOURCES); // Localizar fuente y obtener energía
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) { // Desplazarse hasta la fuente si no está cerca
                creep.moveTo(sources[0]);
            }
        }
    }
};

module.exports = rolConstructor;
