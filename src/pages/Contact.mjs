import "../styles/Home.css";
import Layout from "./Layout.mjs";

export default function Contact() {
  return (
    <Layout>
      <div className='container'>
        <main className='main contact-us'>
          <h1 className='title'>CONTACT US</h1>

          <p className='description yellow'>
            Have a question? Need to raise a concern? Wanna tell us a joke?
          </p>
          <div className='contact-div'>
            Send us an email at support@scrooge.casino<br></br>
            <br></br>
            <a
              href='https://t.me/ScroogeJRverify'
              target='_blank'
              rel='noopener noreferrer'
            >
              Chat with us on Telegram
            </a>
          </div>
        </main>
      </div>
    </Layout>
  );
}
