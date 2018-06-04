function Population(size) {
    this.dots = [];
    for (var i = 0; i < size; i++) {
        this.dots[i] = null;
    }

    this.done = false;
    this.fitnessSum;
    this.gen = 1;
    this.bestDot = 0;
    this.bestDotStep = 0;

    this.minStep = 1000;

    for (var i = 0; i< size; i++) {
        this.dots[i] = new Dot();
    }
    this.dataSet = [];
}

// show all dots
Population.prototype.show = function() {
    for (var i = 1; i< this.dots.length; i++) {
        this.dots[i].show();
    }
    this.dots[0].show();
}

// update all dots
Population.prototype.update = function() {
    for (var i = 0; i< this.dots.length; i++) {
        if (this.dots[i].brain.step > this.minStep) { // if the dot has already taken more steps than the best dot has taken to reach the goal
            this.dots[i].dead = true; // then it dead
        } else {
            this.dots[i].update();
        }
    }
}

// calculate all the fitnesses
Population.prototype.calculateFitness = function() {
    for (var i = 0; i< this.dots.length; i++) {
        this.dots[i].calculateFitness();
    }
}

// returns whether all the dots are either dead or have reached the goal
Population.prototype.allDotsDead = function() {
    for (var i = 0; i< this.dots.length; i++) {
        if (!this.dots[i].dead && !this.dots[i].reachedGoal) { 
            return false;
        }
    }
  
    return true;
}

// gets the next generation of dots
Population.prototype.naturalSelection = function() {
    var newDots = [];//next gen
    for (var i = 0; i < this.dots.length; i++) {
        newDots[i] = null;
    }

    this.setBestDot();
    this.calculateFitnessSum();

    //the champion lives on 
    newDots[0] = this.dots[this.bestDot].giveChild();
    newDots[0].isBest = true;
    for (var i = 1; i< newDots.length; i++) {
        //select parent based on fitness
        var parent = this.selectParent();

        //get baby from them
        newDots[i] = parent.giveChild();
    }

    this.dots = newDots.slice(0);
    this.gen ++;
    return this.gen < maxRuns;
}

// gets the next generation of dots
Population.prototype.calculateFitnessSum = function() {
    this.fitnessSum = 0;
    for (var i = 0; i< this.dots.length; i++) {
        this.fitnessSum += this.dots[i].fitness;
    }
}

// chooses dot from the population to return randomly(considering fitness)  
// this function works by randomly choosing a value between 0 and the sum of all the fitnesses
// then go through all the dots and add their fitness to a running sum and if that sum is greater than the random value generated that dot is chosen
// since dots with a higher fitness function add more to the running sum then they have a higher chance of being chosen
Population.prototype.selectParent = function() {
    var rand = (Math.random() * this.fitnessSum);
    var runningSum = 0;

    for (var i = 0; i< this.dots.length; i++) {
        runningSum+= this.dots[i].fitness;
        if (runningSum > rand) {
            return this.dots[i];
        }
    }

    //should never get to this point
    return null;
}

//mutates the children
Population.prototype.mutateChildren = function() {
    for (var i = 1; i< this.dots.length; i++) {
        this.dots[i].brain.mutate();
    }
}


// finds the dot with the highest fitness and sets it as the best dot
Population.prototype.setBestDot = function() {
    var max = 0;
    var maxIndex = 0;
    for (var i = 0; i< this.dots.length; i++) {
        if (this.dots[i].fitness > max) {
            max = this.dots[i].fitness;
            maxIndex = i;
        }
    }
  
    this.bestDot = maxIndex;
  
    // if this dot reached the goal then reset the minimum number of steps it takes to get to the goal
    if (this.dots[this.bestDot].reachedGoal) {
        this.minStep = this.dots[this.bestDot].brain.step;
        this.bestDotStep = this.minStep;
        
        console.log("gen:", this.gen, "step:", this.bestDotStep);
        this.dataSet[this.gen] = this.bestDotStep;
    } else {
        this.dataSet[this.gen] = -1;
    }
    localStorage.setItem(dataSetId, this.dataSet);
}