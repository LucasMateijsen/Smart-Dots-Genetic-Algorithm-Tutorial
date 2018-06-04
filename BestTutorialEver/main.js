let runningPopulation;
let goal;
let obstacles = [];
let dataSetId;
let maxRuns = 1000;

function setup() {
  dataSetId = Math.floor(Math.random() * 10000);

  goal = createVector(400, 10);
  createCanvas(800, 800);
  frameRate(200);

  obstacles.push({left: 500, top: 600, width: 500, height: 10});
  obstacles.push({left: 0, top: 300, width: 600, height: 10});
  obstacles.push({left: 500, top: 400, width: 500, height: 10});
  obstacles.push({left: 300, top: 500, width: 300, height: 10});

  runningPopulation = new Population(1000);//create a new population with 1000 members
}

function draw() { 
  background(255);

  //draw goal
  fill(255, 0, 0);
  ellipse(goal.x, goal.y, 10, 10);

  //draw obstacle(s)
  fill(0, 0, 255);

  for (let i = 0; i < obstacles.length; i++) {
    rect(obstacles[i].left, obstacles[i].top, obstacles[i].width, obstacles[i].height);
  }


  if (runningPopulation.allDotsDead() && !runningPopulation.done) {
    //genetic algorithm
    runningPopulation.calculateFitness();
    let proceed = runningPopulation.naturalSelection();
    if (proceed) {
      runningPopulation.mutateChildren();
    } else {
      runningPopulation.done = true;
    }
  } else {
    //if any of the dots are still alive then update and then show them

    runningPopulation.update();
    runningPopulation.show();
  }
}