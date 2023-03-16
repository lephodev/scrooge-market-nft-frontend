import Axios from 'axios';

export default async function getAffiliateUser(user_id) {
  let affilateUser;
  try {
    await Axios.get(
      `http://localhost:9001/api/getAffiliateUser/${user_id}`
    ).then((data) => {
      console.log(data);
      affilateUser = data.data;
      //return data.data;
    });
  } catch (err) {
    console.error(err);
  }
  //console.log("data: ", affilateUser);
  return affilateUser;
}

export async function createAffiliateUser(user_id) {
  const createAffiliateUserData = async () => {
    let resp;
    try {
      const res = await Axios.get('https://geolocation-db.com/json/');
      const data = await Axios.get(
        `http://localhost:9001/api/createAffiliateUser/${user_id}/${res.data.IPv4}`
      );
      //console.log("data: ", data.data);
      if (data.success) {
        console.log('if', data);
        return data;
      } else {
        console.log('else', data);
        return data;
      }
    } catch (err) {
      console.error('err', err);
      resp = 'Error';
    }
    return resp;
  };
  return createAffiliateUserData();
}

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
