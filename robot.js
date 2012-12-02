//pythonista robot - by Diogo Baeder

var Robot = function(robot) {
    var posCoef = parseInt(robot.position.x * robot.position.y);
    this.coef = posCoef % 2 || -1;
    this.startCoef = this.coef;
    this.framesWithoutScan = 2;
    robot.clone();
};

Robot.prototype.onIdle = function(ev) {
    var robot = ev.robot;
    this.move(robot, 3);
    robot.turn(this.startCoef);
    if (this.framesWithoutScan > 1) {
        robot.rotateCannon(this.startCoef);
    }
    this.framesWithoutScan += 1;
};

Robot.prototype.move = function(robot, x) {
    if (this.coef == 1) {
        robot.ahead(x);
    } else {
        robot.back(x);
    }
}

Robot.prototype.onScannedRobot = function(ev) {
    var robot = ev.robot,
        scannedRobot = ev.scannedRobot;
    if (this.isTeamMate(robot, scannedRobot)) {
        return;
    }
    robot.fire();
    robot.rotateCannon((-1 * this.startCoef * robot.angle / 20) - 5);
    this.framesWithoutScan = 0;
};

Robot.prototype.onWallCollision = function(ev) {
    var robot = ev.robot;
    robot.turn(20 * this.startCoef);
    robot.rotateCannon(-20 * this.startCoef);
    this.coef *= -1;
}

Robot.prototype.onRobotCollision = function(ev) {
    var robot = ev.robot,
        collided = ev.collidedRobot;
    if (!this.isTeamMate(robot, collided)) {
        robot.rotateCannon(-1 * collided.cannonAngle);
    }
    this.coef *= -1;
}

Robot.prototype.isTeamMate = function(self, other) {
    return self.parentId == other.id || other.parentId == self.id;
}
