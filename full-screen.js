// (function() {
//     function fullScreen(){
//         var el = document.documentElement;
//         var request_full_screen = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          
//         if(typeof request_full_screen != "undefined" && request_full_screen) {
//             request_full_screen.call(el);
//         };
        
//         return;
//     }
    
//     //退出全屏
//     function exitScreen(){
//         if (document.exitFullscreen) {  
//             document.exitFullscreen();  
//         }else if (document.mozCancelFullScreen) {  
//             document.mozCancelFullScreen();  
//         }else if (document.webkitCancelFullScreen) {  
//             document.webkitCancelFullScreen();  
//         }else if (document.msExitFullscreen) {  
//             document.msExitFullscreen();  
//         }
        
//         if(typeof request_full_screen != "undefined" && request_full_screen) {
//             request_full_screen.call(el);
//         }
//     }
//     window.fullScreen = fullScreen;
//     window.exitScreen = exitScreen;
// })();