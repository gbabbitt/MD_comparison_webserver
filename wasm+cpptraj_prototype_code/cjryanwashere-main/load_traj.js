// this loads and processes trajectory data. I do not know how to find the number of timesteps and number of atoms  from the file, so I will make it 
// work here because I already know that the number of timesteps is 200, and that the number of atoms is 304
const timesteps = 200;
const num_atoms = 304;


//calcute root mean square fluctuation
function atomic_fluct(traj_array) {
    fluct = 0

    ref_x = 0
    ref_y = 0
    ref_z = 0

    for (i=0;i<traj_array.length-1; i++){
        ref_x += traj_array[i][0]
        ref_y += traj_array[i][1]
        ref_z += traj_array[i][2]
    }

    ref_x = ref_x/traj_array.length
    ref_y = ref_y/traj_array.length
    ref_z = ref_z/traj_array.length

    console.log(ref_x,ref_y,ref_z)

    sum = 0 
    for (i=0;i<traj_array.length-1; i++) {
        dif_x = traj_array[i][0]-ref_x
        dif_y = traj_array[i][1]-ref_y
        dif_z = traj_array[i][2]-ref_z

        dif_x = Math.pow(dif_x, 2)
        dif_y = Math.pow(dif_y, 2)
        dif_z = Math.pow(dif_z, 2)

        partial_sum = dif_x+dif_y+dif_z
        sum+=partial_sum
    }

    fluct = sum/traj_array.length
    fluct = Math.pow(fluct, 1/2)

    return fluct
}

function single_atom(index, array) {
    focus = []

    array.forEach(function(e) {
        focus.push(e[index])
    });

    return focus;
}


function trajin(evt) {
    console.log('loading file')
    file = evt.target.files[0]

    var reader = new FileReader()
    reader.onload = function(event) {

        // basically just turning the whole file into a string and then converting it to floats so that it can be used
        // this is flawed for several reasons, but I am not sure how much less efficent it is, as from what I know
        // netcdf files work similarly to text files. 

        console.log('file reader function')
        var data = event.target.result
        data = String(data)
        data = data.split("\n ")
        rowdata = []
        data.forEach(function (e) {
            row = e.split(" ")
            row.forEach(function(k){
                if (k!="") {
                    if (/\d/.test(k)){
                        rowdata.push(parseFloat(k))
                    }
                }
            });
        });

        

        timestepdata = []
        for  (i=0; i<timesteps; i++) {
            timestepdata.push(rowdata.slice(i*num_atoms*3, (i+1)*num_atoms*3))
        }

        xyz_timestepdata = []
        timestepdata.forEach(function(e) {
            step = []
            for (i=0;i<num_atoms;i++) {
                step.push(e.slice(i*3,(i+1)*3))
            }
            xyz_timestepdata.push(step)
        });


        //shape [timesteps, atoms, 3]

        console.log(single_atom(0,xyz_timestepdata))
        console.log(atomic_fluct(single_atom(0,xyz_timestepdata)));
        


    }
    reader.readAsText(file)
}

document.getElementById('trajfiles').addEventListener('change', trajin, false);