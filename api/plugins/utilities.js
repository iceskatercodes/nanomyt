'use strict'

/**
 * @createdBy Aravind
 * @createdOn 7th Sep 2020
 */

const shortid = require('shortid');
const bcrypt = require("bcrypt");
var simplecrypto = require('simple-crypto-js').default
const crypto = new simplecrypto('9711')
const salt = 12;
const nodemailer = require('nodemailer')

let utils = {};

utils.encryptString = (s) => {
  let encstr = ''
  try {
    encstr = crypto.encrypt(s)
  } catch (e) {
    console.error(e)
  }
  return encstr
}

utils.decryptString = (s) => {
  let decstr = ''
  try {
    decstr = crypto.decrypt(s)
  } catch (e) {
    console.error(e)
  }
  return decstr
}

utils.hashString = async (s) => {
  let encstr = ''
  try {
    encstr = await bcrypt.hash(s, bcrypt.genSaltSync(salt))
  } catch (e) {
    console.error(e)
  }
  return encstr
}

utils.compareHash = async (s, encstr) => {
  try {
    return await bcrypt.compare(s, encstr)
  } catch (e) {
    console.error(e)
  }
  return false
}
//to check if email is valid
utils.isEmailValid = (s) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let r = re.test(String(s).toLowerCase());
  return r
}

// it should check for minimum 8 digits, capital letter, numeric and one specials char
utils.isStrongPassword = (p) => {
  let format = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;
  let r = format.test(p)
  return r
}

utils.isPhoneValid = (p) => {
  if (!p) return false
  let format = /^\d{10}$/
  let r = format.test(p)
  return r
}

//generates otp
utils.randomNumber = (num = 6) => {
  let n = Math.random().toFixed(num).substr(`-${num}`)
  return Number(n)
}

utils.randomOTP = (num = 6) => {
  let x = Math.pow(10, num - 1)
  let n = Math.floor(x + Math.random() * (9 * x))
  return n
}

//generate short id
utils.shortName = () => {
  return shortid.generate()
}

utils.transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'timothy.murazik50@ethereal.email',
      pass: 'evGunwpnKRJJcpz5ts'
  }
});


module.exports = utils;