var ws;
var canvas;
var context;
var canvasSecond;
var contextSecond;
var canvasX;
var canvasY;
var canvasLastX;
var canvasLastY;
var isDragging = false;
var canvasX_manual = 0;
var canvasY_manual = 0;
var recX_manual = 0;
var recY_manual = 0;
var recW_manual = 0;
var recH_manual = 0;
var rec_ww = 0;
var rec_hh = 0;
var CutType = 0;
var imgOrignalW = 0;
var imgOrignalH = 0;
var rorateAngleType = 0;
var cutXCaibian = 0;
var cutYCaibian = 0;
var isDrawMove = false;

var canvasLastX2;
var canvasLastY2;
var isDragging2 = false;
var canvasX_manual2 = 0;
var canvasY_manual2 = 0;
var recX_manual2 = 0;
var recY_manual2 = 0;
var recW_manual2 = 0;
var recH_manual2 = 0;
var rec_ww2 = 0;
var rec_hh2 = 0;
var imgOrignalW2 = 0;
var imgOrignalH2 = 0;
var isDrawMove2 = false;
var cutXCaibian2 = 0;
var cutYCaibian2 = 0;



function WsInit(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas) {
  WsInit_ip(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas, "localhost");
}

function WsInit_ip(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas, ip) {
  if (enableCanvas) {
    canvas = document.getElementById("cameraCanvas");
    context = canvas.getContext("2d");
    // if (isSecondDev) {
    //   canvasSecond = document.getElementById("cameraCanvasSecond");
    //   contextSecond = canvasSecond.getContext("2d");
    //   canvasSecond.onmousedown = canvasClick2;
    //   canvasSecond.onmouseup = stopDragging2;
    //   canvasSecond.onmouseout = stopDragging2;
    //   canvasSecond.onmousemove = canvasMove2;
    // }
    canvas.onmousedown = canvasClick;
    canvas.onmouseup = stopDragging;
    canvas.onmouseout = stopDragging;
    canvas.onmousemove = canvasMove;
    canvasX = 0;
    canvasY = 0;
    canvasLastX = 0;
    canvasLastY = 0;
  }

  //ws=new WebSocket("ws://localhost:9002"); 
  ws = new WebSocket("ws://" + ip + ":9002");
  ws.binaryType = "arraybuffer";
  ws.onmessage = function (event) {

    var aDataArray = new Uint8Array(event.data);
    if (aDataArray.length > 0) {
      if (aDataArray[0] == 0xef && aDataArray[1] == 0x01) {
        // getDeviceName(aDataArray[3]);
        // getResolution(aDataArray,5);
        getUsbCamareMessage(aDataArray, 5)
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x17) {
        var camNum = aDataArray[3];
        //GetDevCount(camNum);
        InfoTextCallback(26, camNum);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x19) {
        getResolution(aDataArray, 5);

      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x23) {
        //getResolution(aDataArray,4);
        var type = aDataArray[3];
        var len = aDataArray[4];
        var data = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          data[i] = aDataArray[5 + i];
        }
        var str = byteToString(data)
        var text = decodeURIComponent(str);
        InfoTextCallback(type, text);

      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x05) {
        var ww = aDataArray[3] * 256 + aDataArray[4];
        var hh = aDataArray[5] * 256 + aDataArray[6];
        context.clearRect(0, 0, canvas.width, canvas.height);
        //sendMsgRefreshCam();
        var imgData = context.createImageData(ww, hh);
        var dataNum = 0;
        for (var i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i + 0] = aDataArray[dataNum];
          imgData.data[i + 1] = aDataArray[dataNum + 1];
          imgData.data[i + 2] = aDataArray[dataNum + 2];
          imgData.data[i + 3] = 255;
          dataNum = dataNum + 3;
        }
        sendMsgRefreshCam();
        if (CutType == 2) {
          rec_ww = ww;
          rec_hh = hh;
          context.putImageData(imgData, canvas.width / 2 - ww / 2, canvas.height / 2 - hh / 2);
          refreshRect();
        } else context.putImageData(imgData, canvas.width / 2 - ww / 2 + canvasX, canvas.height / 2 - hh / 2 + canvasY);


      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x0c) {
        var ww = aDataArray[3] * 256 + aDataArray[4];
        var hh = aDataArray[5] * 256 + aDataArray[6];
        context.clearRect(0, 0, canvas.width, canvas.height);
        //sendMsgRefreshCam();
        var imgData = context.createImageData(ww, hh);
        var dataNum = 0;
        for (var i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i + 0] = aDataArray[dataNum];
          imgData.data[i + 1] = aDataArray[dataNum + 1];
          imgData.data[i + 2] = aDataArray[dataNum + 2];
          imgData.data[i + 3] = 255;
          dataNum = dataNum + 3;
        }
        sendMsgRefreshCam();
        var Xdis = canvas.width / 2 - ww / 2 + canvasX;
        var Ydis = canvas.height / 2 - hh / 2 + canvasY;
        context.putImageData(imgData, Xdis, Ydis);

        var lenJiubian = aDataArray[7];


        context.beginPath();
        context.strokeStyle = "rgb(0,255,0)";
        context.lineWidth = 2;

        for (var j = 0; j < lenJiubian; j++) {
          for (var i = 0; i < 3; i++) {
            var aa = 1;
            if (aDataArray[8 + i * 6 + j * 24] == 1) {
              aa = -1;
            }
            var bb = 1;
            if (aDataArray[11 + i * 6 + j * 24] == 1) {
              bb = -1;
            }
            var cc = 1;
            if (aDataArray[14 + i * 6 + j * 24] == 1) {
              cc = -1;
            }
            var dd = 1;
            if (aDataArray[17 + i * 6 + j * 24] == 1) {
              dd = -1;
            }
            context.moveTo(aDataArray[9 + i * 6 + j * 24] * 256 * aa + aDataArray[10 + i * 6 + j * 24] * aa + Xdis, aDataArray[12 + i * 6 + j * 24] * 256 * bb + aDataArray[13 + i * 6 + j * 24] * bb + Ydis);
            context.lineTo(aDataArray[15 + i * 6 + j * 24] * 256 * cc + aDataArray[16 + i * 6 + j * 24] * cc + Xdis, aDataArray[18 + i * 6 + j * 24] * 256 * dd + aDataArray[19 + i * 6 + j * 24] * dd + Ydis);
            context.stroke();
          }
          var ee = 1;
          if (aDataArray[26 + j * 24] == 1) {
            ee = -1;
          }
          var ff = 1;
          if (aDataArray[8 + j * 24] == 1) {
            ff = -1;
          }
          context.moveTo(aDataArray[27 + j * 24] * 256 + aDataArray[28 + j * 24] + Xdis, aDataArray[30 + j * 24] * 256 + aDataArray[31 + j * 24] + Ydis);
          context.lineTo(aDataArray[9 + j * 24] * 256 + aDataArray[10 + j * 24] + Xdis, aDataArray[12 + j * 24] * 256 + aDataArray[13 + j * 24] + Ydis);
          context.stroke();
        }
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x14) {
        var tmp = aDataArray[3];
        InfoCallback(tmp);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x26) {

        // if (isSecondDev) {
        //   var ww = aDataArray[3] * 256 + aDataArray[4];
        //   var hh = aDataArray[5] * 256 + aDataArray[6];
        //   contextSecond.clearRect(0, 0, canvasSecond.width, canvasSecond.height);

        //   var imgData = contextSecond.createImageData(ww, hh);
        //   var dataNum = 0;
        //   for (var i = 0; i < imgData.data.length; i += 4) {
        //     imgData.data[i + 0] = aDataArray[dataNum];
        //     imgData.data[i + 1] = aDataArray[dataNum + 1];
        //     imgData.data[i + 2] = aDataArray[dataNum + 2];
        //     imgData.data[i + 3] = 255;
        //     dataNum = dataNum + 3;

        //   }
        //   sendMsgRefreshCamSecond();


        //   contextSecond.putImageData(imgData, canvasSecond.width / 2 - ww / 2, canvasSecond.height / 2 - hh / 2);
        //   if (CutType == 2) {
        //     rec_ww2 = ww;
        //     rec_hh2 = hh;
        //     refreshRect2();
        //   }


        // }
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x30) {
        var type1 = aDataArray[3];
        var ret = 1;
        if (type1 == 0) {
          ret = -1;
        }
        var min = aDataArray[4] * ret;

        var type2 = aDataArray[5];
        ret = 1;
        if (type2 == 0) {
          ret = -1;
        }
        var max = aDataArray[6] * ret;
        var text = "" + min + "*" + max;
        InfoTextCallback(23, text);
        // GetBrightnessRange_ws(min,max);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x32) {
        var type1 = aDataArray[3];
        var ret = 1;
        if (type1 == 0) {
          ret = -1;
        }
        var min = aDataArray[4] * ret;

        var type2 = aDataArray[5];
        ret = 1;
        if (type2 == 0) {
          ret = -1;
        }
        var max = aDataArray[6] * ret;
        var max = aDataArray[6] * ret;
        var text = "" + min + "*" + max;
        InfoTextCallback(22, text);
        // GetExposureRange_ws(min,max);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x36) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        InfoTextCallback(5, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x3b) {
        camidMain = aDataArray[3];
        // if (isSecondDev) {
        //   camidSub = aDataArray[4];
        // }
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x3e) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        InfoTextCallback(19, text);

      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x43) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        InfoTextCallback(21, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x4a) {
        rorateAngleType = aDataArray[3];
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x4c) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        InfoTextCallback(25, text);
      }
    }

  };
  // ´ò¿ªWebSocket 
  ws.onclose = function (event) {
    //WebSocket Status:: Socket Closed
    InfoCallback(0xa3);
    alert("程序出现异常,请重新启动0x00");
  };
  // ´ò¿ªWebSocket
  ws.onopen = function (event) {
    if (enableCanvas) {
      sendMsgGetMainCameraID();
      sendMsgRefreshDev();
      initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2);
    }

    InfoCallback(0x24);

  };
  ws.onerror = function (event) {
    //WebSocket Status:: Error was reported
    InfoCallback(0xa4);
    alert("程序出现异常,请重新启动0x01");
  };
}

// 初始化摄像头
function initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2) {
  sendMsgBestSize();
  sendMsgSetCutType(1);
  sendMsgSetFileType(0);
  sendMsgSetImageColorMode(0);
  sendMsgSetConntinousShotModel(0);
  sendMsgChangeOrientation(0);
  sendMsgSetCanvasOriginalSize(orignalCanvasW, orignalCanvasH);
  sendMsgSetCanvasSecondOriginalSize(orignalCanvasW2, orignalCanvasH2);
  sendMsgShotBase64(1)  // 只生成base64

}

function canvasClick(e) {
  isDragging = true;
  if (!isDrawMove) {
    canvasLastX = 0;

    canvasLastY = 0;
    canvasX_manual = 0;
    canvasY_manual = 0;

    recX_manual = 0;
    recY_manual = 0;
    recW_manual = 0;
    recH_manual = 0;
  } else {

  }
}

function stopDragging() {
  isDragging = false;
  canvasLastX = 0;
  canvasLastY = 0;
  canvasX_manual = 0;
  canvasY_manual = 0;
  if (CutType == 2) {
    var bpp = rec_ww / imgOrignalW;
    if (rorateAngleType == 1 || rorateAngleType == 3) {
      bpp = rec_ww / imgOrignalH;
    }
    cutXCaibian = Math.abs(recW_manual) / bpp;
    cutYCaibian = Math.abs(recH_manual) / bpp;
  }
}

function canvasMove(e) {
  var mx = e.pageX - canvas.offsetLeft;
  var my = e.pageY - canvas.offsetTop;
  if (CutType == 2) {
    var x1 = recX_manual;
    var x2 = recX_manual + recW_manual;
    if (x1 > x2) {
      x1 = x2;
      x2 = recX_manual;
    }

    var y1 = recY_manual;
    var y2 = recY_manual + recH_manual;
    if (y1 > y2) {
      y1 = y2;
      y2 = recY_manual;
    }

    if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
      isDrawMove = true;
      if (isDragging) {
        if (canvasLastX == 0 && canvasLastY == 0) {
          canvasLastX = mx;
          canvasLastY = my;

        } else {
          recX_manual = recX_manual + (mx - canvasLastX);
          recY_manual = recY_manual + (my - canvasLastY);
          canvasLastX = mx;
          canvasLastY = my;
        }

      }
      return;
    } else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
      isDrawMove = true;
      if (isDragging) {
        if (canvasLastX == 0 && canvasLastY == 0) {

          canvasLastX = mx;
          canvasLastY = my;

        } else {

          var tmpX2 = recX_manual + recW_manual;
          if (Math.abs(recX_manual - mx) < Math.abs(tmpX2 - mx)) {
            recX_manual = recX_manual + (mx - canvasLastX);
            recW_manual = recW_manual - (mx - canvasLastX);
          } else recW_manual = recW_manual + (mx - canvasLastX);

          var tmpY2 = recY_manual + recH_manual;
          if (Math.abs(recY_manual - my) < Math.abs(tmpY2 - my)) {
            recY_manual = recY_manual + (my - canvasLastY);
            recH_manual = recH_manual - (my - canvasLastY);
          } else recH_manual = recH_manual + (my - canvasLastY);

          canvasLastX = mx;
          canvasLastY = my;
        }

        return;
      }
    } else isDrawMove = false;
  }

  if (isDragging == true) {
    if (CutType != 2) {
      if (canvasLastX == 0 && canvasLastY == 0) {
        canvasLastX = e.pageX - canvas.offsetLeft;
        canvasLastY = e.pageY - canvas.offsetTop;

      } else {

        canvasX = canvasX + (mx - canvasLastX);
        canvasY = canvasY + (my - canvasLastY);
        canvasLastX = mx;
        canvasLastY = my;
      }
    } else {




      if (canvasLastX == 0 && canvasLastY == 0) {

        canvasLastX = mx;
        canvasLastY = my;
        recX_manual = mx;
        recY_manual = my;
      } else {



        canvasX_manual = canvasX_manual + (mx - canvasLastX);
        canvasY_manual = canvasY_manual + (my - canvasLastY);
        canvasLastX = mx;
        canvasLastY = my;
        recW_manual = canvasX_manual;
        recH_manual = canvasY_manual;
      }

    }
  }
}

function canvasClick2(e) {
  isDragging2 = true;
  if (!isDrawMove2) {
    canvasLastX2 = 0;

    canvasLastY2 = 0;
    canvasX_manual2 = 0;
    canvasY_manual2 = 0;

    recX_manual2 = 0;
    recY_manual2 = 0;
    recW_manual2 = 0;
    recH_manual2 = 0;
  }
}

function stopDragging2() {
  isDragging2 = false;
  canvasLastX2 = 0;
  canvasLastY2 = 0;
  canvasX_manual2 = 0;
  canvasY_manual2 = 0;
  if (CutType == 2) {
    var bpp2 = rec_ww2 / imgOrignalW2;
    cutXCaibian2 = Math.abs(recW_manual2) / bpp2;
    cutYCaibian2 = Math.abs(recH_manual2) / bpp2;
  }
}

function canvasMove2(e) {
  var mx = e.pageX - canvasSecond.offsetLeft;
  var my = e.pageY - canvasSecond.offsetTop;
  if (CutType == 2) {
    var x1 = recX_manual2;
    var x2 = recX_manual2 + recW_manual2;
    if (x1 > x2) {
      x1 = x2;
      x2 = recX_manual2;
    }

    var y1 = recY_manual2;
    var y2 = recY_manual2 + recH_manual2;
    if (y1 > y2) {
      y1 = y2;
      y2 = recY_manual2;
    }

    if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
      isDrawMove2 = true;
      if (isDragging2) {
        if (canvasLastX2 == 0 && canvasLastY2 == 0) {
          canvasLastX2 = mx;
          canvasLastY2 = my;

        } else {
          recX_manual2 = recX_manual2 + (mx - canvasLastX2);
          recY_manual2 = recY_manual2 + (my - canvasLastY2);
          canvasLastX2 = mx;
          canvasLastY2 = my;
        }

      }
      return;

    } else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
      isDrawMove2 = true;
      if (isDragging2) {
        if (canvasLastX2 == 0 && canvasLastY2 == 0) {

          canvasLastX2 = mx;
          canvasLastY2 = my;

        } else {

          var tmpX2 = recX_manual2 + recW_manual2;
          if (Math.abs(recX_manual2 - mx) < Math.abs(tmpX2 - mx)) {
            recX_manual2 = recX_manual2 + (mx - canvasLastX2);
            recW_manual2 = recW_manual2 - (mx - canvasLastX2);
          } else recW_manual2 = recW_manual2 + (mx - canvasLastX2);

          var tmpY2 = recY_manual2 + recH_manual2;
          if (Math.abs(recY_manual2 - my) < Math.abs(tmpY2 - my)) {
            recY_manual2 = recY_manual2 + (my - canvasLastY2);
            recH_manual2 = recH_manual2 - (my - canvasLastY2);
          } else recH_manual2 = recH_manual2 + (my - canvasLastY2);

          canvasLastX2 = mx;
          canvasLastY2 = my;
        }

        return;
      }
    } else isDrawMove2 = false;
  }

  if (isDragging2 == true) {
    if (CutType != 2) {

    } else {

      if (canvasLastX2 == 0 && canvasLastY2 == 0) {

        canvasLastX2 = mx;
        canvasLastY2 = my;
        recX_manual2 = mx;
        recY_manual2 = my;
      } else {

        canvasX_manual2 = canvasX_manual2 + (mx - canvasLastX2);
        canvasY_manual2 = canvasY_manual2 + (my - canvasLastY2);
        canvasLastX2 = mx;
        canvasLastY2 = my;
        recW_manual2 = canvasX_manual2;
        recH_manual2 = canvasY_manual2;
      }

    }
  }
}

function getResolution(arrayData, tmpNum) {
  var type = arrayData[3]
  var len = arrayData[4];
  var data = new Int32Array(len * 2);
  var num = 0;
  for (var i = 0; i < len; i++) {
    data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
    num++;
    data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
    num++;
    tmpNum += 4;
  }
  if (type == 0) {
    GetDeviceResolution(data);
  } else {
    // if (isSecondDev) {
    //   GetDeviceResolutionSecond(data);
    //   LoadOver2();
    // }
  }

}

function getUsbCamareMessage(arrayData, tmpNum) {
  var numCam = arrayData[3];
  var len = arrayData[4];
  var data = new Int32Array(len * 2);
  var num = 0;
  for (var i = 0; i < len; i++) {
    data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
    num++;
    data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
    num++;
    tmpNum += 4;
  }
  GetDeviceResolution(data);
  LoadOver();

  var strUsbNamr = new Array()
  for (var i = 0; i < numCam; i++) {
    var tmpLen = arrayData[tmpNum];
    var tmpData = new Uint8Array(tmpLen);
    tmpNum++;
    for (var j = 0; j < tmpLen; j++) {
      tmpData[j] = arrayData[tmpNum];
      tmpNum++;
    }
    // var arr =       Utf8ToUnicode(tmpData)
    var str = byteToString(tmpData);
    var text = decodeURIComponent(str);
    strUsbNamr[i] = text;
  }
  GetDevName(numCam, strUsbNamr);


}



function sendMsgRefreshCam() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x04;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgStartVideo2(camId, width, height) {

  imgOrignalW2 = width;
  imgOrignalH2 = height;
  var aDataArray = new Uint8Array(8);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x25;
  aDataArray[2] = 0x05;
  aDataArray[3] = camId;
  aDataArray[4] = width / 256;
  aDataArray[5] = width % 256;
  aDataArray[6] = height / 256;
  aDataArray[7] = height % 256;
  ws.send(aDataArray.buffer);
}
function sendMsgRefreshCamSecond() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x27;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}
function sendMsgSetCanvasOriginalSize(ww, hh) {
  var aDataArray = new Uint8Array(7);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x15;
  aDataArray[2] = 0x04;
  aDataArray[3] = ww / 256;
  aDataArray[4] = ww % 256;
  aDataArray[5] = hh / 256;
  aDataArray[6] = hh % 256;
  ws.send(aDataArray.buffer);
}
function sendMsgSetCanvasSecondOriginalSize(ww, hh) {
  var aDataArray = new Uint8Array(7);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x37;
  aDataArray[2] = 0x04;
  aDataArray[3] = ww / 256;
  aDataArray[4] = ww % 256;
  aDataArray[5] = hh / 256;
  aDataArray[6] = hh % 256;
  ws.send(aDataArray.buffer);
}
function sendMsgRefreshDev() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x00;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}
function sendMsgStartVideo(camId, width, height) {

  imgOrignalW = width;
  imgOrignalH = height;
  var aDataArray = new Uint8Array(8);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x02;
  aDataArray[2] = 0x05;
  aDataArray[3] = camId;
  aDataArray[4] = width / 256;
  aDataArray[5] = width % 256;
  aDataArray[6] = height / 256;
  aDataArray[7] = height % 256;
  ws.send(aDataArray.buffer);
}
function sendMsgChangeOrientation(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x06;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}
function sendMsgSetImageColorMode(type) {
  var aDataArray2 = new Uint8Array(4);
  aDataArray2[0] = 0xef;
  aDataArray2[1] = 0x07;
  aDataArray2[2] = 0x01;
  aDataArray2[3] = type;
  ws.send(aDataArray2.buffer);
}

function sendMsgCloseVideo() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x08;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function sendMsgCloseVideoSecond() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x28;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
  contextSecond.clearRect(0, 0, canvas.width, canvas.height);
}
function sendMsgChangeResolution(camId, width, height) {



  var aDataArray = new Uint8Array(8);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x02;
  aDataArray[2] = 0x05;
  aDataArray[3] = camId;
  aDataArray[4] = width / 256;
  aDataArray[5] = width % 256;
  aDataArray[6] = height / 256;
  aDataArray[7] = height % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFilePath(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1c;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelCustom(index, pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(6 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1d;
  aDataArray[2] = len + 3;
  aDataArray[3] = index / 256;
  aDataArray[4] = index % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelCustomSecond(index, pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(6 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x46;
  aDataArray[2] = len + 3;
  aDataArray[3] = index / 256;
  aDataArray[4] = index % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelFixed(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1f;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelFixedSecond(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x48;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelTime() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1e;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelTimeSecond() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x47;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelBarcode() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2b;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileType(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x20;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetConntinousShotModel(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x21;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetConntinousShotModelTime(len) {
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x22;
  aDataArray[2] = 0x02;
  aDataArray[3] = len / 256;
  aDataArray[4] = len % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgUploadFile(uploadSerHead, uploadSerLast, uploadSerFile) {
  var path = encodeURI(uploadSerHead);
  var pathdata = stringToByte(path);
  var len = path.length;

  var path2 = encodeURI(uploadSerLast);
  var pathdata2 = stringToByte(path2);
  var len2 = path2.length;

  var path3 = encodeURI(uploadSerFile);
  var pathdata3 = stringToByte(path3);
  var len3 = path3.length;

  var aDataArray = new Uint8Array(8 + len + len2 + len3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x24;
  aDataArray[2] = 5 + len + len2 + len3;
  aDataArray[3] = 0x00;
  aDataArray[4] = 80 % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  aDataArray[6 + len] = len2;
  for (var i = 0; i < len2; i++) {
    aDataArray[7 + len + i] = pathdata2[i];
  }
  aDataArray[7 + len + len2] = len3;
  for (var i = 0; i < len3; i++) {
    aDataArray[8 + len + len2 + i] = pathdata3[i];
  }
  ws.send(aDataArray.buffer);

}

function sendMsgUploadFilePort(port, uploadSerHead, uploadSerLast, uploadSerFile) {
  var path = encodeURI(uploadSerHead);
  var pathdata = stringToByte(path);
  var len = path.length;

  var path2 = encodeURI(uploadSerLast);
  var pathdata2 = stringToByte(path2);
  var len2 = path2.length;

  var path3 = encodeURI(uploadSerFile);
  var pathdata3 = stringToByte(path3);
  var len3 = path3.length;

  var aDataArray = new Uint8Array(8 + len + len2 + len3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x24;
  aDataArray[2] = 5 + len + len2 + len3;
  aDataArray[3] = port / 256;
  aDataArray[4] = port % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  aDataArray[6 + len] = len2;
  for (var i = 0; i < len2; i++) {
    aDataArray[7 + len + i] = pathdata2[i];
  }
  aDataArray[7 + len + len2] = len3;
  for (var i = 0; i < len3; i++) {
    aDataArray[8 + len + len2 + i] = pathdata3[i];
  }
  ws.send(aDataArray.buffer);

}

function sendMsgCapture(type) {
  if (type != 2) {
    var aDataArray = new Uint8Array(4);
    aDataArray[0] = 0xef;
    aDataArray[1] = 0x0a;
    aDataArray[2] = 0x01;
    aDataArray[3] = 0x00;
    ws.send(aDataArray.buffer);
  } else {
    var x1 = recX_manual;
    if (recX_manual > recX_manual + recW_manual) {
      x1 = recX_manual + recW_manual;

    }
    var y1 = recY_manual;
    if (recY_manual > recY_manual + recH_manual) {
      y1 = recY_manual + recH_manual;

    }


    //   var bpp = rec_ww/imgOrignalW;

    // if(rorateAngleType==1 || rorateAngleType==3){
    //   bpp = rec_hh/imgOrignalH;
    // }

    //var w1 = Math.abs(recW_manual/bpp);
    //  var h1 = Math.abs(recH_manual/bpp);
    var xsend = x1 - (canvas.width / 2 - rec_ww / 2);
    var ysend = y1 - (canvas.height / 2 - rec_hh / 2);


    if (xsend < 0) xsend = 0;
    if (ysend < 0) ysend = 0;
    var aDataArray = new Uint8Array(11);
    aDataArray[0] = 0xef;
    //aDataArray[1] = 0x0f;
    aDataArray[1] = 0x4b;
    aDataArray[2] = 0x08;
    aDataArray[3] = xsend / 256;
    aDataArray[4] = xsend % 256;
    aDataArray[5] = ysend / 256;
    aDataArray[6] = ysend % 256;
    aDataArray[7] = cutXCaibian / 256;
    aDataArray[8] = cutXCaibian % 256;
    aDataArray[9] = cutYCaibian / 256;
    aDataArray[10] = cutYCaibian % 256;
    // aDataArray[7] = recW_manual/256;
    // aDataArray[8] = recW_manual%256;
    // aDataArray[9] = recH_manual/256;
    // aDataArray[10] = recH_manual%256;
    ws.send(aDataArray.buffer);
  }

}

function sendMsgCaptureSecond() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x29;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgCaptureSecondCaibian() {
  var x1 = recX_manual2;
  if (recX_manual2 > recX_manual2 + recW_manual2) {
    x1 = recX_manual2 + recW_manual2;

  }
  var y1 = recY_manual2;
  if (recY_manual2 > recY_manual2 + recH_manual2) {
    y1 = recY_manual2 + recH_manual2;

  }

  var xsend = x1 - (canvasSecond.width / 2 - rec_ww2 / 2);
  var ysend = y1 - (canvasSecond.height / 2 - rec_hh2 / 2);


  if (xsend < 0) xsend = 0;
  if (ysend < 0) ysend = 0;
  var aDataArray = new Uint8Array(11);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x4c;
  aDataArray[2] = 0x08;
  aDataArray[3] = xsend / 256;
  aDataArray[4] = xsend % 256;
  aDataArray[5] = ysend / 256;
  aDataArray[6] = ysend % 256;
  aDataArray[7] = cutXCaibian2 / 256;
  aDataArray[8] = cutXCaibian2 % 256;
  aDataArray[9] = cutYCaibian2 / 256;
  aDataArray[10] = cutYCaibian2 % 256;

  ws.send(aDataArray.buffer);
}

function sendMsgShowImageSettingWindow() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0b;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgShowImageSettingWindowB() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x45;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}


function sendMsgZoom(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0d;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetCutType(type) {
  canvasX = 0;
  canvasY = 0;
  CutType = type;
  var aDataArray = new Uint8Array(4);

  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0e;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);

}

function sendMsgSetJiubianModel(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x10;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);

}

function sendMsgGetCamNum() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x16;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);

}

function sendMsgGetResolution(camid) {
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x18;
  aDataArray[2] = 0x02;
  aDataArray[3] = 0x00;
  aDataArray[4] = camid;
  ws.send(aDataArray.buffer);
}

function sendMsgGetResolutionSecond(camid) {
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x18;
  aDataArray[2] = 0x02;
  aDataArray[3] = 0x01;
  aDataArray[4] = camid;
  ws.send(aDataArray.buffer);
}

function sednMsgSavePDF(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x11;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sednMsgAddPDF(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x12;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sednMsgWaterMarkOpen(pathUnicode, fontSize, fontStyleIndex, r, g, b, xoffset, yoffset) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;

  var aDataArray = new Uint8Array(11 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1a;
  aDataArray[2] = 8 + len;
  aDataArray[3] = fontSize;
  aDataArray[4] = fontStyleIndex;
  aDataArray[5] = r;
  aDataArray[6] = g;
  aDataArray[7] = b;
  aDataArray[8] = xoffset;
  aDataArray[9] = yoffset;
  aDataArray[10] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[11 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sednMsgWaterMarkClose() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1b;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sednMsgBubaiType(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2c;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sednMsgQuqudiseType(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x34;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgCombineTwoImage(path1Unicode, path2Unicode, path3Unicode, type) {
  var path1 = encodeURI(path1Unicode);
  var pathdata1 = stringToByte(path1);
  var len1 = path1.length;

  var path2 = encodeURI(path2Unicode);
  var pathdata2 = stringToByte(path2);
  var len2 = path2.length;

  var path3 = encodeURI(path3Unicode);
  var pathdata3 = stringToByte(path3);
  var len3 = path3.length;

  var aDataArray = new Uint8Array(7 + len1 + len2 + len3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x13;
  aDataArray[2] = len1 + len2 + len3 + 4;
  aDataArray[3] = type;
  aDataArray[4] = len1;
  for (var i = 0; i < len1; i++) {
    aDataArray[5 + i] = pathdata1[i];
  }
  aDataArray[5 + len1] = len2;
  for (var i = 0; i < len2; i++) {
    aDataArray[6 + len1 + i] = pathdata2[i];
  }

  aDataArray[6 + len1 + len2] = len3;
  for (var i = 0; i < len3; i++) {
    aDataArray[7 + len1 + len2 + i] = pathdata3[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetAutoExposure(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2d;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgGetExposureRange() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x31;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgGetBrightnessRange() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2e;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetBrightness(temp) {
  var type;
  if (temp < 0) {
    type = 0;
  } else {
    type = 1;
  }
  temp = Math.abs(temp);
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2f;
  aDataArray[2] = 0x02;
  aDataArray[3] = type;
  aDataArray[4] = temp;
  ws.send(aDataArray.buffer);
}

function sendMsgSetExposure(temp) {
  var type;
  if (temp < 0) {
    type = 0;
  } else {
    type = 1;
  }
  temp = Math.abs(temp);
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x33;
  aDataArray[2] = 0x02;
  aDataArray[3] = type;
  aDataArray[4] = temp;
  ws.send(aDataArray.buffer);
}

function sednMsgGetBase64(filename) {
  var path = encodeURI(filename);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x35;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgDeleteFile(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x38;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgQrcode(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x39;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgBarcode(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x44;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgGetMainCameraID() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3a;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgStartIDCard() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3c;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgGetOneIC() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3c;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgGetICValues(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3d;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgRotateL() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x40;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0;
  ws.send(aDataArray.buffer);
}

function sendMsgRotateR() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x40;
  aDataArray[2] = 0x01;
  aDataArray[3] = 1;
  ws.send(aDataArray.buffer);
}

function sendMsgBestSize() {
  canvasX = 0;
  canvasY = 0;
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0d;
  aDataArray[2] = 0x01;
  aDataArray[3] = 2;
  ws.send(aDataArray.buffer);
}

// function sendMsgTrueSize() {
//   canvasX = 0;
//   canvasY = 0;
//   var aDataArray = new Uint8Array(4);
//   aDataArray[0] = 0xef;
//   aDataArray[1] = 0x0d;
//   aDataArray[2] = 0x01;
//   aDataArray[3] = 3;
//   ws.send(aDataArray.buffer);
// }


function sendMsgWorkIDCard() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x41;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgStopWorkIDCard() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x41;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgShotBase64(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x42;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetJpgQuanlity(value) {
  var aDataArray2 = new Uint8Array(4);
  aDataArray2[0] = 0xef;
  aDataArray2[1] = 0x49;
  aDataArray2[2] = 0x01;
  aDataArray2[3] = value;
  ws.send(aDataArray2.buffer);
}

function sendMsgGetICPictureAll() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x4d;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgInitFinger() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x4f;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgStartFinger() {

  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x50;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgCloseFinger() {

  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x50;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x00;
  ws.send(aDataArray.buffer);
}



function SetCusCropPlaceWs(cutX, cutY, cutW, cutH) {

  var bpp = rec_ww / imgOrignalW;
  if (rorateAngleType == 1 || rorateAngleType == 3) {
    bpp = rec_ww / imgOrignalH;
  }
  recX_manual = cutX * bpp + (canvas.width / 2 - rec_ww / 2);
  recY_manual = cutY * bpp + (canvas.height / 2 - rec_hh / 2);
  recW_manual = cutW * bpp;
  recH_manual = cutH * bpp;
  cutXCaibian = cutW;
  cutYCaibian = cutH;


}

function SetCusCropPlaceWs2(cutX, cutY, cutW, cutH) {

  var bpp = rec_ww2 / imgOrignalW2;
  recX_manual2 = cutX * bpp + (canvasSecond.width / 2 - rec_ww2 / 2);
  recY_manual2 = cutY * bpp + (canvasSecond.height / 2 - rec_hh2 / 2);
  recW_manual2 = cutW * bpp;
  recH_manual2 = cutH * bpp;
  cutXCaibian2 = cutW;
  cutYCaibian2 = cutH;


}



//手动裁边时的长方形
function refreshRect() {
  context.beginPath();
  context.rect(recX_manual, recY_manual, recW_manual, recH_manual);
  context.lineWidth = 2;
  context.strokeStyle = "#0000ff";
  context.stroke();
}

function refreshRect2() {
  contextSecond.beginPath();
  contextSecond.rect(recX_manual2, recY_manual2, recW_manual2, recH_manual2);
  contextSecond.lineWidth = 2;
  contextSecond.strokeStyle = "#0000ff";
  contextSecond.stroke();
}

function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  return bytes;
}

function byteToString(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

function base64Encode(input) {
  var rv;
  rv = encodeURIComponent(input);
  rv = unescape(rv);
  rv = window.btoa(rv);
  return rv;
}

function isIE() { //ie?
  if (!!window.ActiveXObject || "ActiveXObject" in window)
    return true;
  else
    return false;
}