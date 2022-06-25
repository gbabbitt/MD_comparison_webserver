
const timesteps = 200;
var raw_data = null;
var num_atoms = null;
var isTrajIn = false;
var isTopIn  = false;



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





/*
dealing with opening files and client stuff, all the calculations are above this
*/ 

function topin(evt) {
    console.log('loading topology file...');
    file = evt.target.files[0]

    var reader = new FileReader()
    reader.onload = function(event){
        var data = event.target.result;
        data = String(data);
        data = data.split('\n');
        
        
        data = data[6].split(" ");
        num_atoms = parseInt(data[5]);
        console.log("number of atoms: ", num_atoms);

        isTopIn = true;
        if (isTrajIn){
            analyze(raw_data);
        } else {
            document.getElementById("analysis_box").innerHTML = "please upload a trajectory file";
        }


    }
    reader.readAsText(file);
}


function trajin(evt) {
    console.log('loading trajectory file...')
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

        raw_data = rowdata;

        isTrajIn = true;
        if (isTopIn) {
            analyze(raw_data) 
        } else {
            document.getElementById("analysis_box").innerHTML = "please upload a topology file";
        }

        /*
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


        console.log("here is a brief test of the functions in js:")
        console.log("atomic fluctuation for  atom 0:    ",atomic_fluct(single_atom(0,xyz_timestepdata)));
        console.log("atomic correlation for atoms 0<->1:",atomic_corr(single_atom(0,xyz_timestepdata), single_atom(1,xyz_timestepdata)))
        
        


        
        */

    }
    reader.readAsText(file)
}



function analyze(rowdata) {
    
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


    //xyz_timestepdata shape: [timesteps, atoms, 3]}

    

    //sorry if this stuff is a mess, it just does all the calculations, and then prints some of them out on the screen

    var display_output = "calculating atomicfluct for each atom... \n";
    document.getElementById("analysis_box").innerHTML = display_output
    var fluct = [];
    for (let i=0;i<num_atoms;i++) {
        fluct.push(atomic_fluct(single_atom(i,xyz_timestepdata)));
    }
    display_output += "done... here is the atomicfluct for the first 20 atoms: \n";
    for (let i=0;i<20;i++){
        display_output += fluct[i]+"    ";
    }
    document.getElementById("analysis_box").innerHTML = display_output;
    display_output += "calculating atomiccorr for each atom... \n";
    var corr = [];
    for (let i=0;i<num_atoms;i++) {
        var atom_corr = [];
        for (let j=0;j<num_atoms;j++) {
            atom_corr.push(atomic_corr(single_atom(i,xyz_timestepdata), single_atom(j, xyz_timestepdata)));
        }
        corr.push(atom_corr);
    }
    //corr shape is [num_atoms, num_atoms]
    display_output += "done... here are the correlations between the first atom, and the 20 nearest to it: \n";
    for(let i=0;i<20;i++) {
        display_output+=corr[0][i]+"    ";
    }
    document.getElementById("analysis_box").innerHTML = display_output;
        

}


//connects to the web page
console.log('analyze trajectories script running...')
document.getElementById("inputsubmit1").addEventListener('change', trajin, false);
document.getElementById("inputsubmit1_topology").addEventListener('change',topin, false);


