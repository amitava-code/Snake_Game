const board=document.querySelector('.board');
const blockHeight=80;
const blockWidth=80;
let intervalId=null;

const startGameModal=document.querySelector(".start-game");
const gameOverModal=document.querySelector(".game-over")
const restartBtn=document.querySelector(".btn-restart");

const cols=Math.floor(board.clientWidth/blockWidth);
const rows=Math.floor(board.clientHeight/blockHeight);
const startBtn=document.querySelector(".btn-start");
const modal=document.querySelector(".modal")

let food={x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
const blocks=[];
let snake=[{
   x:1,y:3
}]

let direction='down';
// for(let i=0 ;i<rows*cols; i++){
//     const block=document.createElement('div');
//     block.classList.add("block");
//     board.appendChild(block);
// }

for(let row = 0 ; row<rows ; row++){
   for (let col = 0 ; col<cols ; col++){
    const block=document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
    block.innerText=`${row}-${col}`
    blocks[`${row}-${col}`]=block;
   }
}

function render(){

      let head=null;
      blocks[`${food.x}-${food.y}`].classList.add("food");

   if(direction==='left'){
      head={x:snake[0].x,y:snake[0].y-1}
   }else if(direction==='right'){
      head={x:snake[0].x,y:snake[0].y+1}
   }else if(direction==='down'){
      head={x:snake[0].x+1,y:snake[0].y}
   }else if(direction==='up'){
      head={x:snake[0].x-1,y:snake[0].y}
   }


if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
   clearInterval(intervalId);
   modal.style.display="flex";
   startGameModal.style.display="none";
   gameOverModal.style.display="flex";
   return;

}

if(head.x==food.x && head.y==food.y){
   blocks[`${food.x}-${food.y}`].classList.remove("food");
    food={x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
blocks[`${food.x}-${food.y}`].classList.add("food");
snake.unshift(head)

}


   snake.forEach(segment=>{
   blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
})

   snake.unshift(head)
   snake.pop();

   snake.forEach(segment=>{
      blocks[`${segment.x}-${segment.y}`].classList.add("fill");
   })
} 


// intervalId=setInterval(()=>{

//    render();
// },200)

addEventListener("keydown",(event)=>{
   if(event.key=="ArrowUp"){
      direction="up"
   }else if (event.key=="ArrowDown"){
      direction="down"
   }else if (event.key=="ArrowRight"){
      direction="right"
   }else if (event.key=="ArrowLeft"){
      direction="left"
   }
})


startBtn.addEventListener("click",()=>{

   modal.style.display="none";
   intervalId=setInterval(()=>{render()},300)
})

restartBtn.addEventListener("click",restartGame),

function restartGame(){

   blocks[`${food.x}-${food.y}`].classList.remove("food");
   snake.forEach(segment =>{
      blocks[`${segment.x}-${segment.y}`].classList.remove("fill");

   })

   modal.style.display="none";
   direction="down";
   snake=[ {x:1 , y:3}];
   let food={x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
   intervalId=setInterval(()=>{render()},300)


}