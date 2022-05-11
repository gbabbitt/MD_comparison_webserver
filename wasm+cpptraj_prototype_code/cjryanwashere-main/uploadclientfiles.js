//This code has been updated 
const importObject = {
  module: {},
  env: {
    memory: new WebAssembly.Memory({ initial: 256 }),
  }
};
fetch('main.wasm').then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObject)
).then(results => {
  const Sum = results.instance.exports.Sum;
  console.log(Sum(2,3));
  console.log(Sum(1000, 23));
});




function gatherTrajFile(evt) {
    var files = evt.target.files[0]; // FileList object


    

    var reader = new FileReader();
    reader.onload = function(event) {
        console.log(event.target.result);
        console.log(reader.result)
        
    }
    reader.readAsBinaryString(files);
    //reader.readAsText(files);
    
    
    
  }


function gatherTopFile(evt) {
    var files = evt.target.files[0]; // FileList object

    var reader = new FileReader();
    reader.onload = function(event) {
        console.log(event.target.result);
    }
    reader.readAsText(files);
    
  }

document.getElementById('trajfiles').addEventListener('change', gatherTrajFile, false);
document.getElementById('topfiles').addEventListener('change', gatherTopFile, false);

// using JP's Sample.wasm to add two numbers 


