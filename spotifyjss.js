
let currsong=new Audio();
let songs;
let currfolder;
window.addEventListener("DOMContentLoaded", () => {
    const lastSong = localStorage.getItem("lastSong");
    const lastTime = localStorage.getItem("lastTime");

    if (lastSong) {
        playmusic(lastSong, true); // Load song but pause it

        currsong.addEventListener("loadedmetadata", () => {
            if (lastTime) {
                currsong.currentTime = parseFloat(lastTime);
            }
        });
    }
});

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Pad with 0 if needed
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = secs < 10 ? "0" + secs : secs;

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfolder=folder;
    let a =await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    console.log(as)
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`${folder}`)[1])
        }
    }
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML+`<li>
                    <img class="invert" src="music.svg" alt="">
                    <div class="info">
                    <div>${song}</div>
                    <div>kartik</div>
                    </div>
                    <div class="playnow">
                        <span>Play now</span>
                    <img class="invert" width="30px" height="30px" src="playicon.svg" alt="">
                    </div></li>`
    }
    return songs
}
const playmusic=(track,pause=false)=>{
localStorage.setItem("lastSong", track);
currsong.src = `/${currfolder}/` + track;
if(!pause){
currsong.play()
play.src="pause.svg"
}
document.querySelector(".songinfo").innerHTML=decodeURI(track)
document.querySelector(".songtime").innerHTML="00:00/00:00"
}
async function displayalbums() {
    let a =await fetch(`http://127.0.0.1:5500/songs/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let acn=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(acn)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
    if(e.href.includes("/songs/")){
    let folder=e.href.split("/").slice(-1)[0]
        // get the metadata of folder to play song inside multiple card
    let a =await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
    let response=await a.json();
    console.log(response)
    cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="50" fill="#95F985" />
                                <path d="M40 30 L70 50 L40 70 Z" fill="#000000" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
    }
}
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])  
        })
    })
}


async function main() {
  await getsongs("songs/ncs");
  playmusic(songs[0], true); 
  displayalbums()
// add event listener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",e=>{
console.log(e.querySelector("div").firstElementChild.innerHTML)
playmusic(e.querySelector("div").firstElementChild.innerHTML)
    })
})
}
play.addEventListener("click",()=>{
if(currsong.paused){
    currsong.play()
    play.src="pause.svg"
}
else{
    currsong.pause()
    play.src="playicon.svg"
}
})
currsong.ontimeupdate = function () {
localStorage.setItem("lastTime", currsong.currentTime)
    const current = formatTime(currsong.currentTime);
    const total = formatTime(currsong.duration);
    document.querySelector('.songtime').innerText = `${current} / ${total}`;
    document.querySelector(".circle").style.left=(currsong.currentTime/currsong.duration)*100+"%"
};
document.querySelector(".seekbar").addEventListener('click',e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width*100)
    document.querySelector(".circle").style.left=percent+"%"
    currsong.currentTime=((currsong.duration)*percent)/100
})
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})
// for cross to open and close
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
})
previous.addEventListener("click",()=>{
let currentFilename = currsong.src.split("/").slice(-1)[0];
let index = songs.findIndex(song => song.split("/").slice(-1)[0] === currentFilename);
    if((index-1)>=0){
        playmusic(songs[index-1])
    }
})
next.addEventListener("click",()=>{
    currsong.pause()
let currentFilename = currsong.src.split("/").slice(-1)[0];
let index = songs.findIndex(song => song.split("/").slice(-1)[0] === currentFilename);
    if((index+1)<songs.length){
        playmusic(songs[index+1])
    }
})
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
    currsong.volume=parseInt(e.target.value)/100;
    if(currsong.volume>0){
        document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
    }
})
// add event listener to mute the song
document.querySelector(".volume>img").addEventListener("click",e=>{
if(e.target.src.includes("volume.svg")){
    e.target.src=e.target.src.replace("volume.svg","mute.svg")
    currsong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
}
else{
    e.target.src=e.target.src.replace("mute.svg","volume.svg")
    currsong.volume=.1;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10
}
})

main()