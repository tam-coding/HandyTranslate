const fileToBuffer=function(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function(e) {
      reject(e);
    };
    reader.readAsArrayBuffer(file);
  })  
}

export default fileToBuffer;