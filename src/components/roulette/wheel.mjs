import React from "react";
// import spinimg from "../../assets/images/profile/btn.png";
import bgaudio from "../../images/sounds/wheel-win3.wav";
import winItemaudio from "../../images/sounds/wheel-win.wav";
import rotatewheel from "../../images/sounds/wheel-rotate.wav";
import wheelStop from "../../images/sounds/wheel-stop.wav";
import "./wheel.css";
import { marketPlaceInstance } from "../../config/axios.js";
import { numFormatter, getClientSeed } from "../../utils/generateClientSeed.js";
import { toast } from "react-toastify";
import spinWheel from "../../images/spinWheel.png";

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      spinButtonDisable: false,
    };
    this.selectItem = this.selectItem.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
  }

  async selectItem() {
    if (this.state.selectedItem === null) {
      try {
        const clientSeed = getClientSeed();
        // console.log({ clientSeed });
        this.setState({ spinButtonDisable: true });
        const response = await (await marketPlaceInstance()).get("/gameResult", {
          params: { clientSeed },
        });
        // console.log("==>>>", response);
        const selectedItem = this.props.items.findIndex(
          (el) => el.token === response?.data?.resultData?.token
        );
        if (selectedItem === -1) return;
        this.setState({ selectedItem });
        this.props.setWinItem(selectedItem);
        if (this.props.onSelectItem) {
          this.props.onSelectItem(selectedItem);
        }
        let ele = document.getElementById("rotate-wheel");
        if (ele) {
          ele.play();
        }
        setTimeout(() => {
          let ele = document.getElementById("wheel-stop");
          if (ele) {
            ele.play();
          }
        }, 3400);
      } catch (error) {
        if (error?.response?.data?.msg) {
          toast.error(error?.response?.data?.msg, { toastId: "spin-wheel" });
        }
        this.setState({ spinButtonDisable: false });
      }
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }
  handleEvent() {
    this.props.setWinPopup(true);
    this.props.handleSpin(this.state.selectedItem);
    let ele = document.getElementById("winitem-wheel");
    if (ele) {
      ele.play();
    }
  }
  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    // console.log("selectedItem", { selectedItem, items });

    const wheelVars = {
      "--nb-item": items.length,
      "--selected-item": selectedItem,
    };
    const spinning = selectedItem !== null ? "spinning" : "";
    return (
      <>
        <div className='roulette-spinner'>
          <div className='wheel-container'>
            <div className='wheel-bg'>
              <div
                className={`wheel ${spinning}`}
                style={wheelVars}
                onTransitionEnd={this.handleEvent}
              >
                {items?.map((item, index) => (
                  <>
                    <div
                      className={`wheel-item wheel-item${index} ${
                        items[selectedItem]?.token === item?.token
                          ? "seleted-item"
                          : ""
                      }`}
                      key={index}
                      style={{ "--item-nb": index }}
                    >
                      {`${item?.token} ST + ${numFormatter(item?.gc)} GC`}
                    </div>
                  </>
                ))}
              </div>
              {/* <div className="spin-left">
                <p>Spin left: 1</p>
              </div> */}
            </div>
          </div>
        </div>
        <div
          className={`spin-btn ${
            this.state.spinButtonDisable ? "spin-disable" : ""
          }`}
          onClick={this.selectItem}
        >
          <img src={spinWheel} alt='spin' />
          <h6>{"SPIN NOW"} </h6>
        </div>
        {/* <div className="spin-btn">
          <img src={spinimg} alt="spin" onClick={this.selectItem} />
          <h6>SPIN NOW</h6>
        </div> */}
        <audio id='bg-audio'>
          <source src={bgaudio}></source>
        </audio>
        <audio id='rotate-wheel'>
          <source src={rotatewheel}></source>
        </audio>
        <audio id='winitem-wheel'>
          <source src={winItemaudio}></source>
        </audio>
        <audio id='wheel-stop'>
          <source src={wheelStop}></source>
        </audio>
      </>
    );
  }
}
