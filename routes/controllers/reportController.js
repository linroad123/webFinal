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
    render('summary.ejs',{week:"",month:"",email: await session.get('user')});
  }
  
  const getSummary = async({render,request,session}) => {
    const body = request.body();
    const params = await body.value;
  
    const week = params.get('week').split('W')[1];
    const month = params.get('month');
  
    render('summary.ejs',{data: await reportService.getSummary(week,month),email: await session.get('user')});
  }

  const avgSummary = async({render}) => {
    render('evening.ejs');
  };

  const landing = async({render}) => {
    render('landing.ejs',{today_mood :await reportService.landing_today(),yesterday_mood:await reportService.landing_yesterday()});
  }

export { chooseTime,morning,evening,defaultSummary,getSummary,avgSummary,landing };