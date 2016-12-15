var rolRecargador = {

    run: function(minion) {
	    if(minion.carry.energy == 0) {
            var recursos = minion.room.find(FIND_SOURCES);
            if(minion.harvest(recursos[0]) == ERR_NOT_IN_RANGE) {
                minion.moveTo(recursos[0]);
            }
        }
        else {
            if(minion.upgradeController(minion.room.controller) == ERR_NOT_IN_RANGE) {
                minion.moveTo(minion.room.controller);
            }
        }
	}
};

module.exports = rolRecargador;
