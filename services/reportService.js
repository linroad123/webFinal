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

const defaultSummary = async(week,month) => {
    const duration_week = await executeQuery("SELECT AVG(duration) FROM morning WHERE week($1)", week);
    const duration_month = await executeQuery("SELECT AVG(duration) FROM morning WHERE month($1)", month);
    return duration_month,duration_week;
}

const getSummarybyWeek = async(week,month) => {
    const res = await executeQuery("SELECT \
    avg(duration) as avg_sleep, \
    avg(quality) as avg_quality,\
    avg(sports) as avg_sport,\
    avg(studying) as avg_studying,\
    avg(morning.mood + evening.mood) as avg_mood \
    FROM morning \
    INNER JOIN \
    evening \
    ON morning.user_id = evening.user_id \
    WHERE DATE_PART(‘week’,morning.date) = $1 \
    GROUP BY morning.user_id ",week);
    if (!res) {
        return [];
    }
    return res.rowsOfObjects();

}

const landing_today = async() =>{
    const today_mood = await executeQuery("select (morning.mood + evening.mood)/2 as today FROM morning INNER JOIN evening ON morning.user_id = evening.user_id WHERE morning.date= current_date and evening.date= current_date");

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
    const yesterday_mood = await executeQuery("select (morning.mood + evening.mood)/2 as yesterday FROM morning INNER JOIN evening ON morning.user_id = evening.user_id WHERE morning.date= current_date-1 and evening.date= current_date-1");
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

export { addMorning,addEvening,defaultSummary,getSummarybyWeek,landing_today,landing_yesterday,morningDone,eveningDone};