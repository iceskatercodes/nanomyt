'use strict';
/**
 * @author Aravind S
 * created On 7th Sep 2020
 */

function configuremodel(fastify) {
    let model = {}
    const knex = fastify.knex;
    const TBL = 'nanomyt.users'
    
    
   model.getUserByEmail = async(p)=>{
    let resp = {
        error: false
    }
    try {
        const r = await knex(TBL).where({'email':p})
        resp.user = r || null;
    } catch (e) {
        console.log(e);
        resp.error = true
        resp.data = e;
    }
    return resp;
   }

   model.addUser = async(p)=>{
    let resp = {
        error: false
    }
    try {
        const r = await knex(TBL).insert(p).returning('id')
        resp.user = r ;
    } catch (e) {
        console.log(e);
        resp.error = true
        resp.data = e;
    }
    return resp;
   }

   model.getuserById = async(p)=>{
    let resp = {
        error: false
    }
    try {
        const r = await knex(TBL).where({'id':p})
        resp.user = r ;
    } catch (e) {
        console.log(e);
        resp.error = true
        resp.data = e;
    }
    return resp;
   }

   model.updateUser= async(p,id)=>{
    let resp = {
        error: false
    }
    try {
        const r = await knex(TBL).where({'id':id}).update(p)
        resp.msg = "user added" ;
    } catch (e) {
        console.log(e);
        resp.error = true
        resp.data = e;
    }
    return resp;
   }
    
    return model
}

module.exports = configuremodel