let vs = []
function setup() {
  createCanvas(400, 400);
  v = new Vehicle(200,200);
}

function draw() {
  background(220);
  
  v.display();
  v.edges();
  v.update();
  v.wander();
}

class Vehicle {
  constructor(x,y) {
    this.location = createVector(x,y);
    this.velocity = createVector(1,0);
    this.acceleration = createVector(0,0);
    this.l = 30.0;
    this.maxspeed = 2;
    this.maxforce = 0.1;
    this.wanderTheta = 0;
  }
  
  wander(){
    let projVector = this.velocity.copy();
    projVector.setMag(100);
    let projPoint = projVector.add(this.location);
    let wanderRadius = 50;
    noFill();
    stroke(0);
    let theta = this.wanderTheta  + this.velocity.heading();
    let xBar = wanderRadius * cos(theta);
    let yBar = wanderRadius * sin(theta);
    
    let wanderPoint = p5.Vector.add(projPoint, createVector(xBar,yBar));

    let debug = true 
    if (debug) {
      push()  
      line( this.location.x, this.location.y, projPoint.x, projPoint.y);
      noStroke()
      fill("blue")
      circle (projPoint.x, projPoint.y, 8)
      noFill()
      stroke ("blue")
      circle (projPoint.x, projPoint.y, wanderRadius*2)
      line (this.location.x, this.location.y, wanderPoint.x, wanderPoint.y);
      fill("blue")
      circle(wanderPoint.x, wanderPoint.y, 16)
      pop()
    }
    
    let steeringforce = wanderPoint.sub(this.location);
    steeringforce.setMag(this.maxforce)
    this.applyForce(steeringforce)
    
    this.wanderTheta += random(-0.5, 0.5);
  }
  
  seek(vektorTarget){
    var desired = p5.Vector.sub(vektorTarget, this.location);
    desired.normalize();
    desired.mult(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
  
  arrive(vektorTarget){
    var desired = p5.Vector.sub(vektorTarget, this.location);
    var jarak = desired.mag()

    if (jarak < 100){
      var m = map(jarak, 0, 100, 0, this.maxspeed);
      desired.normalize();
      desired.mult(m);
    }
    else{
      desired.normalize();
      desired.mult(this.maxspeed);    
    }
    
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }
  applyForce(force){
    this.acceleration.add(force);
  }
  display(){
    var theta = this.velocity.heading()
    push();
    fill(204, 102, 0);
    stroke(0);
    translate(this.location.x, this.location.y)
    rotate(theta)
    
    //kepala
    ellipse(100, 50, 80, 80);
    //mata
    rect(75, 40, 15, 15);
    rect(110, 40, 15, 15);
    //mulut
    ellipse(100, 70, 30, 10);
    //hidung
    triangle(95, 60, 105, 60, 100, 50);

    triangle(0, this.l/2, 0, -this.l/2, this.l,0);
    pop();
  }

  edges() {
    if (this.location.x > width + 10) {
      this.location.x = -10;
    } else if (this.location.x < -10) {
      this.location.x = width + 10;
    }
    if (this.location.y > height + 10) {
      this.location.y = -10;
    } else if (this.location.y < -10) {
      this.location.y = height + 10;
    }
  }

}