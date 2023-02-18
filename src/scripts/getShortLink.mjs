import Axios from 'axios';

export default async function getShortLink(link) {
    //console.log("Start of getShortLink");
    const config = {
        headers:{
            "Authorization": "Bearer 8222781e8c3802f29a7821733407ce3f",
            "Content-Type": "application/json"
        }
      };
      const url = "https://openmy.link/api/url/add";
      const data = {};
      await Axios.post(url, data, config)
      .then(res => console.log(res))
      .catch(err => console.log(err));



    let shortLink;
    /*try {
        await Axios.get(`https://openmy.link/api/url/add`).then((data)=>{
            affilateUser = data.data;
            return data.data;
        });
    } catch (err) {
        console.error(err);
    };
    console.log("data: ", affilateUser); */
    return shortLink;
};