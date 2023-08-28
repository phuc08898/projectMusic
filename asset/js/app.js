const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progres = $('#progress')
const nextbtn = $('.btn-next')
const prevbtn = $('.btn-prev')
const btnramdom = $('.btn-random')
const repeatBtn = $('.btn-repeat')

// biến app lưu mảng bài hát 
 

const app = {
    isPlaying: false,
    isRamDon: false,
    isRepeat: false,
    currentIndex: 0,// của cn3
    songs:[
        {
            name:'chia tay la giai phap',
            singer: 'ABC',
            path: "./asset/music/ChiaTayLaGiaiPhap.mp3",
            image:'./asset/img/song1.jpg',
        },
        {
            name:'Co Ai Hen Ho Cung Em Chua',
            singer: 'ABC',
            path: "./asset/music/CoAiHenHoCungEmChua.mp3",
            image:'./asset/img/song2.jpg',
        },
        {
            name:'Khac Biet',
            singer: 'ABC',
            path: "./asset/music/KhacBiet.mp3",
            image:'./asset/img/song3.jpg',
        },
        
        {
            name:'Suyt Nua Thi',
            singer: 'ABC',
            path: "./asset/music/SuytNuaThi.mp3",
            image:'./asset/img/song4.jpg',
        },
        {
            name:'The Gioi Trong Em',
            singer: 'ABC',
            path: "./asset/music/TheGioiTrongEm.mp3",
            image:'./asset/img/song5.jpg',
        },
    ],
    // *phần render Scroll stop  ************************************
    // render ra html 
    render: function(){
       const htmls = this.songs.map((song,index) => {
           return `
           <div class="song ${index === this.currentIndex ? 'active' : ' '}" data-index= "${index}">
                <div class="thumb">
                <img src="${song.image}" alt="" width="110%">
                  
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
           `
       })
       playlist.innerHTML = htmls.join(' ')
    },
    // tạo hàn sự lý 
    handleEvent:function(){
        // lấy ra element cd để tính cái cộn 
        // lấy ra cd rồi tạo cái cd width r dùng cái kéo - ra cái cd rồi lấy phần trừ là phần width
        
        const cdWidth= cd.offsetWidth
        //*sự kiến kéo con chuột lăng sử lý phóng to thu nhỏ 
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth =cdWidth - scrollTop
            cd.style.width = newCdWidth > 0?  newCdWidth + 'px' :0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //* xử lý khi click play để chạy nhạc******************
        playBtn.onclick = function(){
           if(app.isPlaying){
            audio.pause()
           }
           else{
            audio.play()
           }
        }
        //* khi song được play ******************
        audio.onplay = function(){
            app.isPlaying= true
            player.classList.add('playing')
            cdThumdAnimate.play()
        }
        //* khi play bị pause ******************
        audio.onpause = function(){
            app.isPlaying= false
            player.classList.remove("playing")
            cdThumdAnimate.pause()
        }
        //* khi tiếng độ bài hát thây đổi******************
        audio.ontimeupdate = function(){   
            if(audio.duration){
                const progressPercentage =Math.floor(audio.currentTime / audio.duration * 100)
                progres.value = progressPercentage
            }
        }
        //*** sử lý khi tua song *************** */
        progres.onchange = function(e){
            const seektime = audio.duration / 100 * e.target.value;
            audio.currentTime = seektime
        }
        //* sử lý CD quay và dừng khi quay 
        const cdThumdAnimate=  cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,// 10 giây
            iterations:Infinity // quay vô hạn 
        })
        cdThumdAnimate.pause()

        //*khi click nút next bài hát ********************  */
        nextbtn.onclick = function(){
            if(app.isRamDon){
                app.playRamdomSong()
            }
            else{
                app.NextSong()
            }
            audio.play()
            app.render()
            app.scrollTopActivitySong()
        }
        //* khi click prev bài 
        prevbtn.onclick= function(){
            if(app.isRamDon){
                app.playRamdomSong()
            }
            else{

                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollTopActivitySong()
        }
        //* nút ramdom bài hát 
        btnramdom.onclick = function(){
          app.isRamDon = !app.isRamDon
          btnramdom.classList.toggle("active",app.isRamDon)
        }
        // sử lý khi audio hết thức bài hát thì phải next baifmoiws 
        audio.onended = function(){
           if(app.isRepeat){
            audio.play()
           }
           else{
            app.NextSong()
            audio.play()
           }
        }
        //* nút lặp bài hát 
        repeatBtn.onclick = function(){
            app.isRepeat = ! app.isRepeat
            repeatBtn.classList.toggle("active",app.isRepeat)
        }
        //* chức năng clik vào danh sách bài hát thì hát cn10 
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                // xủ lý click vào song 
                if(songNode){
                    app.currentIndex =Number(songNode.dataset.index) 
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

                // xủ lý click vào option
                if(e.target.closest('.option')){
                    alert("chưa có chức năng")
                }
            }
        }
        
    },
    // * hết phần render Scroll stop *************************************
    // hàm chắc năng 3 /
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
     // hàm tải bài hát 
    loadCurrentSong:function(){
        // get ra các classs
       
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    // chức năng chuyển bài hát 
    NextSong:function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0 
        }
        this.loadCurrentSong()
    },
      // chức năng quy bài hát
      prevSong:function(){
        this.currentIndex --
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    // hàm ramdom bài hát 
    playRamdomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()* this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    //* hàm scrollTopActivitySong*******
    scrollTopActivitySong:function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:"nearest"
            })
        }, 500);
    },
    // tạo ra start là cái bắt đầu 
    start: function(){
        // địng nghĩa các thuộc tính cho Object
        this.defineProperties();// này của cn3
        // lắng nghe sự kienje / xử lý sự kiện ( dom event )
        this.handleEvent();
        // tải bài hát đầu tiều khi chạy ứng dụng 
        this.loadCurrentSong();
        // render ra danh sách play list
        this.render(); 
    }
}
app.start()
// render ra html 
