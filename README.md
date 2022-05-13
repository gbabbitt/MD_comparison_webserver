DROIDS comparative protein dynamics webserver prototype

-----------------------------------------------------------------------------------

NOTE: upon download go inside jsmol folder and unzip the following files
jsme.zip
j2s.zip

instructions for running this page on your local server goes as follows

#####################################################################################

WELCOME to our summer 2022 webserver project

to test on localserver

http://127.0.0.1
or
http://localhost

after installing local apache server via LAMP or XAMPP stack
instructions for installing LAMP or XXAMP stack is found here
https://www.alphr.com/set-up-local-web-server/

######################################################################################

for Linux Mint simply install LAMP server with the following terminal command

$ sudo apt-get install apache2

NOTE: This webserver will eventually run on our Linux server, so it is simpler to develop and test it on a Linux Mint laptop. If you have an older unused laptop lying around, you should convert its OS to Linux Mint and use it as a machine for code development. You might also try VirtualBox Virtual Machine (VM) with Linux image (IF YOU DONT HAVE ACCESS TO A LINUX OS ANY OTHER WAY), however I find that it can be very difficult to get client-side graphics to appear/function properly over the scaled graphics on a VM desktop.  If you do use Windows or Mac for the project, we recommend setting up a XAMPP server instead of a Linux LAMP server.

Instructions for XAMPP server setup
https://www.apachefriends.org/index.html


Instructions for a new 'bare metal' Linux install
https://www.linuxmint.com/


Instructions for VM install (Linux running over existing operating systems)
install Oracle VirtualBox and follow its instructions to build your VM using a Linux Mint .vdi file from osboxes.org
https://www.virtualbox.org/
and
https://www.osboxes.org/

the user and password will both be osboxes.org

###################################################################

After setting up local server on Linux: 

Download, unzip and put all the files from this GitHub project repo in your Linux file system at /var/www/html/ 

NOTE: upon download go inside jsmol folder and unzip the following files
jsme.zip
j2s.zip

You may need to open permissions to copy files there by using this terminal command

$ sudo chmod -R 777 /var/www/html/

When everything is in place, you open your chrome/firefox browser to the address

https://127.0.0.1

and this will show a functional version of index.html  
If you simply open index.html directly in the browser not all of the supporting code will work (i.e. JSmol viewers will not function)

The plots in this site are using ploty.js running on d3.js  (more information found below)

https://plotly.com/javascript/

Our divergence plots are modified candlestick plots from ploty.js library

#######################################################################

After setting up a local server on Win/Mac using XAMPP

Open the XAMPP Control panel and start the apache server (check for any error messages on startup at this panel)

Download, unzip and put all the files from this GitHub project repo in your Windows file system at /XAMPP/htdocs/ 

NOTE: upon download go inside jsmol folder and unzip the following files
jsme.zip
j2s.zip

to see your XAMPP startup page (to check proper XAMPP install)

https://127.0.0.1

to see your project

https://127.0.0.1/index.html

or

https://localhost/index.html


#######################################################################

The three 'example' buttons should be workng and open results using plotly and JSmol, but at this stage all the left hand side of the page is not yet built. 

We need the following tasks completed.

1. For those who have access to Amber20 molecular dynamics, we need to generate two long .nc files to compare.
2. We need to explore and test the WASM and CPPTRAJ prototype code for resampling atom fluctuation on the input files
3. We need python/R/julia script to compute site-wise KL divergence and multiple test-corrected two sample KS tests.  Julia is probably the fastest and best for our purpose.  See JS divergence function here https://github.com/JuliaStats/Distances.jl
4. We need to plug this into the client-side buttons and write a backend to then display results in place of the 3 examples
5. We need need to optimize for speed.
6. maybe build some interactive ChimeraX features for enabling user to custom and save molecular viewing images and movies beyond JSmol settings
7. We need to do a bit more work on client-side aesthetics and design.
8. Eventually, we'll add additional webserver pages for the machine learning analyses of functionally conserved dynamics and functionally coordinated dynamics.  The theory for this is outlined in the file Gaussian_process_kernel_learning.docx
9. Work on any modifications to our MD simulation GUI pipelines that users can implement for generating trajectory (.nc) files to submit to this webserver.  It will be important to build a Windows based openMM (python) version to allow more potential users to find us. https://openmm.org/

Our existing GUI is here

https://gbabbitt.github.io/amberMDgui/

https://github.com/gbabbitt/amberMDgui

######################################################################

Thank you ....Dr B


