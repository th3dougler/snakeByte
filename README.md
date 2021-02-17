# snakeByte
#### Based on the 1976 arcade hit, Blockade:  Our intrepid jr dev seeks to squash bugs and leave their code looking dry and easily understood.  (Its a snake game)

screenshot
screenshot
  
### Laguages Used
  
- HTML/CSS
- JS

### Get Started:

Using the arrow keys, navigate the junior dev and try to squash as many bugs as possible before you accidentally cause a stack overflow
[play](#)

### Next  steps:

- Light cycle mode (2 player w/ cpu)
- Redo the whole thing with canvas so its nice and smooooooth

### PREP:

[wireframe](#)

#### pseudocode
on page load, define environemnt

 - visual/data: snake, gameboard, "bugs", lives, score
 - visual: loadscreen, nice logo or something
 - eventlisteners: keydown for player movement, click for reset/stop/pause button

wait for player input to start game, begin main loop

 - control snake direction thru keyboard eventlistener
 - populate map with "bugs"
 - look for collisions with wall or "bugs"

as player collects bugs, increase length of snake + increase score
if player collides with wall, subtract 1 life and reset snake position
if player runs out of lives, store highscore with 3 char username and take player back to title screen
