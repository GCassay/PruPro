var rolRecolector = {
    // Recoger energía para el Spawn (si tiene capacidad)
    run: function(creep,numRecolectores) {
        
        // Si el recolector lleva menos energía de la que puede transportar, intenta obtener más
        if(creep.carry.energy < creep.carryCapacity) {
            
            switch(numRecolectores){
              
                case 0: case 1:
                    var recursos = creep.room.find(FIND_SOURCES);
                    // Si no está en el rango de una fuente, desplazarse hasta una una
                    if(creep.harvest(recursos[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(recursos[0]);
                    }
                    break;
                    
                default:
                    var punto = Game.rooms.sim.getPositionAt(35,2);
                    var fuente = punto.findClosestByRange(FIND_SOURCES_ACTIVE);
                    // Si no está en el rango de la fuente, desplazarse hasta ella
                    if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(fuente);
                    }                    
                    break;
            }
        }
        // Si el recolector está lleno y el Spawn Central tiene aún capacidad, dirigirse hasta él y transferirla
        else if(Game.spawns['Central'].energy < Game.spawns['Central'].energyCapacity) {
            
            if(creep.transfer(Game.spawns['Central'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Central']);
            }
        }
    }
};

module.exports = rolRecolector;
