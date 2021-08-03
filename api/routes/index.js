'use strict';
const config = require('../config/appconfig');
const schema = require('../schema/index')
let routes = (fastify, options, done) => {

    const ctrl = require('../controllers/users')(fastify)
    //ping
    fastify.get('/users/ping', (req, reply) => {
        const msg = `Hello from setup @ version ${config.app.app_version}`
        reply.send({
            'error': false,
            'code': 'success',
            'msg': msg
        });
    });

    //register
    fastify.post('/users/register',{
        schema: {
            body: schema.user
        }
    },async(req,reply) =>{
        try {
            let p = req.body
            let r = await ctrl.register(p);
            if(r.error){
                reply.code(400).send(r)
            }
            else{
                reply.send(r);
            }
            
        } catch (e) {
            reply.send(appMsg.errorReply(appMsg.ERR_CODE.SVC_ERR))
        }
    })

    //confirm Register
    fastify.get('/users/confirm',{},
    async(req,reply) =>{
        try {
            console.log("call")
            let p = req.query.id
            let r = await ctrl.acceptUser(p);
            if(r.error){
                reply.code(400).send(r)
            }
            else{
                reply.send(r);
            }
            
        } catch (e) {
            reply.send(appMsg.errorReply(appMsg.ERR_CODE.SVC_ERR))
        }
    })

    fastify.post('/users/login',{
        schema: {
        body: schema.user_login
    }},
    async(req,reply) =>{
        try {
            console.log("call")
            let p = req.body
            let r = await ctrl.login(p);
            if(r.error){
                reply.code(400).send(r)
            }
            else{
                reply.send(r);
            }
            
        } catch (e) {
            reply.send(appMsg.errorReply(appMsg.ERR_CODE.SVC_ERR))
        }
    })

    done()
}

module.exports = routes