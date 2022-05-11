Jmol._isAsync = false;
Jmol.setDocument(0);
const Info = {
  width: "100%",
  height: "100%",
  use: "HTML5",
  j2sPath: "https://chemapps.stolaf.edu/jmol/jsmol/j2s/",
  script: "set antialiasDisplay; set zoomHeight true;",
  serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
  disableJ2SLoadMonitor: true,
  disableInitialConsole: true
};

Jmol.getApplet("jmolview1", Info);
Jmol.getApplet("jmolview2", Info);

Jmol.script(jmolview1, "load https://files.rcsb.org/ligands/view/CH4_model.sdf");
Jmol.script(jmolview2, "load http://files.rcsb.org/ligands/view/HOH_model.sdf");

$("#view1").html(Jmol.getAppletHtml(jmolview1));
$("#view2").html(Jmol.getAppletHtml(jmolview2));