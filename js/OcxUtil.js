var SupportFormat;    //设备支持的视频格式代号：1->MJPG; 2->YUY2 
var OpenFormat;      //打开格式：0->YUY；1->MJPG
var SupportFormat2;    //设备支持的视频格式代号：1->MJPG; 2->YUY2 
var OpenFormat2;      //打开格式：0->YUY；1->MJPG



var base64DecodeChars = new Array( 
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, 
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, 
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1); 

function base64decode(str) { 
    var c1, c2, c3, c4; 
    var i, len, out; 

    len = str.length; 
    i = 0; 
    out = ""; 
    while(i < len) { 
    /* c1 */ 
    do { 
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]; 
    } while(i < len && c1 == -1); 
    if(c1 == -1) 
        break; 

    /* c2 */ 
    do { 
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]; 
    } while(i < len && c2 == -1); 
    if(c2 == -1) 
        break; 

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4)); 

    /* c3 */ 
    do { 
        c3 = str.charCodeAt(i++) & 0xff; 
        if(c3 == 61) 
        return out; 
        c3 = base64DecodeChars[c3]; 
    } while(i < len && c3 == -1); 
    if(c3 == -1) 
        break; 

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2)); 

    /* c4 */ 
    do { 
        c4 = str.charCodeAt(i++) & 0xff; 
        if(c4 == 61) 
        return out; 
        c4 = base64DecodeChars[c4]; 
    } while(i < len && c4 == -1); 
    if(c4 == -1) 
        break; 
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4); 
    } 
    return out; 
} 

function getBlobBydataURI(dataURI,type) {        
    //var binary = atob(dataURI.split(',')[1]);  
    var binary = base64decode(dataURI);  
    var array = [];        
    for(var i = 0; i < binary.length; i++) {         
        array.push(binary.charCodeAt(i));       
    }        
    return new Blob([new Uint8Array(array)], {type:type });     
} 

function OcxInit(){
    var strUsbNamr =new Array() ;
    var numCam = axCam_Ocx.GetDevCount();
    for (var i = 0; i < numCam; i++) {
        strUsbNamr[i] = axCam_Ocx.GetDevFriendName(i);
    }
    camidMain = axCam_Ocx.GetMainCameraID(1);
    camidSub = axCam_Ocx.GetSecondCameraID();
    GetDevName(numCam,strUsbNamr);

    var FormatSum  = axCam_Ocx.GetFormatCount(camidMain);
    switch(FormatSum)
    {
        case 1:   //（设备只支持MJPG格式）
            OpenFormat = 1 ;     //打开格式为MJPG
            SupportFormat = 1;
            break;
        case 2:   //（设备只支持YUY2格式）
            OpenFormat = 0 ;     //打开格式为YUY
            SupportFormat = 2;
            break;
        case 3:   //（设备支持MJPG与YUY2两种格式）
            OpenFormat = 1 ;     //默认打开格式为MJPG
            SupportFormat = 1;
            break;

        }

        OcxGetDeviceResolution();
    }

function StartCam(CamID,width,height){
    if(isIE){
        var i = axCam_Ocx.CAM_Open(CamID, OpenFormat, width, height);
        if (i == 0) InfoCallback(0x00);
        else if (i == -1) InfoCallback(0x16);
        else InfoCallback(0x02);
    }else {
        sendMsgStartVideo(CamID,width,height);
    }
}

function StartCam2(CamID,width,height){
    if(isIE){
        var i = axCam_Ocx2.CAM_Open(CamID, OpenFormat2, width, height);
        if (i == 0) InfoCallback(0x00);
        else if (i == -1) InfoCallback(0x16);
        else InfoCallback(0x02);
    }else {
        sendMsgStartVideo2(CamID,width,height);
    }
}

function CloseCam(){
    if(isIE){
        axCam_Ocx.CAM_Close();
        InfoCallback(0x01);
    }else sendMsgCloseVideo();
}

// function CloseCam2(){
//     if(isSecondDev){
//     if(isIE){
//         axCam_Ocx2.CAM_Close();
//         InfoCallback(0x01);
//     }else {
//         sendMsgCloseVideoSecond();
//     }
// }
// }

function CaptureImage(type){
    if(isIE){
        axCam_Ocx.CaptureImage();
    }else {
        sendMsgCapture(type);
    }
}

function CaptureImage2(type){
    if(isIE){
        axCam_Ocx2.CaptureImage();
    }else {
        if(type !=2){
        sendMsgCaptureSecond();
        }else sendMsgCaptureSecondCaibian();
    }
}

function ChangeCamDevice(CamID){

    if(isIE){
        var FormatSum  = axCam_Ocx.GetFormatCount(CamID);
        switch(FormatSum)
        {
        case 1:   //（设备只支持MJPG格式）
            OpenFormat = 1 ;     //打开格式为MJPG
            SupportFormat = 1;
            break;
        case 2:   //（设备只支持YUY2格式）
            OpenFormat = 0 ;     //打开格式为YUY
            SupportFormat = 2;
            break;
        case 3:   //（设备支持MJPG与YUY2两种格式）
            OpenFormat = 1 ;     //默认打开格式为MJPG
            SupportFormat = 1;
            break;

        }
        OcxGetDeviceResolution();
    }else {
        sendMsgGetResolution(CamID);
    }
}

function ChangeCamDevice2(CamID){

    if(isIE){
        var FormatSum  = axCam_Ocx2.GetFormatCount(CamID);
        switch(FormatSum)
        {
        case 1:   //（设备只支持MJPG格式）
            OpenFormat = 1 ;     //打开格式为MJPG
            SupportFormat = 1;
            break;
        case 2:   //（设备只支持YUY2格式）
            OpenFormat = 0 ;     //打开格式为YUY
            SupportFormat = 2;
            break;
        case 3:   //（设备支持MJPG与YUY2两种格式）
            OpenFormat = 1 ;     //默认打开格式为MJPG
            SupportFormat = 1;
            break;

        }
        OcxGetDeviceResolutionSecond();
    }else {
        sendMsgGetResolutionSecond(CamID);
    }
}

function SetColorMode(type){
    if(isIE){
        axCam_Ocx.SetImageColorMode(type);
    }else {
        sendMsgSetImageColorMode(type);
    }
}

function ShowSettingWindow(){
    if(isIE){
        axCam_Ocx.ShowImageSettingWindow();
    }else {
        sendMsgShowImageSettingWindow();
    }
}

function SetCamCutType(type){
   if(isIE){
    if(type==2){
        axCam_Ocx.CusCrop(1);
    }else axCam_Ocx.SetAutoCut(type);
}else sendMsgSetCutType(type);

}

function SetCamCutType2(type){
   if(isIE){
    if(type==2){
        axCam_Ocx2.CusCrop(1);
    }else axCam_Ocx2.SetAutoCut(0);
}

}

function SetImageType(type){
    if(isIE){
        axCam_Ocx.SetFileType(type);
    }else {
        if(type>2)type++;
        sendMsgSetFileType(type);
    }
}

//放大
function ZoomOut() {
     sendMsgZoom(1);
}

//缩小
function ZoomIn() {
    sendMsgZoom(0);
}

//左旋
function RoateL() {
     sendMsgRotateL();
}

//右旋
function RoateR() {
    sendMsgRotateR();
}

//适合大小
function BestSize() {
   if(isIE){
    axCam_Ocx.BestSize();
}else {
 sendMsgBestSize();
}
}

//实际大小
// function TrueSize() {
//     if(isIE){
//         axCam_Ocx.TrueSize();
//     }else {
//         sendMsgTrueSize();
//     }
// }

function SetWiseCapture(type){
   if(isIE){
    axCam_Ocx.WiseCapture(type);

}else {
    sendMsgSetConntinousShotModel(type);
}
}

function SetTimeCapture(type,time){
    if(isIE){
        axCam_Ocx.TimeCapture(type,time);
    }else {
        time = time/10;
        sendMsgSetConntinousShotModelTime(time);
    } 
}

function SetImagePath(path){
    if(isIE){
        var ret = axCam_Ocx.setFilePath(path);
        if(ret==0){
            InfoTextCallback(1,path);
        }else InfoCallback(0xae);
    }else {
        sendMsgSetFilePath(path);
    }
}

function SetImagePath2(path){
    if(isIE){
        var ret = axCam_Ocx2.setFilePath(path);
        if(ret==0){
            InfoTextCallback(1,path);
        }else InfoCallback(0xae);
    }
}

function RefreshDevice(){
    if(isIE){
        OcxInit();
    }else {

        sendMsgRefreshDev();
    }
}

function SetImagebase64(type){
//     if(isIE){
//        axCam_Ocx.IsImageBase64(type); 
// //        if(isSecondDev){
// //        axCam_Ocx2.IsImageBase64(type); 
// //    }
//    }else {
    sendMsgShotBase64(type);
// }
}

function StartIC(){
    if(isIE){
        axCam_Ocx.StartIDCard();
        InfoCallback(0x19);
    }else {
        sendMsgStartIDCard();
    }
}

function StartICWork(){
    if(isIE){
        var ret =axCam_Ocx.WorkIDCard(1);
        if(ret == 0){
            InfoCallback(0x20);
        }else if(ret == -2){
            InfoCallback(0x1f);
        }
    }else {
        sendMsgWorkIDCard();
    }
}

function StopICWork(){
    if(isIE){
        var ret = axCam_Ocx.WorkIDCard(0);
        if(ret == 0){
            InfoCallback(0x21);
        }else if(ret == -2){
            InfoCallback(0x1f);
        }else if(ret == -3){
            InfoCallback(0x1e);
        }
    }else {
        sendMsgStopWorkIDCard();
    }
}

function GetOneIC(){
    if(isIE){
        var ret =axCam_Ocx.GetOneIC();
        if(ret==0){
           InfoCallback(0x1b);
       }else if(ret==-1){
        InfoCallback(0x1d);
    }else if(ret==-2){
        InfoCallback(0x1c);
    }else if(ret==-3){
        InfoCallback(0x1e);
    }else if(ret==-4){
       InfoCallback(0x1f);
   }
}else {
    sendMsgGetOneIC();
}
}

function GetICValues(){
    if(isIE){
        var name = axCam_Ocx.GetICValues("NAME");
        if(name.length>0){
        InfoTextCallback(9,name);

        var IC = axCam_Ocx.GetICValues("IC");
        InfoTextCallback(10,IC);

        var SEX = axCam_Ocx.GetICValues("SEX");
        InfoTextCallback(11,SEX);

        var NATION = axCam_Ocx.GetICValues("NATION");
        InfoTextCallback(12,NATION);

        var BIRTHDAY = axCam_Ocx.GetICValues("BIRTHDAY");
        InfoTextCallback(13,BIRTHDAY);

        var ADDRESS = axCam_Ocx.GetICValues("ADDRESS");
        InfoTextCallback(14,ADDRESS);

        var SIGNDEPT = axCam_Ocx.GetICValues("SIGNDEPT");
        InfoTextCallback(15,SIGNDEPT);

        var VALIDSTARTDATE = axCam_Ocx.GetICValues("VALIDSTARTDATE");
        InfoTextCallback(16,VALIDSTARTDATE);

        var VALIDENDDATE = axCam_Ocx.GetICValues("VALIDENDDATE");
        InfoTextCallback(17,VALIDENDDATE);

        var SAMID = axCam_Ocx.GetICValues("SAMID");
        InfoTextCallback(18,SAMID);


        var picBase64 = axCam_Ocx.GetICPicture();
        InfoTextCallback(19,picBase64);
    }

    }else {
        for(var i=0;i<11;i++){
            sendMsgGetICValues(i);
        }
    }
}

function ReadBarCode(imgPath){
    if(isIE){
       var CodeStr = axCam_Ocx.GetBarcodeContent(imgPath);
       if(CodeStr.length>0){
          InfoTextCallback(2,CodeStr);
      }else {
        InfoCallback(0xab);
    }
}else {
    sendMsgBarcode(imgPath);
}

}

function ReadQrCode(imgPath){
    if(isIE){
        var CodeStr = axCam_Ocx.GetQRcodeContent(imgPath);
        InfoTextCallback(7,CodeStr);
    }else {
        sendMsgQrcode(imgPath);
    }
}

function AddPDFImageFile(imgPath){
    if(isIE){
        var ret =axCam_Ocx.AddPDFImageFile(imgPath,"",0);
        if(ret == 0){
            InfoCallback(0x05);
        }else if(ret == -1){
           InfoCallback(0xa5);
       }
   }else {
    sednMsgAddPDF(imgPath);
}
}

function SavePDF(path){
    if(isIE){
        var ret =axCam_Ocx.Convert2PDF(path);
        if(ret == 0){
            InfoCallback(0x06);
        }else if(ret == -1){
           InfoCallback(0xa1);
       }
   }else {
       sednMsgSavePDF(path);
   }
}

function CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir){
   if(isIE){
       var ret = axCam_Ocx.CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir);
       if(ret == 0){
        InfoCallback(0x07);
    }else {
       InfoCallback(0xad);
   }
}else {
    if(dir!=1)dir=0;
    sendMsgCombineTwoImage(ImgPath1,ImgPath2,combinePath,dir);
}
}

function UpdataFile(ip,port,method,imgPath){
    if(isIE){
        var ret = axCam_Ocx.UpdataFile(ip, port, method,imgPath);
        if(ret==0){
            InfoCallback(0x12);
        }else {
            InfoCallback(0xa9);
        }
    }else {
        sendMsgUploadFilePort(port,ip,method,imgPath);
    }
}

function GetBase64FromFile(path){
    if(isIE){
        var basestr = axCam_Ocx.GetBase64FromFile(path);  
        InfoTextCallback(5,basestr);
    }else{
        sednMsgGetBase64(path);
    }
}

function CloseWaterMark(){
    if(isIE){
        axCam_Ocx.SetAddMark(0);
    }else {
        sednMsgWaterMarkClose();
    }
}

// function OpenWaterMark(waterinfo, FontSize, FontSytle, r, g, b, xOff, xOff){
//     if(isIE){
//         axCam_Ocx.SetAddMark(1);
//         axCam_Ocx.SetWaterMark(waterinfo, FontSize, FontSytle, r, g, b, xOff, xOff);
//     }else {
//         sednMsgWaterMarkOpen(waterinfo,FontSize,FontSytle,r,g,b,xOff,xOff);
//     }
// }

function SetJiubianModel(type){
    if(isIE){
       axCam_Ocx.setJiubianModel(type);
   }else {
    sendMsgSetJiubianModel(type);
}
}

function SetBuBai(type){
    if(isIE){
        axCam_Ocx.setBuBai(type);
    }else {
        sednMsgBubaiType(type);
    }
}

function SetQudise(type){
    if(isIE){
       axCam_Ocx.setQudise(type); 
   }else {
    sednMsgQuqudiseType(type); 
}
}

function SetFileNameCustom(str,index){

    if(isIE){
        axCam_Ocx.setFileNameCustom(str,index);
    }else {
        sendMsgSetFileNameModelCustom(index,str);
    }

}

function SetFileNameCustom2(str,index){

    if(isIE){
        axCam_Ocx2.setFileNameCustom(str,index);
    }else {
        sendMsgSetFileNameModelCustomSecond(index,str);
    }

}

function SetFileNameFixed(str){
     if(isIE){
        axCam_Ocx.setFileNameFixed(str);
    }else {
        sendMsgSetFileNameModelFixed(str);
    }

}

function SetFileNameFixed2(str){
     if(isIE){
        axCam_Ocx2.setFileNameFixed(str);
    }else {
        sendMsgSetFileNameModelFixedSecond(str);
    }

}

function SetFileNameTime(){
     if(isIE){
        axCam_Ocx.setFileNameTime();
    }else {
        sendMsgSetFileNameModelTime();
    }
}

function SetFileNameTime2(){
     if(isIE){
        axCam_Ocx2.setFileNameTime();
    }else {
        sendMsgSetFileNameModelTimeSecond();
    }
}

function SetAutoExposure(type){

if(isIE){
    axCam_Ocx.SetAutoExposure(type);
    if(type==1){
        InfoCallback(0x17);

    }else if(type==0){
        InfoCallback(0x18);
    }
}else {
    sendMsgSetAutoExposure(type);
}

}

function GetCamParameter(){
    if(isIE){
        var brightnessValue = axCam_Ocx.GetBrightnessRange();
        InfoTextCallback(23,brightnessValue);
        var exposureValue = axCam_Ocx.GetExposureRange();
        InfoTextCallback(22,exposureValue);

    }else {
        sendMsgGetExposureRange();
        sendMsgGetBrightnessRange();

    }
}

function SetExposure(value){
    if(isIE){
        axCam_Ocx.SetExposure(value);
    }else {
        sendMsgSetExposure(value);
    }

}

function SetBrightness(value){
    if(isIE){
        axCam_Ocx.SetBrightness(value)
    }else {
        sendMsgSetBrightness(value);
    }

}

function GetCamNum(){
    if(isIE){
        var num = axCam_Ocx.GetDevCount();
        //GetDevCount(num);
         InfoTextCallback(26,num);
    }else {
        sendMsgGetCamNum();
    }
}

function DeleteFile(path){
    if(isIE){
        var ret = axCam_Ocx.DeleteFileImage(path);
        if(ret ==1){
            InfoTextCallback(6,path);
        }else {
            InfoCallback(0xa2);
        
        }
    }else {
        sendMsgDeleteFile(path);
    }
}

function SetJpgQuanlity(value){
    if(isIE){
       axCam_Ocx.SetJpgQuanlity(value);
    }else {
        sendMsgSetJpgQuanlity(value);
    }
}

function SetJpgQuanlity2(value){
    if(isIE){
       axCam_Ocx2.SetJpgQuanlity(value);
    }else {
     
    }
}

function SetCusCropPlace(cutX,cutY,cutW,cutH){
    if(isIE){
            axCam_Ocx.SetCusCropPlace(cutX,cutY,cutW,cutH);
    }else {
        SetCusCropPlaceWs(cutX,cutY,cutW,cutH);
    }

}


function GetICPictureAll(){
     if(isIE){
          var picBase64 = axCam_Ocx.GetICPictureAll();
        InfoTextCallback(25,picBase64);
    }else {
       sendMsgGetICPictureAll();
    }
}

function InitFinger(){
    if(isIE){
        var ret = axCam_Ocx.InitFinger();
        if(ret ==1){
             InfoCallback(0x25);
        }else InfoCallback(0x26);
    }else {
        sendMsgInitFinger();
    }
}

function StartFinger(){
     if(isIE){
        var ret = axCam_Ocx.StartFinger();
        if(ret ==1){
             InfoCallback(0x30);
        }else if(ret == -1){
             InfoCallback(0x27);
        }else if(ret == -2){
             InfoCallback(0x28);
        }else if(ret == -3){
             InfoCallback(0xb1);
        }else if(ret == -4){
             InfoCallback(0x31);
        }
     }else {
        sendMsgStartFinger();
     }
}

function CloseFinger(){
    if(isIE){
        axCam_Ocx.CloseFinger();
         InfoCallback(0x32);
    }else {
        sendMsgCloseFinger();
    }
}