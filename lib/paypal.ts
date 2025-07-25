const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
;

export const paypal={
    createOrder: async function createOrder(price:number){
        const accesToken= await generateAccessToken()
        const url=`${base}/v2/checkout/orders`;
        const response= await fetch(url, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${accesToken}`
            },
            body:JSON.stringify({
                intent:'CAPTURE',
                purchase_units:[
                    {
                        amount:{
                            currency_code:'USD',
                            value:price
                        },
                    },
                ],
            }),
        });

        return handleResponse(response)
      
    },
    capturePayment:async function capturePayment(orderId:string){
        const accesToken= await generateAccessToken();
        const url= `${base}/v2/checkout/orders/${orderId}/capture`
         const response= await fetch(url, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${accesToken}`
            },   
        })
         return handleResponse(response)
    }
};

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
    
        const jsonData= await handleResponse(response)
        return jsonData.access_token

}

async function handleResponse(response:Response) {
    if(response.ok){
        return await response.json()
    }else{
        const errorMessage= await response.text();
        throw new Error(errorMessage)
    }  
}

export {generateAccessToken}