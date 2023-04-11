import nft from "../images/404.svg";
import opps from "../images/opps.svg";

const NoPage = () => {
  return (
    <div className='no-page'>
      {/* <h1>
        4
        <img src={LoadingPoker} alt='game' className='imageAnimation' />4
      </h1> */}

      <div class='requestNotFound'>
        <img src={nft} alt='error' />
        <img src={opps} alt='error' />
        <div class='errors-text'>
          <div class='errorMssg'>
            We can’t seem to find the page you’re looking for.
          </div>
          <div class='new-btn'>
            <a href='/'>
              <span>Back to home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoPage;
