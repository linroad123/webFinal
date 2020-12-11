import { executeQuery } from "../database/database.js";

const addMorning = async(id,date,duration,quality,mood) => {
    const exist = await executeQuery("SELECT date FROM morning WHERE date = $1 and user_id = $2",date,id);
    if (exist.rowsOfObjects().length===0) {
        await executeQuery("INSERT INTO morning (user_id,date,duration,quality,mood) VALUES ($1,$2,$3,$4,$5)", id,date,duration,quality,mood);
    } else{
        await executeQuery("UPDATE morning SET duration=$3,quality=$4,mood=$5 WHERE user_id=$1 and date=$2",id,date,duration,quality,mood);
    }
}

const addEvening = async(id,date,sports,study,eating,mood) => {
    const exist = await executeQuery("SELECT date FROM evening WHERE date = $1 and user_id = $2",date,id);
    if (exist.rowsOfObjects().length===0) {
        await executeQuery("INSERT INTO evening (user_id,date,sports,study,eating,mood) VALUES ($1,$2,$3,$4,$5,$6)", id,date,sports,study,eating,mood);
    } else{
        await executeQuery("UPDATE evening SET sports=$3,study=$4,eating=$5,mood=$6 WHERE user_id=$1 and date=$2",id,date,sports,study,eating,mood);
    }
}

const morningDone = async(id) =>{

    const exist = await executeQuery("SELECT mood FROM morning WHERE date = current_date and user_id = $1",id);
    const existevening = await executeQuery("SELECT mood FROM evening WHERE date = current_date and user_id = $1",id);
    console.log(exist.rowsOfObjects())
    if (exist.rowsOfObjects().length===0) {
        const not = 'Not done!'
        return not;
    } else{
        console.log(!exist.rowsOfObjects().length===0)
        const message = 'Done!'
        return message;
    }

}

const eveningDone = async(id) =>{

    const exist = await executeQuery("SELECT mood FROM evening WHERE date = current_date and user_id = $1",id);
    console.log(exist.rowsOfObjects())
    if (exist.rowsOfObjects().length===0) {
        const not = 'Not done!'
        return not;
    } else{
        console.log(!exist.rowsOfObjects().length===0)
        const eveMessage = 'Done!'
        return eveMessage;
    }
    
}


const landing_today = async() =>{
    const today_mood = await executeQuery("select (AVG(morning. mood)+AVG(evening.mood))/2 as today FROM morning INNER JOIN evening ON morning.user_id = evening.user_id WHERE morning.date= current_date and evening.date= current_date");

    let res = [];
    if (today_mood) {
        res = today_mood.rowsOfObjects();
    } 
    if (res.length > 0){
        const today = res[0].today;
        return today;
    }
    else{        
        return {};
    }
}

const landing_yesterday = async() =>{
    const yesterday_mood = await executeQuery("select (AVG(morning. mood)+AVG(evening.mood))/2 as yesterday FROM morning INNER JOIN evening ON morning.user_id = evening.user_id WHERE morning.date= current_date-1 and evening.date= current_date-1");
    let res = [];
    if (yesterday_mood) {
        res = yesterday_mood.rowsOfObjects();
    } 
    if (res.length > 0){
        const yesterday = res[0].yesterday;
        return yesterday;
    }
    else{        
        return {};
    }
}

const avrsummary = async() => {
    const avrduration = await executeQuery("SELECT AVG(duration) as avgduration FROM morning WHERE morning.date>=current_date-6  and morning.date <=current_date;");
    const avrsports = await executeQuery("SELECT AVG(sports) as avgsports FROM evening WHERE evening.date>=current_date-6  and evening.date <=current_date;");
    const avrstudy = await executeQuery("SELECT AVG(study) as avgstudy FROM evening WHERE evening.date>=current_date-6  and evening.date <=current_date;");
    const avrquality = await executeQuery("SELECT AVG(quality) as avgquality FROM morning WHERE morning.date>=current_date-6  and morning.date <=current_date;");
    const avrmood = await executeQuery("SELECT (AVG(morning. mood)+AVG(evening.mood))/2 as avgmood FROM morning INNER JOIN evening ON morning.date>current_date - interval '7' day and evening.date>current_date - interval '7' day");

    const obj = {
        sleep_duration:avrduration.rowsOfObjects()[0],
        time_spent_on_sports_and_exercise:avrsports.rowsOfObjects()[0],
        studying:avrstudy.rowsOfObjects()[0],
        sleep_quality:avrquality.rowsOfObjects()[0],
        generic_mood:avrmood.rowsOfObjects()[0]
    }

    return obj;
}

const avrspecific = async(year,month,day) => {
    const mdate = year+'-'+month+'-'+day;
    const edate = year+'-'+month+'-'+day;
    const obj = await executeQuery("SELECT (AVG(morning. mood)+AVG(evening.mood))/2 as avg_mood, AVG(duration) as avg_duration,AVG(sports) as avg_sports,AVG(study) as avg_study,AVG(quality) as avg_quality FROM morning INNER JOIN evening ON morning.date =$1 and evening.date=$2",mdate,edate);
    return obj.rowsOfObjects()[0];
}

const userDefaultAvgWeek = async(id) => {
    const lastweek = await executeQuery("SELECT date_part('week',current_date-7);");
    const defaultweek = lastweek.rowsOfObjects()[0].date_part;

    const obj = await executeQuery("SELECT (AVG(morning. mood)+AVG(evening.mood))/2 as weekavrmood, AVG(duration) as weekavrduration,AVG(sports) as weekavrsports,AVG(study) as weekavrstudy,AVG(quality) as weekavrquality FROM morning INNER JOIN evening ON morning.user_id = evening. user_id  and date_part('week',morning.date)=$1 and date_part('week',morning.date)=$2 and morning.user_id=$3", defaultweek, defaultweek,id);

    const res = obj.rowsOfObjects()[0];

        if(!res.weekavrmood) {
            for (var key in res){
                res[key] ="no data for last week exists"
            }
            return res;
        }else{
           return res; 
        }
    
}

const userDefaultAvgMonth = async(id) => {
    const lastmonth = await executeQuery("SELECT date_part('month',current_date-30);");
    const defaultmonth = lastmonth.rowsOfObjects()[0].date_part;

    const obj = await executeQuery("SELECT (AVG(morning. mood)+AVG(evening.mood))/2 as monthavrmood, AVG(duration) as monthavrduration,AVG(sports) as monthavrsports,AVG(study) as monthavrstudy,AVG(quality) as monthavrquality FROM morning INNER JOIN evening ON morning.user_id = evening. user_id  and date_part('month',morning.date)=$1 and date_part('month',morning.date)=$2 and morning.user_id=$3", defaultmonth, defaultmonth,id);

    const res = obj.rowsOfObjects()[0];
    console.log(res)
        if(!res.monthavrmood) {
            for (var key in res){
                res[key] ="no data for last month exists"
            }
            return res;
        }else{
           return res; 
        }
    
}

const userChooseAvgWeek = async(week,id) => {

    const obj = await executeQuery("SELECT (AVG(morning. mood)+AVG(evening.mood))/2 as weekavrmood, AVG(duration) as weekavrduration,AVG(sports) as weekavrsports,AVG(study) as weekavrstudy,AVG(quality) as weekavrquality FROM morning INNER JOIN evening ON morning.user_id = evening. user_id  and date_part('week',morning.date)=$1 and date_part('week',morning.date)=$2 and morning.user_id=$3", week, week,id);

    const res = obj.rowsOfObjects()[0];

        if(!res.weekavrmood) {
            for (var key in res){
                res[key] ="no data for last week exists"
            }
            return res;
        }else{
           return res; 
        }
    
}

const userChooseAvgMonth = async(month,id) => {

    const obj = await executeQuery("SELECT (AVG(morning. mood)+AVG(evening.mood))/2 as monthavrmood, AVG(duration) as monthavrduration,AVG(sports) as monthavrsports,AVG(study) as monthavrstudy,AVG(quality) as monthavrquality FROM morning INNER JOIN evening ON morning.user_id = evening. user_id  and date_part('month',morning.date)=$1 and date_part('month',morning.date)=$2 and morning.user_id=$3", month, month,id);

    const res = obj.rowsOfObjects()[0];

        if(!res.monthavrmood) {
            for (var key in res){
                res[key] ="no data for last month exists"
            }
            return res;
        }else{
           return res; 
        }
    
}


export { avrspecific,avrsummary,addMorning,addEvening,
    landing_today,landing_yesterday,userChooseAvgWeek,userChooseAvgMonth,
    morningDone,eveningDone,userDefaultAvgWeek,userDefaultAvgMonth};