function Player (id) {
	this.id = id;
	this.username = "Anonymous";
	this.score = 0;
}
Player.prototype.getOnePoint = function () {
	this.score += 1;
}
Player.prototype.setUsername = function (username) {
	this.username = username;
}
Player.prototype.loseOnePoint = function () {
	this.score -= 1;
}

module.exports = Player;