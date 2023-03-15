import Axios from 'axios';
import { marketPlaceInstance } from '../config/axios.js';

export default async function getAffiliateUser(user_id) {
    let affilateUser;
    try {
        await marketPlaceInstance().get(`/getAffiliateUser/${user_id}`).then((data)=>{
            affilateUser = data.data;
            //return data.data;
        });
    } catch (err) {
        console.error(err);
    };
    //console.log("data: ", affilateUser); 
    return affilateUser;
};

export async function createAffiliateUser(user_id) {
    
    const createAffiliateUserData = async () => {
        let resp;
        try {
            const res = await Axios.get('https://geolocation-db.com/json/');
            await marketPlaceInstance().get(`/createAffiliateUser/${user_id}/${res.data.IPv4}`).then((data)=>{
                //console.log("data: ", data.data); 
                resp = data.data;
            });
        } catch (err) {
            console.error(err);
            resp = 'Error';
        };
        return resp;
    };
    return createAffiliateUserData();
};

/*export async function getAffiliateCard(user_id) {
    let affiliate;
    try {
        affiliate = await getAffiliateUser(user_id);
    } catch (err) {
        console.error(err);
    };
    console.log('affiliate: ',affiliate);
    
   
    return (
        if(affiliate){
            
                <div className=''>
                    <div className=''>
                        Affiliate Dashboard
                    </div>
                    <div className=''>
                        ID: {affiliate.user_id}
                        Total Earned: {affiliate.total_earned}
                        Last Commission Earned: {affiliate.last_earned_at}
                    </div>
                </div>
            
        } else {
            
                <div className=''>
                    <button className='submit-btn'>Become an Affiliate</button>
                </div>
           
        }
    );
    
};*/