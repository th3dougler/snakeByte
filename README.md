# snakeByte
 Based on the 1976 arcade hit, Blockade:  Our intrepid jr dev seeks to squash bugs and leave their code looking dry and easily understood.  (Its a snake game)

[![screenshot1](https://i.imgur.com/CPf2Y3Cm.png)](https://imgur.com/CPf2Y3C)
[![screenshot2](https://i.imgur.com/QXrMMLum.png)](https://imgur.com/QXrMMLu)
[![screenshot3](https://i.imgur.com/NP7Immbm.png)](https://imgur.com/NP7Immb)
[![screenshot4](https://i.imgur.com/jEruTTjm.png)](https://imgur.com/jEruTTj)
  

### Laguages Used
  
- HTML/CSS
- JS
### Image/Media Sources
[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
[Modern Interiors Sprites](https://limezu.itch.io/moderninteriorslimeZu)
[Whaaa - jefftheworld](https://jefftheworld.com)

### Get Started:

Using the arrow keys or swipe on touch devices, navigate the junior dev and try to squash as many bugs as possible before you accidentally cause a stack overflow (trip over your own stack)
[play](th3dougler.github.io/snakeByte)

### Next  steps:

- Light cycle mode (2 player)
- socket.io full stack edition for live multiplayer

### PREP:

[wireframe](https://www.figma.com/file/1jR9NQOWTfbudiV0tCipDa/Untitled?node-id=0%3A1)

### Pseudocode:
on page load, define environemnt
classes:
* gameboard: flexible world size, contains array containging all positions
    
* snake: contains array subset of gameboard which is the snake, functions for updating position, direction and checking collision      
    
* bugs: array subset of bugs, arrays for creating and destroying bugs
    
variables: player score, lives, time count

eventlisteners:
 * click: start game
 * keydown: determine player direction
    
wait for player input to start game, begin main loop
render loop:
 1) increment real-time time counter
 2) update player direction
 3) update player position
 4) check for collisions
    * if collision with bug, create a new bug and increase snake length
    * if collision with self, subtract one life and reset snake position             while maintaining length/score
    * if it was players last life, end game and bring back to title screen
    * if player is at edge, loop to other side
    * dom manipulation - draw board
