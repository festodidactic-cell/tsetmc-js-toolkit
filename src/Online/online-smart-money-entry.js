true==function(){

var
realBuy=(qd1),
realSell=(qmo1),
power=(realBuy/(realSell+1)),
volumeRatio=(qtc/(bvol+1));


if(
realBuy>realSell &&
power>1.7 &&
volumeRatio>0.8 &&
(pl)>0
)

return true;


return false;

}()
