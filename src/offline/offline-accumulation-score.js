
true==function()
{
    // ============================================================
    // FILTER 02
    // OFFLINE ACCUMULATION SCORE
    //
    // هدف:
    // شناسایی نمادهایی که در انتهای روز / خارج از بازار:
    //
    // 1- نقدشوندگی مناسب دارند
    // 2- سابقه گیرکردن و روزهای بدون معامله زیادی ندارند
    // 3- در قسمت پایین محدوده 60 روزه قرار دارند
    // 4- چند واکنش به ناحیه کف/حمایت داشته اند
    // 5- در نزدیکی کف نشانه فعالیت حجمی دارند
    // 6- حجم در روزهای مثبت نسبت به روزهای منفی کیفیت مناسبی دارد
    // 7- دامنه نوسان در حال فشرده شدن است
    // 8- فضای مناسبی تا سقف/مقاومت 60 روزه باقی مانده است
    // 9- قدرت خریدار حقیقی فعلی مناسب است
    // 10- خالص خرید حقیقی فعلی مثبت است
    // 11- وضعیت 3 و 12 ماهه سهم از نظر روزهای مثبت قابل قبول است
    // 12- EPS مثبت و P/E قابل قبول دارد
    //
    // سپس برای سهم امتیاز Accumulation از 0 تا 100 ساخته می شود.
    //
    // خروجی نهایی فقط برای نمادهایی است که:
    // - شرایط حیاتی را پاس کنند
    // - امتیاز تجمع آنها >= 75 باشد
    //
    // این فیلتر EOD / OFFLINE است.
    // برای شکار حرکت لحظه ای بازار طراحی نشده است.
    //
    // محدودیت داده:
    // [ih] طبق مستندات حداکثر سابقه قابل اتکای مورد استفاده
    // در این معماری 60 روز است.
    //
    // داده تاریخی روزانه حقیقی/حقوقی در [ih] وجود ندارد.
    // بنابراین "قدرت خریدار تاریخی روزانه" جعل نشده است.
    // وضعیت حقیقی/حقوقی جاری از (ct) و Baseline سه ماهه از [is]
    // استفاده می شود.
    // ============================================================


    // ------------------------------------------------------------
    // حداقل سابقه مورد نیاز
    // ------------------------------------------------------------
    if(typeof [ih][59]=="undefined")
        return false;


    // ------------------------------------------------------------
    // تعداد روزهای معتبر در 60 روز
    // ------------------------------------------------------------
    var Valid60=function()
    {
        var c=0;

        for(var i=0;i<60;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceMin>0 &&
               [ih][i].PriceMax>0 &&
               [ih][i].QTotTran5J>0)
            {
                c++;
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // کمینه قیمت 60 روز
    // ------------------------------------------------------------
    var Min60=function()
    {
        var min=999999999999;

        for(var i=0;i<60;i++)
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


    // ------------------------------------------------------------
    // بیشینه قیمت 60 روز
    // ------------------------------------------------------------
    var Max60=function()
    {
        var max=0;

        for(var i=0;i<60;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceMax>max)
            {
                max=[ih][i].PriceMax;
            }
        }

        return max;
    };


    // ------------------------------------------------------------
    // کمینه قیمت 30 روز
    // ------------------------------------------------------------
    var Min30=function()
    {
        var min=999999999999;

        for(var i=0;i<30;i++)
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


    // ------------------------------------------------------------
    // بیشینه قیمت 30 روز
    // ------------------------------------------------------------
    var Max30=function()
    {
        var max=0;

        for(var i=0;i<30;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceMax>max)
            {
                max=[ih][i].PriceMax;
            }
        }

        return max;
    };


    // ------------------------------------------------------------
    // میانگین حجم
    // ------------------------------------------------------------
    var AvgVol=function(n)
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


    // ------------------------------------------------------------
    // میانگین دامنه روزانه
    //
    // برای تشخیص فشردگی نوسان
    // ------------------------------------------------------------
    var AvgRange=function(n)
    {
        var sum=0;
        var c=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceMin>0 &&
               [ih][i].PriceMax>0 &&
               [ih][i].PriceYesterday>0)
            {
                sum += ([ih][i].PriceMax-[ih][i].PriceMin)
                        /[ih][i].PriceYesterday;
                c++;
            }
        }

        if(c==0)
            return 0;

        return sum/c;
    };


    // ------------------------------------------------------------
    // حجم روزهای مثبت
    // ------------------------------------------------------------
    var UpVol=function(n)
    {
        var sum=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].QTotTran5J>0 &&
               [ih][i].PClosing>[ih][i].PriceYesterday)
            {
                sum += [ih][i].QTotTran5J;
            }
        }

        return sum;
    };


    // ------------------------------------------------------------
    // حجم روزهای منفی
    // ------------------------------------------------------------
    var DownVol=function(n)
    {
        var sum=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].QTotTran5J>0 &&
               [ih][i].PClosing<[ih][i].PriceYesterday)
            {
                sum += [ih][i].QTotTran5J;
            }
        }

        return sum;
    };


    // ------------------------------------------------------------
    // روزهای مثبت
    // ------------------------------------------------------------
    var UpDays=function(n)
    {
        var c=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].QTotTran5J>0 &&
               [ih][i].PClosing>[ih][i].PriceYesterday)
            {
                c++;
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // روزهای منفی
    // ------------------------------------------------------------
    var DownDays=function(n)
    {
        var c=0;

        for(var i=0;i<n;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].QTotTran5J>0 &&
               [ih][i].PClosing<[ih][i].PriceYesterday)
            {
                c++;
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // روزهای پرحجم در 20 روز اخیر
    // ------------------------------------------------------------
    var HighVolumeDays=function()
    {
        var av=AvgVol(20);

        if(av<=0)
            return 0;

        var c=0;

        for(var i=0;i<20;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].QTotTran5J>=av*1.5)
            {
                c++;
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // تعداد واکنش های نزدیک کف 60 روزه
    //
    // این "حمایت تکنیکال قطعی" نیست.
    // یک proxy محاسباتی برای تشخیص چندبار برگشت از
    // محدوده پایین قیمت است.
    // ------------------------------------------------------------
    var SupportTouches=function()
    {
        var min=Min60();

        if(min<=0)
            return 0;

        var c=0;

        for(var i=2;i<58;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               typeof [ih][i-1]!="undefined" &&
               typeof [ih][i+1]!="undefined")
            {
                var low=[ih][i].PriceMin;

                if(low>0 &&
                   low<=min*1.035 &&
                   low<=[ih][i-1].PriceMin*1.015 &&
                   low<=[ih][i+1].PriceMin*1.015)
                {
                    c++;
                }
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // حجم معاملات در ناحیه کف
    //
    // حجم روزهایی که قیمت پایانی آنها در 25 درصد پایینی
    // محدوده 60 روزه قرار داشته است.
    // ------------------------------------------------------------
    var LowZoneVolume=function()
    {
        var min=Min60();
        var max=Max60();

        if(min<=0 || max<=min)
            return 0;

        var level=min+(max-min)*0.25;

        var sum=0;
        var c=0;

        for(var i=0;i<60;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PClosing>0 &&
               [ih][i].PClosing<=level &&
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


    // ------------------------------------------------------------
    // تعداد روزهای پرحجم در ناحیه پایین
    // ------------------------------------------------------------
    var LowZoneHighVolume=function()
    {
        var av=AvgVol(60);

        if(av<=0)
            return 0;

        var min=Min60();
        var max=Max60();

        if(min<=0 || max<=min)
            return 0;

        var level=min+(max-min)*0.30;

        var c=0;

        for(var i=0;i<60;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PClosing<=level &&
               [ih][i].QTotTran5J>=av*1.5)
            {
                c++;
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // بررسی وجود کندل های با سایه پایین قابل توجه
    //
    // این مورد به عنوان نشانه دفاع از قیمت استفاده می شود.
    // ادعای تشخیص قطعی الگوی کلاسیک کندلی نیست.
    // ------------------------------------------------------------
    var LowerWickDays=function()
    {
        var c=0;

        for(var i=0;i<30;i++)
        {
            if(typeof [ih][i]!="undefined")
            {
                var o=[ih][i].PriceFirst;
                var cl=[ih][i].PClosing;
                var lo=[ih][i].PriceMin;
                var hi=[ih][i].PriceMax;

                if(o>0 && cl>0 && lo>0 && hi>0)
                {
                    var body=Math.abs(cl-o);
                    var lower=Math.min(o,cl)-lo;
                    var range=hi-lo;

                    if(range>0 &&
                       lower>=body &&
                       lower/range>=0.30)
                    {
                        c++;
                    }
                }
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // تعداد روزهای فشرده
    // ------------------------------------------------------------
    var CompressionDays=function()
    {
        var av=AvgRange(30);

        if(av<=0)
            return 0;

        var c=0;

        for(var i=0;i<15;i++)
        {
            if(typeof [ih][i]!="undefined" &&
               [ih][i].PriceYesterday>0)
            {
                var r=([ih][i].PriceMax-[ih][i].PriceMin)
                        /[ih][i].PriceYesterday;

                if(r<av*0.75)
                    c++;
            }
        }

        return c;
    };


    // ------------------------------------------------------------
    // اعتبار اولیه
    // ------------------------------------------------------------
    var valid=Valid60();

    if(valid<50)
        return false;


    var min60=Min60();
    var max60=Max60();
    var min30=Min30();
    var max30=Max30();

    if(min60<=0 || max60<=min60)
        return false;

    if(min30<=0 || max30<=min30)
        return false;


    // ============================================================
    // 1) LIQUIDITY GATE
    // ============================================================

    if([is1]<=0 || [is2]<=0)
        return false;

    if([is24]>8)
        return false;

    if([is25]>30)
        return false;

    if([is40]<80)
        return false;

    if([is41]<70)
        return false;

    if(tval<[is1]*0.30)
        return false;

    if(tno<[is9]*0.25)
        return false;


    // ============================================================
    // 2) PRICE LOCATION
    // ============================================================

    var range60=max60-min60;

    var position60=((pl-min60)/range60)*100;

    // سهم نباید در نیمه بالایی محدوده 60 روزه باشد.
    if(position60>48)
        return false;

    // ولی نباید کاملاً در حال شکستن کف باشد.
    if(pl<min60*0.97)
        return false;


    // فضای رشد تا سقف 60 روزه
    var upside60=((max60-pl)/pl)*100;

    // حداقل فضای نظری 10 درصدی
    if(upside60<10)
        return false;


    // ============================================================
    // 3) FUNDAMENTAL SANITY CHECK
    // ============================================================

    if(eps<=0)
        return false;

    if(pe<=0)
        return false;

    if(pe>25)
        return false;

    if(mv<=0)
        return false;


    // ============================================================
    // 4) CURRENT REAL-MONEY / BUYER POWER
    // ============================================================

    if((ct).Buy_CountI<=0)
        return false;

    if((ct).Sell_CountI<=0)
        return false;

    var buyPer=
        (ct).Buy_I_Volume/(ct).Buy_CountI;

    var sellPer=
        (ct).Sell_I_Volume/(ct).Sell_CountI;

    if(sellPer<=0)
        return false;

    var buyerPower=buyPer/sellPer;

    var netReal=
        (ct).Buy_I_Volume-(ct).Sell_I_Volume;


    // حداقل تأیید فعلی
    if(buyerPower<1.15)
        return false;

    if(netReal<=0)
        return false;


    // ============================================================
    // 5) NO LOCKED BUY / ENTRY MUST REMAIN POSSIBLE
    // ============================================================

    if(tmax>0 && pl>=tmax)
        return false;

    if(tmax>0 && pl>=tmax*0.995)
        return false;


    // ============================================================
    // 6) PRICE/VOLUME STRUCTURE
    // ============================================================

    var av20=AvgVol(20);
    var av60=AvgVol(60);

    if(av20<=0 || av60<=0)
        return false;

    // سهم کاملاً خشک نشده باشد
    if(tvol<av20*0.35)
        return false;

    // افت شدید حجم نسبت به 60 روز را حذف می کنیم
    if(av20<av60*0.50)
        return false;


    // ============================================================
    // 7) ACCUMULATION VARIABLES
    // ============================================================

    var uv=UpVol(30);
    var dv=DownVol(30);

    var upDays=UpDays(30);
    var downDays=DownDays(30);

    var supportTouches=SupportTouches();

    var lowVol=LowZoneVolume();

    var lowHighVol=LowZoneHighVolume();

    var wickDays=LowerWickDays();

    var compression=CompressionDays();

    var highVolDays=HighVolumeDays();


    // ============================================================
    // 8) HARD ACCUMULATION GATES
    // ============================================================

    // حداقل 2 واکنش معتبر به محدوده کف
    if(supportTouches<2)
        return false;

    // حداقل فعالیت حجمی اخیر
    if(highVolDays<2)
        return false;

    // نباید تقریباً تمام روزهای اخیر منفی باشند
    if(downDays>0 && upDays<downDays*0.50)
        return false;

    // حجم مثبت نباید بسیار کمتر از حجم منفی باشد
    if(dv>0 && uv<dv*0.65)
        return false;


    // ============================================================
    // 9) ACCUMULATION SCORE
    // ============================================================

    var score=0;


    // ------------------------------------------------------------
    // A. موقعیت پایین محدوده = حداکثر 15 امتیاز
    // ------------------------------------------------------------

    if(position60<=20)
        score+=15;
    else if(position60<=30)
        score+=12;
    else if(position60<=40)
        score+=9;
    else
        score+=5;


    // ------------------------------------------------------------
    // B. چندباره لمس/واکنش به کف = حداکثر 15 امتیاز
    // ------------------------------------------------------------

    if(supportTouches>=5)
        score+=15;
    else if(supportTouches>=4)
        score+=13;
    else if(supportTouches>=3)
        score+=10;
    else if(supportTouches>=2)
        score+=7;


    // ------------------------------------------------------------
    // C. حجم در ناحیه پایین = حداکثر 12 امتیاز
    // ------------------------------------------------------------

    if(lowVol>=av60*1.50)
        score+=12;
    else if(lowVol>=av60*1.20)
        score+=10;
    else if(lowVol>=av60*0.90)
        score+=7;
    else if(lowVol>=av60*0.70)
        score+=4;


    // ------------------------------------------------------------
    // D. روزهای پرحجم در پایین محدوده = حداکثر 8 امتیاز
    // ------------------------------------------------------------

    if(lowHighVol>=4)
        score+=8;
    else if(lowHighVol>=3)
        score+=6;
    else if(lowHighVol>=2)
        score+=4;
    else if(lowHighVol>=1)
        score+=2;


    // ------------------------------------------------------------
    // E. کیفیت حجم صعودی نسبت به نزولی = حداکثر 12 امتیاز
    // ------------------------------------------------------------

    if(dv<=0)
        score+=8;
    else
    {
        var uvRatio=uv/dv;

        if(uvRatio>=1.30)
            score+=12;
        else if(uvRatio>=1.10)
            score+=10;
        else if(uvRatio>=0.90)
            score+=8;
        else if(uvRatio>=0.75)
            score+=5;
        else
            score+=2;
    }


    // ------------------------------------------------------------
    // F. فشردگی نوسان = حداکثر 10 امتیاز
    // ------------------------------------------------------------

    if(compression>=8)
        score+=10;
    else if(compression>=6)
        score+=8;
    else if(compression>=4)
        score+=6;
    else if(compression>=2)
        score+=3;


    // ------------------------------------------------------------
    // G. قدرت خریدار فعلی = حداکثر 10 امتیاز
    // ------------------------------------------------------------

    if(buyerPower>=2.00)
        score+=10;
    else if(buyerPower>=1.70)
        score+=9;
    else if(buyerPower>=1.50)
        score+=8;
    else if(buyerPower>=1.30)
        score+=6;
    else if(buyerPower>=1.15)
        score+=4;


    // ------------------------------------------------------------
    // H. کندل/سایه پایین و دفاع قیمتی = حداکثر 5 امتیاز
    // ------------------------------------------------------------

    if(wickDays>=6)
        score+=5;
    else if(wickDays>=4)
        score+=4;
    else if(wickDays>=2)
        score+=2;


    // ------------------------------------------------------------
    // I. کیفیت نقدشوندگی = حداکثر 5 امتیاز
    // ------------------------------------------------------------

    if([is1]>0 && tval>=[is1]*0.80)
        score+=5;
    else if([is1]>0 && tval>=[is1]*0.55)
        score+=4;
    else if([is1]>0 && tval>=[is1]*0.35)
        score+=2;


    // ------------------------------------------------------------
    // J. ساختار روزهای مثبت تاریخی = حداکثر 4 امتیاز
    // ------------------------------------------------------------

    if([is28]>=55)
        score+=4;
    else if([is28]>=50)
        score+=3;
    else if([is28]>=45)
        score+=2;


    // ============================================================
    // 10) فاصله از مقاومت
    //
    // اگر سهم خیلی نزدیک سقف باشد، برای Accumulation دیر شده.
    // ============================================================

    if(upside60<12)
        score-=3;

    if(upside60>=20)
        score+=2;


    // ============================================================
    // 11) خالص خرید حقیقی قوی تر
    // ============================================================

    if((ct).Buy_I_Volume>=(ct).Sell_I_Volume*1.20)
        score+=2;

    if((ct).Buy_I_Volume>=(ct).Sell_I_Volume*1.50)
        score+=2;


    // ============================================================
    // 12) جلوگیری از امتیاز مصنوعی بالا
    //
    // سهمی که قیمت آن بالاتر از 48 درصد محدوده 60 روزه باشد
    // اصلاً وارد نشده، اما این کنترل اضافه نیز وجود دارد.
    // ============================================================

    if(position60>45)
        score-=3;


    // ============================================================
    // FINAL DECISION
    //
    // امتیاز 75 به بالا = Accumulation Candidate
    // ============================================================

    if(score>=75)
        return true;

    return false;

}()
