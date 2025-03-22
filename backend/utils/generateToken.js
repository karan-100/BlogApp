const JWT=require("jsonwebtoken")

async function generateJWT(payload){
    let token = await JWT.sign({payload},"jwtswcret");
    return token;
}

async function verifyJWT(token){
    try {
        let data=await JWT.verify(token,"jwtswcret");
        return data;
    } catch (err) {
        return false;
    }
}

async function decodeJWT() {
    let decoded=await JWT.decode(token);
    return decoded;
}

module.exports={generateJWT,verifyJWT,decodeJWT}