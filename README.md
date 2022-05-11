DROIDS comparative protein dynamics webserver prototype

NOTE: upon download go inside jsmol folder and unzip the following files
jsme.zip
j2s.zip

instructions for running this page on your local server goes as follows

test on localserver

http://127.0.0.1
or
http://localhost

after installing local apache server via LAMP or XAMPP stack
instructions for installing LAMP or XXAMP stack is found here
https://www.alphr.com/set-up-local-web-server/

for Linux Mint simply install with the following terminal command

$ sudo apt-get install apache2

NOTE: This webserver will eventuall run on our Linux server, so it is simpler to develop and test it on a VirtualBox VM with Linux image (IF YOU DONT HAVE ACCESS TO A LINUX OS)

install Oracle VirtualBox and follow its instructions to build your VM using a Linux Mint .vdi file from osboxes.org
https://www.virtualbox.org/
and
https://www.osboxes.org/

the user and password will both be osboxes.org

Put all the files from this repo in your Linux file system at /var/www/html/

You may need to open permissions to copy files there by using this terminal command
$ sudo chmod -R 777 /var/www/html/

When everything is in place, you open your chrome/firefox browser to the address
127.0.0.1
and this will show a functional version of index.html  
If you simply open index.html directly in the browser not all of the supporting code will work (i.e. JSmol viewers will not function)

The plots in this site are using ploty.js running on d3.js  (more information found below)

https://plotly.com/javascript/

Our diveregnce plots are modified candlestick plots from ploty.js library

The three 'example' buttons should be workng and open results using plotly and JSmol, but at this stage all the left hand side of the page is not yet built. 


