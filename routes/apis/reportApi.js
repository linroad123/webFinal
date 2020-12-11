import * as reportService from "../../services/reportService.js";
import {validate, required, numberBetween, isEmail,isNumber, minLength,minNumber} from "../../deps.js";

const validationRules_morning = {
    duration: [required, isNumber,minNumber(0)],
    quality: [numberBetween(1,5)],
    mood: [numberBetween(1,5)],
};

const validationRules_evening = {
    sports: [required, isNumber,minNumber(0)],
    studying: [required, isNumber,minNumber(0)],
    mood: [ numberBetween(1,5)],
    eating: [numberBetween(1,5)],
};

const addEvening = async({request,response,session,render}) => {
    const body = request.body();
    const params = await body.value;

    const date = params.get('date');
    const sports = params.get('sports');
    const study = params.get('studying');
    const mood = params.get('mood');
    const eating = params.get('eating');
    const id = await session.get('id');

    const data = {
        sports: Number(sports),
        studying: Number(study),
        mood: Number(mood),
        eating:Number(eating),
        errors: {},
    };

    const [passes, errors] = await validate(data, validationRules_evening);

    if (!passes) {
        data.errors = errors;
        data.email=await session.get('user');
        render("evening.ejs", data);
    } else {
    await reportService.addEvening(id,date,sports,study,eating,mood);
    response.status = 200;
    response.redirect('/behavior/reporting');
    }
}

const addMorning = async({request,response,session,render}) => {
    const body = request.body();
    const params = await body.value;

    const date = params.get('date');
    const duration = params.get('duration');
    const quality = params.get('quality');
    const mood = params.get('mood');
    const id = await session.get('id');

    const data = {
        duration: Number(duration),
        quality: Number(quality),
        mood: Number(mood),
        errors: {},
    };

    const [passes, errors] = await validate(data, validationRules_morning);

    if (!passes) {
        data.errors = errors;
        data.email=await session.get('user');
        render("morning.ejs", data);
    } else {
    await reportService.addMorning(id,date,duration,quality,mood);
    response.status = 200;
    response.redirect('/behavior/reporting');
    }
}

const avrspecific =async({params,response}) => {
    const year = params.year;
    const month = params.month;
    const day = params.day;

    const res = await reportService.avrspecific(year,month,day);
    response.body =res;
}

const selectreport = async({request,response,session,render}) => {
    const body = request.body();
    const params = await body.value;

    const week = params.get('week');
    const month = params.get('month');

    
    const weeks = week.split('W')[1];
    const months = month.split('-')[1];
    console.log(months)

    const id = await session.get('id');

    const obj_w = await reportService.userChooseAvgWeek(weeks,id);
    const obj_m = await reportService.userChooseAvgMonth(months,id);

    var obj = Object.assign(obj_w,obj_m);
    obj.week ="";
    obj.weeks = weeks;
    obj.months = months;
    obj.email=await session.get('user');
    render('chooseSummary.ejs',obj);
    
}

export {addMorning,addEvening,avrspecific,selectreport};