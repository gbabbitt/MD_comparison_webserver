// this loads and processes trajectory data. I do not know how to find the number of timesteps and number of atoms  from the file, so I will make it 
// work here because I already know that the number of timesteps is 200, and that the number of atoms is 304
const timesteps = 200;
const num_atoms = 304;



function atomic_fluct(traj_array) {

    /*
        This calculates the root mean square fluctuation of a single atom, given an array of the shape: (number of timesteps,3)

        (each element of the array represents a timestep, and )
    */ 

    fluct = 0


    //the following code simple calculates the average x, y, and z coordinates of the atom

    ref_x = 0.0
    ref_y = 0.0
    ref_z = 0.0

    for (i=0;i<traj_array.length; i++){

        

        ref_x += traj_array[i][0]
        ref_y += traj_array[i][1]
        ref_z += traj_array[i][2]
    }



    ref_x = ref_x/traj_array.length
    ref_y = ref_y/traj_array.length
    ref_z = ref_z/traj_array.length

   


    sum = 0 
    for (i=0;i<traj_array.length; i++) {
        //for each timestep, calculate the difference and square it 
        dif_x = traj_array[i][0]-ref_x
        dif_y = traj_array[i][1]-ref_y
        dif_z = traj_array[i][2]-ref_z

        dif_x = Math.pow(dif_x, 2)
        dif_y = Math.pow(dif_y, 2)
        dif_z = Math.pow(dif_z, 2)

        //it gets added to the summation        
        sum+=(dif_x+dif_y+dif_z);
    }


    //divide by the number of timesteps, so fluct is the average square deviation from the mean
    fluct = sum/traj_array.length
    //take the square root
    fluct = Math.pow(fluct, 1/2)

    return fluct
}

function ArraySum(array) {
    sum=0;
    for(let i=0;i<array.length;i++) {
        sum+=array[i];
    }
    return sum;
}


function atomic_corr(a_arr, b_arr) {

    //for a and b, calculate motion vectors for each timestep

    a_dif = Array()
    for (let i=0;i<a_arr.length;i++) {
        if (i!=0) {
            a_dif.push([a_arr[i][0]-a_arr[i-1][0], a_arr[i][1]-a_arr[i-1][1], a_arr[i][2]-a_arr[i-1][2]])
        }
    }
    b_dif = Array()
    for (let i=0;i<b_arr.length;i++) {
        if (i!=0) {
            b_dif.push([b_arr[i][0]-b_arr[i-1][0], b_arr[i][1]-b_arr[i-1][1], b_arr[i][2]-b_arr[i-1][2]])
        }
    }

    sum=[]
    for (let i=0;i<a_dif.length;i++) {
        
        a_mag = Math.pow((Math.pow(a_dif[i][0],2)+Math.pow(a_dif[i][1],2)+Math.pow(a_dif[i][2],2)),1/2)
        b_mag = Math.pow((Math.pow(b_dif[i][0],2)+Math.pow(b_dif[i][1],2)+Math.pow(b_dif[i][2],2)),1/2)

        dot = a_dif[i][0]*b_dif[i][0]+a_dif[i][1]*b_dif[i][1]+a_dif[i][2]*b_dif[i][2];
        result = dot/(a_mag*b_mag)
        sum.push(result)
    }

    return (ArraySum(sum)/a_dif.length)
}

function single_atom(index, array) {

    //takes an array of shape (timesteps, atoms, xyz) and an index of a specific atom, and returns an array of (timesteps,xyz)

    focus = []

    array.forEach(function(e) {
        focus.push(e[index])
    });

    return focus;
}


function trajin(evt) {
    //console.log('loading file')
    file = evt.target.files[0]

    var reader = new FileReader()
    reader.onload = function(event) {

        // basically just turning the whole file into a string and then converting it to floats so that it can be used
        // this is flawed for several reasons, but I am not sure how much less efficent it is, as from what I know
        // netcdf files work similarly to text files. 

        //console.log('file reader function')
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

        console.log(atomic_fluct(single_atom(0,xyz_timestepdata)));
        console.log(atomic_corr(single_atom(0,xyz_timestepdata), single_atom(1,xyz_timestepdata)))
        


    }
    reader.readAsText(file)
}

document.getElementById('trajfiles').addEventListener('change', trajin, false);