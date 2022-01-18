require('dotenv').config()
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const jsonwebtoken = require('jsonwebtoken')
const authModel = require('../api/auth/authModel')

exports.getOriginPath = (originalUrl) => {
    let replace = originalUrl.replace(`/api/v1/${process.env.PREFIX}`, '')
    if (replace.includes('?')) {
        const length = replace.length
        const str = replace
        replace = ''
        for (let x = 0; x < length; x++) {
            if (str[x] === '?') {
                break
            }
            replace += str[x]
        }
    }
    return replace
}

exports.encrypted = async (password) => {
    const salt = bcrypt.genSaltSync(10)
    const password_encrypted = bcrypt.hashSync(password, salt)
    return password_encrypted
}

exports.decrypted = async (hashpassword, password) => {
    return bcrypt.compareSync(password, hashpassword)
}

exports.generateToken = (req, user_id, device_id = "") => {
    let objToken = { user_id, device_id }
    req.token = jsonwebtoken.sign(objToken, process.env.SIGN, { expiresIn: '120d' })
    req.token_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
    return
}

// exports.generateTokenLogin = async (req, user_id, device_id, token_noti) => {
//     this.generateToken(req, user_id, device_id)
//     // console.log(req.token)
//     const obj_device = { _id: user_id, device_id, token_noti }
//     await authModel.insertDevice(obj_device);
//     return {
//         user_id,
//         token_id: req.token,
//         token_timelogin: req.token_date,
//         is_member: true
//     }
// }