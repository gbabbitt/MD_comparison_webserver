#!/usr/bin/perl


#print "Enter PDB file name \n\n";
 # $pdb = <STDIN>; 
 # chop($pdb);

$pdb = "1cdw_boundREDUCED.pdb";

open INFILE, "<"."$pdb" or die "could not open infile";
open OUTFILE, ">"."JSMOLmapping_$pdb.txt" or die "could not open outfile";
open OUTFILE2, ">"."KL.dat" or die "could not open outfile";
open OUTFILE3, ">"."P.dat" or die "could not open outfile";
open INFILE2, "<"."DROIDSfluctuationAVGchain.txt" or die "could not open infile";
open INFILE3, "<"."adjustKStests.txt" or die "could not open infile";

@IN = <INFILE>;
@IN2 = <INFILE2>;
@IN3 = <INFILE3>;

for (my $i = 0; $i < scalar @IN2; $i++){
  
  $inrow2 = @IN2[$i];
  @inrow2 = split (/\s+/, $inrow2);
  $res_pos1 = @inrow2[0];
  $res_type1 = @inrow2[1];
  $KL = @inrow2[7];
  $chainID = @inrow2[8];
  $p_value = "na";
  # sweep for pvalue
  for (my $ii = 0; $ii < scalar @IN3; $ii++){
    $inrow3 = @IN3[$ii];
    @inrow3 = split (/\s+/, $inrow3);
    $res_pos2 = @inrow3[0];
    $res_type2 = @inrow3[1];
    $pval = @inrow3[4];
    if($res_pos1 == $res_pos2){$p_value = $pval;}
    }
  #sweep for individual atoms
  for (my $j = 0; $j < scalar @IN; $j++){
    $inrow = @IN[$j];
    @inrow = split (/\s+/, $inrow);
    $atom_pos = @inrow[1];
    $res_type = @inrow[3];
    $chain = @inrow[4];
    $res_pos = @inrow[5];
    #$KLalt = $KL+rand(1)*$KL;
    if($chain eq "A" && $res_pos == $res_pos1){print "$atom_pos\t"."$res_pos1\t"."$res_type1\t"."$KL\t"."$p_value\t"."$chainID\n";}
    if($chain eq "A" && $res_pos == $res_pos1){print OUTFILE "$atom_pos\t"."$res_pos1\t"."$res_type1\t"."$KL\t"."$p_value\t"."$chainID\n";}
    if($chain eq "A" && $res_pos == $res_pos1){print OUTFILE2 "$KL\n";}
    if($chain eq "A" && $res_pos == $res_pos1){print OUTFILE3 "$p_value\n";}
  }
}
 print OUTFILE2 "\n";
 print OUTFILE3 "\n"; 
close INFILE;
close INFILE2;
close INFILE3;
close OUTFILE;
close OUTFILE2;
close OUTFILE3;

print "END PROCESSING\n";
exit;






