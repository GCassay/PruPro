
var rolRecolector = require('rol.recolector');
var rolRecargador = require('rol.recargador');

module.exports.loop = function () {

    var recolectores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector');
    console.log('Número de Recolectores: ' + harvesters.length);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'recolector') {
            rolRecolector.run(creep);
        }
        if(creep.memory.role == 'recargador') {
            rolRecargador.run(creep);
        }
    }
}
