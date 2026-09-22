true==function()
{
    // ============================================================
    // FILTER 04
    // LIVE SMART ENTRY CONFIRMATION
    //
    // هدف:
    // پیدا کردن سهمی که:
    //
    // 1) از نظر ساختار تاریخی سالم باشد
    // 2) نقدشوندگی مناسبی داشته باشد
    // 3) نشانه های Accumulation در سابقه آن دیده شود
    // 4) در محدوده Pre-Breakout قرار گرفته باشد
    // 5) اکنون معاملات جاری آن سناریو را تایید کنند
    // 6) قدرت خریدار حقیقی فعلی بالا باشد
    // 7) خالص خرید حقیقی فعلی مثبت باشد
    // 8) حجم جاری نسبت به سابقه مناسب باشد
    // 9) قیمت فعلی به مقاومت نزدیک باشد
    // 10) اما هنوز در صف خرید قفل نشده باشد
    // 11) سهم بیش از حد از نقطه ورود مناسب فاصله نگرفته باشد
    //
    // این فیلتر ONLINE است.
    //
    // مهم:
    // خروجی = "کاندید بررسی فوری"
    // خروجی ≠ دستور خرید
    //
    // ============================================================


    // ============================================================
    // 1) MINIMUM HISTORICAL DATA
    // ============================================================

    if(typeof [ih][29]=="undefined")
        return false;


    // ============================================================
    // 2) HISTORICAL VALID DAYS
    // ============================================================

    var ValidDays=function(n)
    {
        var c=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceMin>0 &&
               [ih][i].PriceMax>0 &&
               [ih][i].PClosing>0 &&
               [ih][i].QTotTran5J>0)
            {
                c++;
            }
        }

        return c;
    };


    if(ValidDays(30)<25)
        return false;


    // ============================================================
    // 3) HISTORICAL MIN / MAX
    // ============================================================

    var MinPrice=function(n)
    {
        var min=999999999999;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceMin>0 &&
               [ih][i].PriceMin<min)
            {
                min=[ih][i].PriceMin;
            }
        }

        return min;
    };


    var MaxPrice=function(n)
    {
        var max=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceMax>max)
            {
                max=[ih][i].PriceMax;
            }
        }

        return max;
    };


    // ============================================================
    // 4) HISTORICAL AVERAGE VOLUME
    // ============================================================

    var AvgVolume=function(n)
    {
        var sum=0;
        var c=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].QTotTran5J>0)
            {
                sum += [ih][i].QTotTran5J;
                c++;
            }
        }

        if(c==0)
            return 0;

        return sum/c;
    };


    // ============================================================
    // 5) HISTORICAL AVERAGE TRANSACTION COUNT
    // ============================================================

    var AvgTrades=function(n)
    {
        var sum=0;
        var c=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].ZTotTran>0)
            {
                sum += [ih][i].ZTotTran;
                c++;
            }
        }

        if(c==0)
            return 0;

        return sum/c;
    };


    // ============================================================
    // 6) AVERAGE DAILY RANGE
    // ============================================================

    var AvgRange=function(n)
    {
        var sum=0;
        var c=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceYesterday>0)
            {
                sum +=
                ([ih][i].PriceMax-[ih][i].PriceMin)
                /[ih][i].PriceYesterday;

                c++;
            }
        }

        if(c==0)
            return 0;

        return sum/c;
    };


    // ============================================================
    // 7) SUPPORT TOUCHES
    // ============================================================

    var SupportTouches=function()
    {
        var min60=MinPrice(60);

        if(min60<=0)
            return 0;

        var c=0;

        for(var i=2;i<58;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               typeof [ih][i-1]!="undefined" &&
               typeof [ih][i+1]!="undefined")
            {
                if([ih][i].PriceMin<=min60*1.10 &&
                   [ih][i].PriceMin<=[ih][i-1].PriceMin*1.02 &&
                   [ih][i].PriceMin<=[ih][i+1].PriceMin*1.02)
                {
                    c++;
                }
            }
        }

        return c;
    };


    // ============================================================
    // 8) HIGHER LOW
    // ============================================================

    var HigherLow=function()
    {
        var low10=MinPrice(10);
        var low30=MinPrice(30);

        if(low10<=0 || low30<=0)
            return false;

        return low10>low30*1.015;
    };


    // ============================================================
    // 9) RISING STRUCTURE
    // ============================================================

    var RisingStructure=function()
    {
        if(typeof [ih][0]=="undefined" ||
           typeof [ih][4]=="undefined" ||
           typeof [ih][9]=="undefined")
            return false;

        return
        [ih][0].PClosing>=[ih][4].PClosing &&
        [ih][4].PClosing>=[ih][9].PClosing;
    };


    // ============================================================
    // 10) COMPRESSION
    // ============================================================

    var Compression=function()
    {
        var avg30=AvgRange(30);

        if(avg30<=0)
            return 0;

        var c=0;

        for(var i=0;i<15;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceYesterday>0)
            {
                var r=
                ([ih][i].PriceMax-[ih][i].PriceMin)
                /[ih][i].PriceYesterday;

                if(r<=avg30*0.75)
                    c++;
            }
        }

        return c;
    };


    // ============================================================
    // 11) HISTORICAL UP-VOLUME / DOWN-VOLUME
    // ============================================================

    var UpVolume=function(n)
    {
        var sum=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PClosing>[ih][i].PriceYesterday)
            {
                sum += [ih][i].QTotTran5J;
            }
        }

        return sum;
    };


    var DownVolume=function(n)
    {
        var sum=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PClosing<[ih][i].PriceYesterday)
            {
                sum += [ih][i].QTotTran5J;
            }
        }

        return sum;
    };


    // ============================================================
    // 12) HISTORICAL VOLUME QUALITY
    // ============================================================

    var upVol=UpVolume(15);
    var downVol=DownVolume(15);

    var volumeStructure=0;

    if(downVol>0)
    {
        if(upVol>=downVol*1.30)
            volumeStructure=2;

        else if(upVol>=downVol)
            volumeStructure=1;
    }


    // ============================================================
    // 13) BASIC HISTORICAL STRUCTURE
    // ============================================================

    var resistance60=MaxPrice(60);
    var resistance30=MaxPrice(30);

    var support60=MinPrice(60);

    if(resistance60<=0 ||
       resistance30<=0 ||
       support60<=0)
        return false;


    // ============================================================
    // 14) CURRENT PRICE
    // ============================================================

    if(pc<=0)
        return false;


    // قیمت نباید پایین تر از ساختار حمایتی باشد
    if(pc<support60*1.02)
        return false;


    // ============================================================
    // 15) DISTANCE TO RESISTANCE
    // ============================================================

    var dist60=
    ((resistance60-pc)/pc)*100;

    var dist30=
    ((resistance30-pc)/pc)*100;


    // سهم برای Pre-Breakout / Early Breakout
    if(dist60<0)
        return false;

    if(dist60>9)
        return false;

    if(dist30>8)
        return false;


    // ============================================================
    // 16) PRICE POSITION
    // ============================================================

    if(resistance60<=support60)
        return false;

    var position=
    ((pc-support60)/(resistance60-support60))*100;


    if(position<45)
        return false;


    // ============================================================
    // 17) LIQUIDITY FILTER
    // ============================================================

    if([is1]<=0 || [is2]<=0)
        return false;

    if([is24]>8)
        return false;

    if([is25]>30)
        return false;

    if([is40]<70)
        return false;

    if([is41]<60)
        return false;


    // ارزش معاملات جاری نباید کاملاً ضعیف باشد
    if(tval<[is1]*0.30)
        return false;


    // ============================================================
    // 18) FUNDAMENTAL SANITY
    // ============================================================

    if(eps<=0)
        return false;

    if(pe<=0)
        return false;

    if(pe>25)
        return false;


    // ============================================================
    // 19) CURRENT REAL BUYER DATA
    // ============================================================

    if((ct).Buy_CountI<=0 ||
       (ct).Sell_CountI<=0)
        return false;


    var buyPer=
    (ct).Buy_I_Volume/(ct).Buy_CountI;


    var sellPer=
    (ct).Sell_I_Volume/(ct).Sell_CountI;


    if(sellPer<=0)
        return false;


    // ============================================================
    // 20) CURRENT BUYER POWER
    // ============================================================

    var buyerPower=
    buyPer/sellPer;


    // برای فیلتر آنلاین سخت گیرتر هستیم
    if(buyerPower<1.30)
        return false;


    // ============================================================
    // 21) CURRENT REAL MONEY NET FLOW
    // ============================================================

    var realNet=
    (ct).Buy_I_Volume-(ct).Sell_I_Volume;


    if(realNet<=0)
        return false;


    // ============================================================
    // 22) CURRENT VOLUME
    // ============================================================

    var av20=AvgVolume(20);
    var av30=AvgVolume(30);

    if(av20<=0 || av30<=0)
        return false;


    // حجم جاری باید حداقل بخش قابل قبولی از میانگین روزانه باشد
    if(tvol<av30*0.25)
        return false;


    // ============================================================
    // 23) CURRENT TRANSACTION QUALITY
    // ============================================================

    var avgTrades30=AvgTrades(30);

    if(avgTrades30>0 &&
       tno<avgTrades30*0.25)
        return false;


    // ============================================================
    // 24) CURRENT PRICE STRENGTH
    // ============================================================

    // قیمت پایانی/آخرین قیمت نباید ضعیف باشد
    if(pl<pc*0.995)
        return false;


    // سهم نباید در نیمه ضعیف دامنه روزانه قرار گرفته باشد
    if(tmax>tmin && tmax>0 && tmin>0)
    {
        var intradayPosition=
        ((pl-tmin)/(tmax-tmin))*100;

        if(intradayPosition<50)
            return false;
    }


    // ============================================================
    // 25) AVOID LOCKED BUY QUEUE
    // ============================================================

    if(tmax>0 && pc>=tmax*0.995)
        return false;


    // ============================================================
    // 26) AVOID EXTREME LATE CHASE
    // ============================================================

    if(dist60<0.8)
        return false;


    // ============================================================
    // 27) COMPRESSION
    // ============================================================

    var compression=Compression();

    if(compression<3)
        return false;


    // ============================================================
    // 28) SUPPORT HISTORY
    // ============================================================

    var supportTouches=SupportTouches();

    if(supportTouches<2)
        return false;


    // ============================================================
    // 29) HISTORICAL STRUCTURE
    // ============================================================

    var higherLow=HigherLow();
    var rising=RisingStructure();


    // حداقل یکی از دو ساختار باید برقرار باشد
    if(!higherLow && !rising)
        return false;


    // ============================================================
    // 30) SMART SCORE
    // ============================================================

    var score=0;


    // ------------------------------------------------------------
    // HISTORICAL STRUCTURE
    // ------------------------------------------------------------

    if(higherLow)
        score+=8;

    if(rising)
        score+=7;


    // ------------------------------------------------------------
    // SUPPORT HISTORY
    // ------------------------------------------------------------

    if(supportTouches>=5)
        score+=6;
    else if(supportTouches>=4)
        score+=5;
    else if(supportTouches>=3)
        score+=4;
    else if(supportTouches>=2)
        score+=2;


    // ------------------------------------------------------------
    // COMPRESSION
    // ------------------------------------------------------------

    if(compression>=8)
        score+=12;
    else if(compression>=6)
        score+=10;
    else if(compression>=4)
        score+=7;
    else
        score+=4;


    // ------------------------------------------------------------
    // VOLUME STRUCTURE
    // ------------------------------------------------------------

    if(volumeStructure==2)
        score+=8;
    else if(volumeStructure==1)
        score+=4;


    // ------------------------------------------------------------
    // CURRENT BUYER POWER
    // ------------------------------------------------------------

    if(buyerPower>=2.50)
        score+=15;

    else if(buyerPower>=2.00)
        score+=13;

    else if(buyerPower>=1.70)
        score+=11;

    else if(buyerPower>=1.50)
        score+=8;

    else if(buyerPower>=1.30)
        score+=5;


    // ------------------------------------------------------------
    // CURRENT REAL MONEY
    // ------------------------------------------------------------

    if(realNet>=(ct).Buy_I_Volume*0.25)
        score+=10;

    else if(realNet>=(ct).Buy_I_Volume*0.15)
        score+=8;

    else if(realNet>0)
        score+=4;


    // ------------------------------------------------------------
    // CURRENT VOLUME
    // ------------------------------------------------------------

    if(tvol>=av30*1.50)
        score+=12;

    else if(tvol>=av30*1.00)
        score+=10;

    else if(tvol>=av30*0.70)
        score+=7;

    else if(tvol>=av30*0.40)
        score+=4;

    else
        score+=2;


    // ------------------------------------------------------------
    // TRANSACTION ACTIVITY
    // ------------------------------------------------------------

    if(avgTrades30>0)
    {
        if(tno>=avgTrades30*1.50)
            score+=8;

        else if(tno>=avgTrades30)
            score+=6;

        else if(tno>=avgTrades30*0.70)
            score+=3;
    }


    // ------------------------------------------------------------
    // DISTANCE TO RESISTANCE
    // ------------------------------------------------------------

    if(dist60>=1.5 && dist60<=4)
        score+=12;

    else if(dist60<=6)
        score+=10;

    else if(dist60<=8)
        score+=6;


    // ------------------------------------------------------------
    // INTRADAY PRICE POSITION
    // ------------------------------------------------------------

    if(tmax>tmin && tmax>0 && tmin>0)
    {
        var ip=
        ((pl-tmin)/(tmax-tmin))*100;

        if(ip>=80)
            score+=8;

        else if(ip>=70)
            score+=6;

        else if(ip>=60)
            score+=4;
    }


    // ============================================================
    // NEGATIVE PENALTIES
    // ============================================================

    // ------------------------------------------------------------
    // Too close to resistance without volume
    // ------------------------------------------------------------

    if(dist60<1.5 && tvol<av30)
        score-=8;


    // ------------------------------------------------------------
    // Buyer power weak
    // ------------------------------------------------------------

    if(buyerPower<1.50)
        score-=6;


    // ------------------------------------------------------------
    // Price too close to upper limit
    // ------------------------------------------------------------

    if(tmax>0 && pc>=tmax*0.985)
        score-=8;


    // ------------------------------------------------------------
    // Excessive chase
    // ------------------------------------------------------------

    if(dist60<0.8)
        score-=10;


    // ------------------------------------------------------------
    // Weak current transaction
    // ------------------------------------------------------------

    if(tno<avgTrades30*0.50)
        score-=5;


    // ============================================================
    // FINAL QUALITY GATE
    // ============================================================

    if(score>=90)
        return true;

    return false;

}()

