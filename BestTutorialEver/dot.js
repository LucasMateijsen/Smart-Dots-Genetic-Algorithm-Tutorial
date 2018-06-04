function Dot() {
    // start the dots at the bottom of the window with a no velocity or acceleration
    this.pos = createVector(width/2, height- 10);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.dead = false;
    this.reachedGoal = false;
    this.fitness = 0;

    // true if this dot is the best dot from the previous generation
    this.isBest = false;

    // new brain with 1000 instructions
    this.brain = new Brain(1000);

}

// draws the dot on the screen
Dot.prototype.show = function() {
    if (this.isBest) {
        fill(0, 255, 0);
        ellipse(this.pos.x, this.pos.y, 8, 8);
      } else {//all other dots are just smaller black dots
        fill(0);
        ellipse(this.pos.x, this.pos.y, 4, 4);
      }
}

// moves the dot according to the brains directions
Dot.prototype.move = function() {
    if (this.brain.directions.length > this.brain.step) {
        // if there are still directions left then set the acceleration as the next PVector in the direcitons array
        this.acc = this.brain.directions[this.brain.step];
        this.brain.step++;
    } else {
        // if at the end of the directions array then the dot is dead
        this.dead = true;
    }
  
    //apply the acceleration and move the dot
    this.vel.add(this.acc);
    this.vel.limit(5);//not too fast
    this.pos.add(this.vel);
}

// calls the move function and check for collisions and stuff
Dot.prototype.update = function() {
    if (!this.dead && !this.reachedGoal) {
        this.move();
        if (this.pos.x< 2|| this.pos.y<2 || this.pos.x>width-2 || this.pos.y>height -2) {//if near the edges of the window then kill it 
            this.dead = true;
        } else if (dist(this.pos.x, this.pos.y, goal.x, goal.y) < 5) {//if reached goal
            this.reachedGoal = true;
        } else {
            for (var i = 0; i < obstacles.length; i++) {
                var outOfBounds = this.pos.x < (obstacles[i].left + obstacles[i].width) &&
                    this.pos.y < (obstacles[i].top + obstacles[i].height) &&
                    this.pos.x > obstacles[i].left &&
                    this.pos.y > obstacles[i].top;
                if (outOfBounds) {
                    this.dead = true;
                }
            }
        }
    }
}

// calculates the fitness
Dot.prototype.calculateFitness = function() {
    if (this.reachedGoal) {//if the dot reached the goal then the fitness is based on the amount of steps it took to get there
        this.fitness = 1.0/16.0 + 10000.0/(this.brain.step * this.brain.step);
    } else {//if the dot didn't reach the goal then the fitness is based on how close it is to the goal
        var distanceToGoal = dist(this.pos.x, this.pos.y, goal.x, goal.y);
        this.fitness = 1.0/(distanceToGoal * distanceToGoal);
    }
}

Dot.prototype.giveChild = function() {
    var baby = new Dot();
    // babies have the same brain as their parents
    baby.brain = this.brain.clone();
    return baby;
}