'use strict';
const appconfig = require('../config/appconfig');
const appMsg = require('../config/app_msg')
const moment = require("moment");
const nodemailer = require('nodemailer');
const { app } = require('../config/appconfig');
const { user } = require('../schema');


function configurehandler(fastify) {
    const usermodel = require('../models/users')(fastify)
    const utils = fastify.hmutils

    let handler = {}

    handler.register = async (p) => {
        try {
            if (!utils.isEmailValid(p.email)) {
                return appMsg.errorReply(appMsg.ERR_CODE.EMAIL);
            }
            if (p.password.length == 0) {
                return appMsg.errorReply(appMsg.ERR_CODE.EMPTY);
            }
            if (p.password != p.password1) {
                return appMsg.errorReply(appMsg.ERR_CODE.NOT_SAME);
            }
            //1. retrieve the userprofile which matches the email
            let r = await usermodel.getUserByEmail(p.email);
            p.created_at = moment().format()
            if (r.user.length == 0 ) {
                p.password = await utils.hashString(p.password);
                let user = {
                    "firstname": p.firstname,
                    "lastname": p.lastname,
                    "email": p.email,
                    "password": p.password,
                    "created_at": moment().format(),
                    "is_registered": false,
                    "updated_at":moment().format()
                }
                let r = await usermodel.addUser(user)
                let encstr = app.base_url+'/users/confirm?id='+r.user[0]
                let t =await utils.transporter.sendMail({
                    from: 'from_address@example.com',
                    to: p.email,
                    subject: 'Registration',
                    html: '<p1>Hi '+p.firstname+',</p1></br><p>Please click on the link to <a href='+encstr+'>register</p>'
                });
                console.log(t)
                return {error:false,msg:"mail sent",link:encstr,check_mail:'https://ethereal.email/messages'}
            }
            if(r.user[0].is_registered == false){
                let encstr = app.base_url+'/users/confirm?id='+r.user[0].id
                let t =await utils.transporter.sendMail({
                    from: 'from_address@example.com',
                    to:r.user[0].email,
                    subject: 'Registration',
                    html: '<p1>Hi '+r.user[0].firstname+',</p1></br><p>Please click on the link to <a href='+encstr+'>register</p>'
                });
                console.log(t)
                return {error:false,msg:"mail sent",link:encstr,check_mail:'https://ethereal.email/messages'}
            }
            else {
                return appMsg.errorReply(appMsg.ERR_CODE.SVC_ERR);
            }
        } catch (e) {
            console.log(e)
            return appMsg.errorReply(appMsg.ERR_CODE.SVC_ERR);
        }
    }

    handler.acceptUser = async (p) => {
        try {
            let r = await usermodel.getuserById(p)
            if(r.user.length == 0){
                return appMsg.errorReply(appMsg.ERR_CODE.NOT_REGISTERED);
            }
            if(r.user[0].is_registered == true){
                return appMsg.errorReply(appMsg.ERR_CODE.REGISTERED);
            }
            if(r.user[0].is_registered == false){
                let user ={
                    "is_registered":true,
                    "updated_at":moment().format()
                }
                let r= await usermodel.updateUser(user,p)
                return r
            }
           
            return r
        } catch (e) {
            return appMsg.errorReply(appMsg.ERR_CODE.SVC_ERR);
        }
    }

    handler.login = async (p) => {
        try {
            let r = await usermodel.getUserByEmail(p.email);
            if(r.user.length == 0){
                return appMsg.errorReply(appMsg.ERR_CODE.NOT_REGISTERED);
            }
            if(r.user[0].is_registered == false){
                return appMsg.errorReply(appMsg.ERR_CODE.ACCEPT);
            }
            let validpass = await utils.compareHash(p.password, r.user[0].password)
            if (!validpass) {
                //handle error...
                return ErrorMsg(appMessage.invalid_credentials)
            }
            let tkn = await handler.createToken(r.user[0])
            r.msg = "login success"
            r.token = tkn
           
            return r
        } catch (e) {
            return appMsg.errorReply(appMsg.ERR_CODE.SVC_ERR);
        }
    }

    handler.createToken = async (p) => {
        try {
            const token = await fastify.jwt.sign(p, {
                expiresIn: appconfig.app.JWT_EXPIRY_SECS || '300s' //900
            })
            return token;
        } catch (e) {
            ErrorMsg("Error in create Token")
        }

    }

    return handler
}
module.exports = configurehandler