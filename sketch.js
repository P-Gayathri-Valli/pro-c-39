var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage,bg_img;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("t-rex 1.png","t-rex 2.png","t-rex 3.png","t-rex 4.png","t-rex 5.png","t-rex 6.png","t-rex 7.png","t-rex 8.png","t-rex 9.png");
  trex_collided = loadAnimation("t-rex.png");
  
  //groundImage = loadImage("ground2.png");

  bg_img=loadImage("bg2.jpg")
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("ob1.png");
  obstacle2 = loadImage("ob2.png");
  obstacle3 = loadImage("ob3.png");
  obstacle4 = loadImage("ob4.png");
  obstacle5 = loadImage("ob5.png");
  obstacle6 = loadImage("ob6.png");
  
  gameOverImg = loadImage("game Over.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight-143);

  camera.position.x=displayWidth/2
  camera.position.y=displayHeight-370

  trex = createSprite(displayWidth-1200,displayHeight-450,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  /*ground = createSprite(displayWidth-500,displayHeight-100,displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale=0.2*/

  gameOver = createSprite(displayWidth/2,displayHeight/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,displayHeight/2+100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(displayWidth-700,displayHeight-130,displayWidth,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true
  trex.setCollider("rectangle",10,0,150,200);
    
  background(bg_img);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    /*if (ground.x < 0){
      ground.x = ground.width/2;
    }*/
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();

  fill("white")
  strokeWeight(3)
  stroke("red")
  textSize(50)
  text("Score: "+ score, displayWidth/2-100,displayHeight-600);
  stroke("black")
  strokeWeight(2)
  fill("black")
  textSize(25)
  text("(Press space key to jump, jump when the cactus approaches you)", displayWidth/2-300,displayHeight-570);


}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 130 === 0) {
    var cloud = createSprite(displayWidth-400,displayHeight-150,100,100);
    cloud.y = Math.round(random(displayHeight-700,displayHeight-600));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(displayWidth-50,displayHeight-200,20,50);
    //obstacle.debug = true;
    obstacle.setCollider("circle",0,0,150);

    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}