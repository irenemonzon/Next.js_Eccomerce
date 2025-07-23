import { generateAccessToken } from "../lib/paypal";

//TEst to generate acces token from PayPal

test('generates token from PayPal',async()=>{
    const tokenResponse= await generateAccessToken();
    expect(typeof tokenResponse).toBe('string');
    expect( tokenResponse.length).toBeGreaterThan(0);
    
})