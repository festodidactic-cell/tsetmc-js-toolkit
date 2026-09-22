true==function(){

var
pClosing=(ct).PriceYesterday,
pToday=(pl).Price,
volToday=(qd1),
buyPower=((qd1)/(zo1+1)),
range=((pl)-(pf));



if(
(pl)>0 &&
(ct).Buy_CountI>0 &&
(qd1)>((bvol)/(bcnt+1)) &&
(pl)>((pf)) &&
((pl)-(pf))/(pf)>0.02 &&
buyPower>1.5 &&
(pl)>pClosing
)

return true;

return false;

}()
