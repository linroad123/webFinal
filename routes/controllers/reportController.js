import * as reportService from "../../services/reportService.js";
import * as userApi from "../apis/userApi.js";

const chooseTime = async({render,session}) => {
    const id = await session.get('id');
    render('chooseTime.ejs',{email: await session.get('user'),message: await reportService.morningDone(id),evemessage: await reportService.eveningDone(id)});
  };
  
  const morning = async({render,session}) => {
    render('morning.ejs',{email: await session.get('user'),errors:{}});
  };
  
  const evening = async({render,session}) => {
    render('evening.ejs',{email: await session.get('user'),errors:{}});
  };
  
  const defaultSummary = async({render,request,session}) => {
    const id = await session.get('id');
    const data_week = await reportService.userDefaultAvgWeek(id);
    const data_month = await reportService.userDefaultAvgMonth(id);
    var obj = Object.assign(data_week,data_month);
    obj.week ="";
    obj.email="";
    obj.email=await session.get('user');

    render('summary.ejs',obj);

  }
  
  const getSummary = async({render,request,session}) => {
    const body = request.body();
    const params = await body.value;
  
    const week = params.get('week').split('W')[1];
    const month = params.get('month');
  
    render('summary.ejs',{data: await reportService.getSummary(week,month),email: await session.get('user')});
  }

  const avgSummary = async({response}) => {
    response.body = await reportService.avrsummary();
  };

  const landing = async({render}) => {
    render('landing.ejs',{today_mood :await reportService.landing_today(),yesterday_mood:await reportService.landing_yesterday()});
  }

export { chooseTime,morning,evening,defaultSummary,getSummary,landing,avgSummary };