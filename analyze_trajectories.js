
var raw_data = null;
var num_atoms = null;
var topFileString = null;
var atomicMasses = null;
var isTrajIn = false;
var isTopIn  = false;


//something that will determine whether or not to group the calculations by residue
var byResidue = true



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

function fluctByRes(fluctSlice, massSlice) {
    var n = 0;
    for (let i = 0; i<fluctSlice.length; i++) {
        n += fluctSlice[i] * massSlice[i];
    }
    var d = 0;
    for (let i = 0; i<fluctSlice.length; i++) {
        d += massSlice[i];
    }
    return n / d;

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
        topFileString = data
        data = data.split('\n');
        
        
        data = data[6].split(" ");
        num_atoms = parseInt(data[5]);
        console.log("number of atoms: ", num_atoms);


        //both a topology (.prmtop) and trajectory (.nc) file is needed for the file to be read
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


    }
    reader.readAsText(file)
}
function addVec(vec1,vec2) {return vec1.map(function(v, i) {return v + vec2[i];})}


function analyze(rowdata) {
    
    //organize it all
    timesteps = (rowdata.length / 3.0) / num_atoms
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


    //this gets the residue data from the .prmtop file
    if (byResidue) {

        var parseData = topFileString.split('\n');
        parseData = parseData[7].split(" ")
        parseData = parseData.filter(item => !(item==""))
        
        const num_residues = parseInt(parseData[1])


        //parsing the residue pointer data
        var residuePointers = topFileString.split("%FLAG RESIDUE_POINTER")
        residuePointers = residuePointers[1].split("%FLAG BOND_FORCE_CONSTANT")[0].split('\n')
        residuePointers = residuePointers.slice(2)
        var resPointerTemp = ""
        for (let i=0;i<residuePointers.length;i++) {resPointerTemp += residuePointers[i];}
        residuePointers = resPointerTemp.split(" ")
        residuePointers = residuePointers.filter(item => !(item==""))
        console.log(residuePointers);


        //this gets the atomic mass data for each atom
        var massParser = topFileString.split("%FLAG MASS")[1]
        massParser = massParser.split('%FLAG ATOM_TYPE_INDEX')[0]
        massParser = massParser.split("\n").slice(2)
        massParseString = ""
        for (let i=0;i<massParser.length;i++) {massParseString += massParser[i];}
        massParser = massParseString.split(" ").filter(item => !(item==""))
        massParser = massParser.map(function(v, i) {
            return parseFloat(v)
          })
        console.log(massParser)
        atomicMasses = massParser

        
    }

    
 
    //calculate the atomic fluct value (rmsf) for each atom
    console.log("calculating atomicfluct...");
    var fluct = [];
    for (let i=0;i<num_atoms;i++) {
        fluct.push(atomic_fluct(single_atom(i,xyz_timestepdata)));
    }
    

    /*
    console.log("calculating atomiccorr...");
    var corr = [];
    for (let i=0;i<num_atoms;i++) {
        var atom_corr = [];
        for (let j=0;j<num_atoms;j++) {
            atom_corr.push(atomic_corr(single_atom(i,xyz_timestepdata), single_atom(j, xyz_timestepdata)));
        }
        corr.push(atom_corr);
    }
    //corr shape is [num_atoms, num_atoms]
    */
    
    console.log("calculating atomicfluct by residue...");
    if (byResidue) {
        fluctByResidue = [];

        //for each atom, group the fluct values together, and calculate the 'by residue' fluct
        for (let i=0; i<residuePointers.length; i++) {
            let start = parseInt(residuePointers[i])-1;
            var end;
            if (i==residuePointers.length-1) {
                end = num_atoms;
            } else {
                end = parseInt(residuePointers[i+1])-1;
            }

            let fbr = fluctByRes(fluct.slice(start, end), atomicMasses.slice(start, end))            
            fluctByResidue.push(fbr);
        }
        console.log("atomicfluct by residue: [" + fluctByResidue + "]");
    }
   
   
}


//connects to the web page
console.log('analyze trajectories script running...')
document.getElementById("inputsubmit1").addEventListener('change', trajin, false);
document.getElementById("inputsubmit1_topology").addEventListener('change',topin, false);


