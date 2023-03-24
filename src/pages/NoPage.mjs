import LoadingPoker from "../images/scroogeHatLogo.png";

const NoPage = () => {
  return (
    <div className='no-page'>
      <h1>
        4
        <img src={LoadingPoker} alt='game' className='imageAnimation' />4
      </h1>
    </div>
  );
};

export default NoPage;
