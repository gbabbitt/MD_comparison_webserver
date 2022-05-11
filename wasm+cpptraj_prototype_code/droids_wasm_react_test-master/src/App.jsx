import React from 'react';
import Sample from '../Sample.js';
import SampleWASM from '../Sample.wasm'

const App = () => {

    const sample = Sample({
        locateFile: () => {
            return SampleWASM;
        }
    }) 

    sample.then((core) => {
        console.log(core.add(1, 2))
    })

    return (
        <div>
            <h1>Using WebAssembly with React</h1>
        </div>
    )
}

export default App;
