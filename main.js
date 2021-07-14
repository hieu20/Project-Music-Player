// 1. Render songs
// 2. Scroll top
// 3. Play/ pause / seek
// 4. CD rotate
// 5. Next / Prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document)

const audio =$('#audio')
const playBtn = $('.btn-toggle-play')

const player = $('.player')
const cdThumb = $('.cd>.cd-thumb')
const cd = $('.cd')
const input = $('.progress')

const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repaetBtn = $('.btn-repeat')
const playList=$('.playlist')

let app = {
    currentIndex: 0,
    isPlaying: false ,
    isRandom : false,
    isRepeat : false,
    songs: [
        {
            name: 'Tháng Năm',
            singer: 'Sobin Hoàng Sơn',
            path: './aset/audio/ThangNam.mp3',
            img: './aset/img/img-ThangNam.jpg'
        },
        {
            name: 'Treasure',
            singer: 'Rhymastic',
            path: './aset/audio/Treasure.mp3',
            img: './aset/img/img-Treasure.jpg'
        },
        {
            name: 'Trời Hôm nay Nhiều Mây Cực',
            singer: 'Đen Vâu',
            path: './aset/audio/TroiHomNayNhieumayCuc.mp3',
            img: './aset/img/img-TroiHomNayNhieuMayCuc.jpg'
        },
        {
            name: 'Sorry',
            singer: 'Justin Bieber',
            path: './aset/audio/Sorry-JustinBieber.mp3',
            img: './aset/img/img-Sorry.jpg'
        },
        {
            name: 'Mama',
            singer: 'Jonas Blue ft. William Singe',
            path: './aset/audio/Mama-JonasBlueWilliam.mp3',
            img: './aset/img/img-Mama.jpg'
        },
        {
            name: 'Dusk Till Dawn',
            singer: 'ZAYN & Sia',
            path: './aset/audio/DuskTillDawn.mp3',
            img: './aset/img/img-DuskTillDawn.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './aset/audio/Nevada.mp3',
            img: './aset/img/img-Nevada.jpg'
        },
        {
            name: 'Closer',
            singer: 'The Chainsmokers ',
            path: './aset/audio/Closer.mp3',
            img: './aset/img/img-Closer.jpg'
        },
        {
            name: 'All Around The World',
            singer: 'LR3HAB x A Touch Of Class ',
            path: './aset/audio/AllAroundTheWorld.mp3',
            img: './aset/img/img-AllAroundTheWorld.jpg'
        },
        {
            name: 'See You Again',
            singer: 'Wiz Khalifa ft. Charlie Puth',
            path: './aset/audio/SeeYouAgain.mp3',
            img: './aset/img/img-SeeYouAgain.jpg'
        },
        {
            name: 'In The End',
            singer: 'Linkin Park ',
            path: './aset/audio/InTheEnd.mp3',
            img: './aset/img/img-InTheEnd.jfif'
        }
    ],


    
    renderSongs(){
        var htmls = this.songs.map((song,index)=>{
            return `<div class="song ${index===app.currentIndex ?'active' : ''}" data-index="${index}"> 
                        <div class="thumb" style="background: url(${song.img}) center /cover;"></div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                            
                        </div>
                    </div>`
        })
        playList.innerHTML = htmls.join('')

    }, 


    
    defineProperties(){
        Object.defineProperty(this, 'currentSong',{
            get(){
                return this.songs[this.currentIndex]
            }
        })
        
    },
    

    handleEvents(){
        const cdWidth = cd.offsetWidth; // lấy ra chiều dài của element

        // xử lí thu/phóng
        document.onscroll = function(){ // lắng nghe sự kiện scroll
            let scroll = window.scrollY || document.documentElement.scrollTop // lấy ra chiều dài của window khi scroll
            const newCdWidth = cdWidth - scroll ;
            cd.style.width = newCdWidth > 0? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth/cdWidth
        };


        // viết hàm animation cd quay khi phát song
        const cdAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'} // kiểu transform(rotate: quay)
        ], {
            duration: 20000, // số giây
            iterations : Infinity // số lần quay(Infinity:vô hạn)
        })
        cdAnimation.pause() // ngừng quay



        // xử lí play/ pause
     
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause();
            }else {
                audio.play();
                
            }

            // khi song được play
            audio.onplay=function(){
                player.classList.add('playing')
                app.isPlaying=true  
                cdAnimation.play() // khi song dc play cd bắt đầu/tiếp tục quay
            }

            // khi song bị pause
            audio.onpause =function(){
                player.classList.remove('playing')
                app.isPlaying=false
                cdAnimation.pause() // khi song bị pause cd dừng lại
            }
        }

        // xử lí tua song
        audio.ontimeupdate = function(){
            let currentTime = audio.currentTime;
            let totalTime = audio.duration;
            if(audio.duration){
                let progressPercent = currentTime/totalTime*100
                input.value = progressPercent
            }

            input.oninput=function(){           
                const seekTime = input.value*totalTime/100
                audio.currentTime = seekTime;
            }
        }

        // xử lí next Song
        nextBtn.onclick = function(){
            cdAnimation.play()
            input.value= 0
            player.classList.add('playing')  
            if(app.isRandom){
                app.randomSong()
                app.isPlaying = true // fix lỗi lần đầu tiên chưa bấm play thì khi next PlayBtn không hoạt động
            }else{
                app.nextSong()
            }
            audio.play()
            app.renderSongs()
            app.scrollToActiveSong()
                
        }

        // xử lí prev song
        prevBtn.onclick = function(){
            if(app.isRandom){
                app.randomSong()
                app.isPlaying = true // fix lỗi lần đầu tiên chưa bấm play thì khi PrevPlayBtn không hoạt động
            }else{
                app.prevSong();
            }      
            cdAnimation.play()
            input.value =0
            audio.play()
            player.classList.add('playing')
            app.renderSongs()
            app.scrollToActiveSong()
        }


        // Xử lí bật/ tắt chế độ random
        randomBtn.onclick= function(){
            app.isRandom = !app.isRandom
            this.classList.toggle('active') 
            repaetBtn.classList.remove('active')
            app.isRepeat = false;
        }

        // Xử lí bật / tắt chế độ repeat
        repaetBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            repaetBtn.classList.toggle('active')
            app.isRandom = false
            randomBtn.classList.remove('active')
        }



        //xử lí auto next song khi Song phát xong
        audio.onended = function(){ // khi audio ket thuc

            if(app.isRepeat){
                audio.play()
                input.value=0
            }else{
                nextBtn.click() // tự thực hiện các lệnh trong nextBtn.onclick mà không cần hành dộng click
            }
            // if(app.isRandom){
            //     app.randomSong()
            //     input.value =0
            // }
            // if(app.isRepeat){
            //     audio.play()
            // }else{
            //     app.nextSong()
            // }
            app.loadCurrentSong()
            audio.play()
            app.renderSongs()
            app.scrollToActiveSong()
        }

        // lắng nghe hành vi click vào playList
        playList.onclick = function(e){
            let songNoActive = e.target.closest('.song:not(.active)')
            if(songNoActive || e.target.closest('.option')){          
                if(songNoActive){
                    app.currentIndex = Number(songNoActive.dataset.index)
                    app.loadCurrentSong()
                    app.renderSongs()
                    audio.play()
                    player.classList.add('playing')
                    app.isPlaying = true
                } 
                if( e.target.closest('.option')){
                   
                }                      
            }
        }
    },
    // load bài hát hiện tại lên UI
    loadCurrentSong(){
        cdThumb.style.background = `url('${this.currentSong.img}') center/cover`
        $('header>h2').innerHTML = this.currentSong.name
        audio.src = this.currentSong.path;
    },


    // xử lí next Song
    nextSong(){
        app.currentIndex++
        if(app.currentIndex ==app.songs.length){
            app.currentIndex = 0
        }
        app.loadCurrentSong()
        this.isPlaying = true

    },

     // xử lí Prev Song
    prevSong(){      
        app.currentIndex--
        if(app.currentIndex < 0){
            app.currentIndex = app.songs.length-1
        }
        app.loadCurrentSong()
        this.isPlaying = true
        
    },


    // Xử lí random song
    randomSong(){  
        let newIndex 
        do { // random ra một giá trị ngẫu nhiên
            newIndex = Math.floor(Math.random() * app.songs.length) 
        }while(newIndex === app.currentIndex || newIndex===app.currentIndex +1) // nếu giá trị trên trùng với giá trị CurrentIndex thì mới thực hiện lại do
        app.currentIndex = newIndex
        app.loadCurrentSong()
            
    },

    scrollToActiveSong(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        },250)
    },

    start(){
        // định nghĩa các thuộc tính
        this.defineProperties()

        // xử lí các sự kiện
        this.handleEvents()

        
        // load thông tin bài hát hiện tại 
        this.loadCurrentSong()
       
        this.renderSongs();
    }
}

app.start()











