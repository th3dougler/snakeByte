# snakeByte
#### Based on the 1976 arcade hit, Blockade:  Our intrepid jr dev seeks to squash bugs and leave their code looking dry and easily understood.  (Its a snake game)

<blockquote class="imgur-embed-pub" lang="en" data-id="a/D2sV0Fh" data-context="false" ><a href="//imgur.com/a/D2sV0Fh"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>
  
### Laguages Used
  
- HTML/CSS
- JS
### Image/Media Sources
[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
[Modern Interiors Sprites](https://limezu.itch.io/moderninteriorslimeZu)
[Whaaa - jefftheworld](https://jefftheworld.com)

### Get Started:

Using the arrow keys, navigate the junior dev and try to squash as many bugs as possible before you accidentally cause a stack overflow
[play](th3dougler.github.io/snakeByte)

### Next  steps:

- Light cycle mode (2 player w/ cpu)
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
