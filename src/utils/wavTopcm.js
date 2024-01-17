import 'recorder-core/src/engine/pcm'
const Wav2Other=function(newSet,wavBlob,True,False){
	var reader=new FileReader();
	reader.onloadend=function(){
		//检测wav文件头
		var wavView=new Uint8Array(reader.result);
		var eq=function(p,s){
			for(var i=0;i<s.length;i++){
				if(wavView[p+i]!=s.charCodeAt(i)){
					return false;
				};
			};
			return true;
		};
		var pcm;
		if(eq(0,"RIFF")&&eq(8,"WAVEfmt ")){
			var numCh=wavView[22];
			if(wavView[20]==1 && (numCh==1||numCh==2)){//raw pcm 单或双声道
				var sampleRate=wavView[24]+(wavView[25]<<8)+(wavView[26]<<16)+(wavView[27]<<24);
				var bitRate=wavView[34]+(wavView[35]<<8);
				//搜索data块的位置
				var dataPos=0; // 44 或有更多块
				for(var i=12,iL=wavView.length-8;i<iL;){
					if(wavView[i]==100&&wavView[i+1]==97&&wavView[i+2]==116&&wavView[i+3]==97){//eq(i,"data")
						dataPos=i+8;break;
					}
					i+=4;
					i+=4+wavView[i]+(wavView[i+1]<<8)+(wavView[i+2]<<16)+(wavView[i+3]<<24);
				}
				console.log("wav info",sampleRate,bitRate,numCh,dataPos);
				if(dataPos){
					if(bitRate==16){
						pcm=new Int16Array(wavView.buffer.slice(dataPos));
					}else if(bitRate==8){
						pcm=new Int16Array(wavView.length-dataPos);
						//8位转成16位
						for(var j=dataPos,d=0;j<wavView.length;j++,d++){
							var b=wavView[j];
							pcm[d]=(b-128)<<8;
						};
					};
				};
				if(pcm && numCh==2){//双声道简单转单声道
					var pcm1=new Int16Array(pcm.length/2);
					for(var i=0;i<pcm1.length;i++){
						pcm1[i]=(pcm[i*2]+pcm[i*2+1])/2;
					}
					pcm=pcm1;
				};
			};
		};
		if(!pcm){
			False&&False("非单或双声道wav raw pcm格式音频，无法转码");
			return;
		};
		
		var rec=Recorder(newSet).mock(pcm,sampleRate);
		rec.stop(function(blob,duration){
			True(blob,duration,rec);
		},False);
	};
	reader.readAsArrayBuffer(wavBlob);
};
export default Wav2Other