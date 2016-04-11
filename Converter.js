function stringToByteArray(str) {//utf8 string to byte array
	var byteArray = [];
	for (var i = 0; i < str.length; i++){
		if (str.charCodeAt(i) <= 0x7F){
			byteArray.push(str.charCodeAt(i));
		}else {
			try{
				var h = encodeURIComponent(str.charAt(i)).split('%');
				for (var j = 0; j < h.length; j++){
					if(h[j]!=="")byteArray.push(parseInt(h[j], 16));
				}			
			}catch(e){
				console.log(str.charAt(i)+"==="+str.charCodeAt(i).toString(16));
				encodeURIComponent(str.charAt(i)).split('%');
			}			
		}
	}
	return byteArray;
};
function byteArrayToString(byteArray) {
	//console.log("byteArray="+byteArray);
	var str = '',arr=[];
	for (var i = 0; i < byteArray.length; i++){
		var charCode = byteArray[i]; 
		try{
			//console.log(charCode.toString().toUpperCase()+", 0x"+charCode.toString(16).toUpperCase());
			if (charCode==33 || charCode==39 || charCode==45 || charCode==48 || charCode==65 || charCode==95 || charCode==97 || charCode==126) {
					str+=decodeURIComponent("%"+charCode.toString(16).toUpperCase());
			}else if (charCode < 0x10) {//一位
				var u="%0"+byteArray[i].toString(16).toUpperCase();
				str+=decodeURIComponent(u);
			}else if (charCode < 0xc2) {//一位
				var u="%"+byteArray[i].toString(16).toUpperCase();
				str+=decodeURIComponent(u);
			}else if ((0xc2 <= charCode) && (charCode < 0xe0)) { //2位
				var u="%"+byteArray[i].toString(16).toUpperCase()+"%"+byteArray[i+1].toString(16).toUpperCase();
				str+=decodeURIComponent(u);
				i++;
			} else if ((0xe0 <= charCode) && (charCode < 0xff)) { //3位
				str+=decodeURIComponent("%"+byteArray[i].toString(16).toUpperCase()+"%"+byteArray[i+1].toString(16).toUpperCase()+"%"+byteArray[i+2].toString(16).toUpperCase());
				i+=2;
			}else{
				console.log("error "+i);
			}
		}catch(e){
			console.log("error:"+charCode.toString().toUpperCase()+", 0x"+charCode.toString(16).toUpperCase());
		}
		//console.log("str="+str);
	}
		
	return str;//decodeURIComponent(str);
};



function bytesToCanvas(byteArray,w,h){
	var lenstr=byteArray.length.toString(36);
	if(!w){
		h=w=Math.ceil(Math.sqrt((byteArray.length+lenstr.length+2)/3));
	}else{
		h=h|1;
		h=Math.ceil(Math.max((byteArray.length+lenstr.length+1)/3/w,h));
	}	
	console.log("lenstr="+byteArray.length+"["+lenstr+"],w="+w+",h="+h);
	var canvas = document.createElement('canvas');
	
	canvas.width=w;
	canvas.height=h;
	var ctx = canvas.getContext('2d');
	var imageData=ctx.getImageData(0,0,w,h);
	
	var data=[];
	for(var i=0;i<lenstr.length;i++){
		data.push(parseInt(lenstr.charAt(i),36)&0xff);
	}	
	data.push(0xff);
	byteArray=data.concat(byteArray);
	
	for(var i=0;i<imageData.data.length;i++){
		var offset=i-Math.floor(i/4);	
		if(i>0 && (i+1)%4==0){
			imageData.data[i]=0xff;//alpha=255
		}else if(offset>=byteArray.length){
			imageData.data[i]=0xff;//white background
		}else{
			imageData.data[i]=byteArray[offset]&0xff;
		}
	}	
	ctx.putImageData(imageData,0,0);
	var imageData2=ctx.getImageData(0,0,w,h);
	return canvas;
}
