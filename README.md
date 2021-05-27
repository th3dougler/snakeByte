# snakeByte
 Based on the 1976 arcade hit, Blockade:  Our intrepid jr dev seeks to squash bugs and leave their code looking dry and easily understood.  (Its a snake game)

[![screenshot1](https://i.imgur.com/Dow7qRkm.png)](https://imgur.com/Dow7qRk)
[![screenshot2](https://i.imgur.com/NvlDdocm.png)](https://imgur.com/NvlDdoc)
[![screenshot2](https://i.imgur.com/FqKdt7am.png)](https://imgur.com/FqKdt7a)
[![screenshot3](https://i.imgur.com/R7rdzjum.png)](https://imgur.com/R7rdzju)
[![screenshot4](https://i.imgur.com/ceJV5oFm.png)](https://imgur.com/ceJV5oF)
[![screenshot4](https://i.imgur.com/RgoxaoFm.png)](https://imgur.com/RgoxaoF)

  

### Laguages Used
  
- HTML/CSS
- JS
### Image/Media Sources
[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
[Modern Interiors Sprites](https://limezu.itch.io/moderninteriorslimeZu)
[SoundsByDane - 8Bit Sound Pack](https://soundsbydane.itch.io/8-bit-sound-pack)
[Whaaa - jefftheworld](https://jefftheworld.com)

### Get Started:

Using the arrow keys or swipe on touch devices, navigate the junior dev and try to squash as many bugs as possible before you accidentally cause a stack overflow (trip over your own stack)
[play](https://th3dougler.github.io/snakeByte/)

### Next  steps:

- socket.io full stack edition for live multiplayer
- true i18n support
- add some enemies to make the game harder
- improve overall aesthetic thru consistent sprites and such


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
