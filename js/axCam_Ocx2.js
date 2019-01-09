if(type==0){
    //alert("视频开始显示"); 
}else if(type==1){
   //拍照的路径
    InfoTextCallback(0,str);
     
     
}else if(type==5){
   //图片保存失败
    InfoTextCallback(8,str);
}else if(type==8){
 //base64
    InfoTextCallback(21,str);
}else if(type==9){
    //base64
    LoadOver2();
}else if(type==12){
    //base64
   InfoCallback(0x38);
}