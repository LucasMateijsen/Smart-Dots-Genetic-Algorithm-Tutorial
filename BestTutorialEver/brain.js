function Brain(size) {
    this.directions = [];
    for (var i = 0; i < size; i++) {
        this.directions[i] = null;
    }
    this.step = 0;

    this.randomize();
}

// sets all the vectors in directions to a random vector with length 1
Brain.prototype.randomize = function() {
    for (var i = 0; i< this.directions.length; i++) {
        var randomAngle = (Math.random() * (2 * Math.PI))
        this.directions[i] = p5.Vector.fromAngle(randomAngle);
    }
}

// returns a perfect copy of this brain object
Brain.prototype.clone = function() {
    var clone = new Brain(this.directions.length);
    for (var i = 0; i < this.directions.length; i++) {
        clone.directions[i] = this.directions[i].copy();
    }
  
    return clone;
}

// mutates the brain by setting some of the directions to random vectors
Brain.prototype.mutate = function() {
    var mutationRate = 0.2; //chance that any vector in directions gets changed
    for (var i = 0; i< this.directions.length; i++) {
        var rand = Math.random();
        if (rand < mutationRate) {
            //set this direction as a random direction 
            var randomAngle = (Math.random() * (2 * Math.PI));
            this.directions[i] = p5.Vector.fromAngle(randomAngle);
        }
    }
}
