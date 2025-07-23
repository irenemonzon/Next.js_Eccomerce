const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
;

export const paypal={}

async function generateAccessToken(){
    const {PAYPAL_CLIENT_ID,PAYPAL_APP_SECRET}=process.env

    const clientId = PAYPAL_CLIENT_ID?.trim();
    const secret = PAYPAL_APP_SECRET?.trim();
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

    const response= await fetch(`${base}/v1/oauth2/token`,{
        method:'POST',
        body:'grant_type=client_credentials',
        headers:{
            Authorization:`Basic ${auth}`,
            'Content-type':'application/x-www-form-urlencoded'
        }
    })
    
    if(response.ok){
        const jsonData= await response.json()
        return jsonData.access_token
    }else{
        const errorMessage= await response.text()
        throw new Error(errorMessage)
    }
}

export {generateAccessToken}