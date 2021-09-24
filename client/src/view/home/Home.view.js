import React, { useState } from 'react';
import HeaderView from '@/components/header/Header.view';
import FooterView from '@/components/footer/Footer.view';
import { Row, Col, Button, Progress } from 'antd';
import useStoreApi from '@/hooks/useStoreApi';
import PageHistory from '@/router/PageHistory';

import './Home.style.less';

const logoSeabattle = require('../../assets/images/logo_seabattle.png');
const game1 = require('../../assets/images/index_icon_1.png');
const game2 = require('../../assets/images/index_icon_2.png');
const game3 = require('../../assets/images/index_icon_3.png');
const game4 = require('../../assets/images/index_icon_4.png');
const land1 = require('../../assets/images/icons_1.png');
const land2 = require('../../assets/images/icons_2.png');
const land3 = require('../../assets/images/icons_3.png');
const land4 = require('../../assets/images/icons_4.png');
const landPriceTitleIcon = require('../../assets/images/card_illustration.png');
const landPriceListItemIcon1 = require('../../assets/images/icons_5.png');
const landPriceListItemIcon2 = require('../../assets/images/icons_6.png');
const landPriceListItemIcon3 = require('../../assets/images/icons_7.png');
const landPriceListItemIcon4 = require('../../assets/images/icons_8.png');
const landMap = require('../../assets/images/icon_map.png');

const gameList = [
  {
    id: 1,
    title: 'THE ULTIMATE SANDBOX SLG',
    description:
      'In Ship&IsLand, what you do and when is entirely up to you! Being mechanically strong & knowledgable will net you many victories on the ocean.',
    icon: game1,
  },
  {
    id: 2,
    title: 'MEANINGFUL END-GAME CONTENT',
    description:
      'Ship&IsLand is built around the philosophy of "gameplay first" and will feature challenging end-game PVE, hardcore PvP, a living economy, and much more!',
    icon: game2,
  },
  {
    id: 3,
    title: 'IMMERSIVE STORYLINE',
    description:
      "Ship&IsLand has a deep story to be told. You'll face tough challenges, meet ruthless characters, and make new friends when you set foot on these islands .",
    icon: game3,
  },
  {
    id: 4,
    title: 'PROFESSIONS & SKILLS',
    description:
      'Progression in Ship&IsLand is based on advancing your skills of building islands and ships. Everything has its own associated skill.',
    icon: game4,
  },
];

const landList = [
  {
    id: 1,
    icon: land1,
    name: 'Small Island',
    // subTitle: 'One small island',
    description: `The foundation of land in Ship&IsLand revolves around square 1x1 plots that are, roughly, the size of one screen. Small islands are the base form of islands in the game, your chance to own a piece of Ship&IsLand. Small islands come with the Sir/Lady title and can have 4 lowest-level ships and lowest-level buildings.`,
    // moerText: 'Regular Plot ownership perks',
  },
  {
    id: 2,
    icon: land2,
    name: 'Medium Island',
    // subTitle: 'One medium island',
    description: `Medium islands are 2x2 sized pieces of land on which you can place more ships and buildings. Medium islands can have 4 medium-level ships and 3 medium-level buildings`,
    // moerText: 'Regular Plot ownership Settlement',
  },
  {
    id: 3,
    icon: land3,
    name: 'Large Island',
    // subTitle: 'One large island',
    description: `Large islands are larger than Medium islands and offer more ships and buildings. They are the home to buildings aimed towards more specific tasks, such as crafting, specific gear acquisition and resource refinement. you can construct refinement stations, crafting buildings, medium guild houses, and an exchange, a structure which gives you access to the global item trading network.`,
    // moerText: 'Regular Plot ownership Town',
  },
  {
    id: 4,
    icon: land4,
    name: 'Unknown Island',
    // subTitle: 'One unknown island',
    description: `Unknown islands are a PvE element in the game, and unknown battles will occur on unknown islands. If you win that battle, you can get a lot of USDT currency rewards. `,
    // moerText: 'Regular Plot ownership City',
  },
];

const landPriceObj = {
  1: {
    icon: landPriceListItemIcon1,
    title: 'Small island',
  },
  2: {
    icon: landPriceListItemIcon2,
    title: 'Medium island',
  },
  3: {
    icon: landPriceListItemIcon3,
    title: 'Large island',
  },
  9: {
    icon: landPriceListItemIcon4,
    title: 'Unknown island',
  },
};

const Home = () => {
  const {
    currentLandIntroduce,
    setCurrentLandIntroduce,
    gotoMarketplace,
    createAccount,
    playVideo,
    showPlayBtn,
    activedGameItem,
    activedGameIndex,
  } = useHomeHook();
  const { isLandPrice } = useStoreApi();
  return (
    <div className="home">
      <HeaderView />

      <div className="home-banner">
        <img className="home-sea" src={logoSeabattle} alt="Ship&IsLand" />
        <div className="home-subheader flex-center">
          <div className="line-container">
            <span className="dot1"></span>
            <span className="dot2"></span>
            <span className="line"></span>
          </div>
          <div className="line-container right">
            <span className="dot1"></span>
            <span className="dot2"></span>
            <span className="line"></span>
          </div>
        </div>
      </div>

      <div id="game" className="home-game-play">
        <div className="home-game-box">
          <Row className="home-game-list" justify="space-around" align="middle" gutter={40}>
            {gameList.map((item, index) => {
              return (
                <Col key={item.id} xs={24} sm={24} md={24} lg={6} xl={6} xxl={6} onClick={() => activedGameItem(index)}>
                  <div className="home-game-col flex-center">
                    <h2 className="title">{item.title}</h2>
                    <div className="split-line"></div>
                    <img className="icon" src={item.icon} alt="sea" />
                    <p className="description">{item.description}</p>
                  </div>
                  <div
                    className="home-game-col flex-center home-game-col-actived"
                    style={activedGameIndex === index ? { display: 'flex' } : {}}>
                    <h2 className="title">{item.title}</h2>
                    <div className="icon-wrap flex-center">
                      <img className="icon" src={item.icon} alt="sea" />
                    </div>
                    <p className="description">{item.description}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
          <div className="home-game-mini">
            {gameList.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={activedGameIndex === index ? 'home-game-mini-item home-game-mini-item-actived' : 'home-game-mini-item'}
                  onClick={() => activedGameItem(index)}>
                  <h2 className="title">{item.title}</h2>
                  <div className="flex-center">
                    <img className="icon" src={item.icon} alt="sea" />
                    <p className="description">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="home-video">
        <div className="home-video-bg">
          <div className="home-video-cover">
            <div className="home-video-content flex-center">
              <Row className="home-video-row" gutter={40}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <div className="home-video-play flex-center" onClick={playVideo}>
                    <div className="video-content"></div>
                    {showPlayBtn && <div className="video-btn"></div>}
                    {!showPlayBtn && (
                      <iframe
                        id="my-player"
                        src="https://www.youtube.com/embed/GVHOEtr_XVc?autoplay=1"
                        className="video-js"
                        loading="lazy"
                        allow="autoplay; encrypted-media"
                        title="Ship&IsLand"
                        ></iframe>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <div className="home-video-des">
                    <h1 className="des-title">Island Ownership</h1>
                    <p className="des-p">
                      The community island sale of Ship&IsLand takes place in the Atlantic, Arctic, Indian, Pacific - all of four oceans in
                      the world. The sale features three types of islands: Small islands, Medium islands, Large islands, and not for sale
                      type islands: unknown islands. Different islands have different numbers of ships, number of buildings, and upgrade
                      restrictions.
                      <br />
                      <br />
                      As a landowner, you'll receive a small percentage of revenue that is produced by the estate your plot belongs to
                      upgrade your ships and buildings.
                      <br />
                      <br />
                      Total island supply of Ship&IsLand is 9,900 islands.There are 1,980 in the Indian Ocean, 2,574 in Atlantic Ocean, 346
                      in the Arctic Ocean, and 700 in the Pacific.
                    </p>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <div className="des-footer">
                    <div className="des-footer-btn">
                      <div className="flex-between des-footer-mini">
                        <div className="flex-center">
                          <span className="title" onClick={playVideo}>
                            Watch trailer
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="30" viewBox="0 0 48 30">
                            <path
                              id="icon_video"
                              className="cls-1"
                              d="M46.2,28.5L38,23v3a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H34a4,4,0,0,1,4,4V8l8.2-5.5,1.8,1v24ZM14,6.625L15.167,5.5,28,15.5l-12.833,10L14,24.375V6.625Z"></path>{' '}
                          </svg>
                        </div>
                        <div className="line-container">
                          <span className="dot1"></span>
                          <span className="dot2"></span>
                          <span className="line"></span>
                          <span className="dot2"></span>
                          <span className="dot1"></span>
                        </div>
                        <Button className="home-video-buy1" size="large" onClick={gotoMarketplace}>
                          Community Island Sale
                        </Button>
                        <div className="home-video-buy2">
                          <Button size="large" onClick={gotoMarketplace}>
                            Community Island Sale
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <div className="home-land-introduce">
        <div className="home-land-introduce-content">
          <Row className="home-land-introduce-row">
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div className="home-land-introduce-left">
                <div className="subtitle">{landList[currentLandIntroduce].subTitle}</div>
                <div className="title">{landList[currentLandIntroduce].name}</div>
                <div className="line-container">
                  <span className="line-w"></span>
                  <span className="dot1-w"></span>
                  <span className="dot2-w"></span>
                  <span className="dot3-w"></span>
                </div>
                <p className="description">{landList[currentLandIntroduce].description}</p>
                <Row className="land-row">
                  {landList.map((item, index) => {
                    return (
                      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} key={item.id} onClick={() => setCurrentLandIntroduce(index)}>
                        <div className="land-item flex-center" style={currentLandIntroduce === index ? { opacity: 1 } : { opacity: 0.5 }}>
                          <img src={item.icon} alt="USDT" />
                          <span>{item.name}</span>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="home-land-price">
        <div className="home-land-price-content">
          <div className="home-land-price-right flex-between">
            <img className="land-price-map" src={landMap} alt="land map" />
            <div className="home-land-price-title">
              <div className="title">Community Land Sale</div>
              <div className="flex-center">
                <div className="line-container">
                  <span className="special-left"></span>
                  <span className="line"></span>
                  <span className="dot2"></span>
                  <span className="dot2"></span>
                </div>
              </div>
            </div>
          </div>
          <Row className="home-land-price-row" gutter={40}>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
              <div className="home-land-price-right">
                <p className="des">
                  On the card, you can see the pricing of the different types of island. When filling in the application you will be able to
                  select how many small islands, medium islands and large islands you'd like to purchase. Your application will then be
                  evaluated and you will be contacted if you’re eligible!
                </p>
                <div className="buy-land-container buy-land-container-pc flex-start">
                  <div className="buy-btn" onClick={gotoMarketplace}>
                    Go to purchase
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
              <div className="land-price-bg">
                <div className="land-price-title">
                  <h2 className="title">Island price</h2>
                </div>
                {isLandPrice.map(item => {
                  return (
                    <Row
                      key={item.id}
                      className={`land-price-list land-price-list-${item.id}`}
                      justify="space-around"
                      align="middle"
                      gutter={20}>
                      <Col span={4}>
                        <img className="land-price-list-icon" src={landPriceObj[item.genre].icon} alt="land" />
                      </Col>
                      <Col span={20}>
                        <div className={`land-price-item land-price-item-${item.id}`}>
                          <div className="land-price-list-info1 flex-between">
                            <span>{landPriceObj[item.genre].title}</span>
                            <span>{item.price} USDT</span>
                          </div>
                          <Progress percent={Math.floor(((item.total - item.remaining) / item.total) * 100)} showInfo={false} />
                          <div className="land-price-list-info4 flex-between">
                            <span>Total remaining</span>
                            <span>{item.remaining}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  );
                })}

                <img className="land-price-icon" src={landPriceTitleIcon} alt="land price" />
              </div>
            </Col>
          </Row>
          <div className="buy-land-container buy-land-container-mini flex-start">
            <div className="buy-btn" onClick={gotoMarketplace}>
              Go to purchase
            </div>
          </div>
          <div className="sign-up-box flex-between">
            <div className="social-icons flex-center">
              <div className="icon">
                <a href="https://discord.gg" rel="noopener noreferrer" target="blank_">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                    <path
                      id="icon_social_discord"
                      className="cls-1"
                      d="M43.666,50l-2-3.8c2.6-.958,5.9-2.808,6.833-4.624-3.033,2.246-9.668,4.789-16.5,4.789s-13.467-2.543-16.5-4.789c0.933,1.817,4.234,3.666,6.834,4.624l-2,3.8C11.2,50,7,43.889,7,43.229,7,35,10.3,23.115,13.166,18.788,16.265,15.552,23.4,14,25.333,14l0.834,1.321a27.248,27.248,0,0,0-10.333,4.789,34.956,34.956,0,0,1,32.333,0A27.245,27.245,0,0,0,37.833,15.32L38.666,14c1.933,0,9.067,1.552,12.167,4.789C53.7,23.115,57,35,57,43.229,57,43.889,52.8,50,43.666,50Zm-20-19.817a4.634,4.634,0,0,0,0,9.248A4.634,4.634,0,0,0,23.667,30.183Zm16.667,0a4.634,4.634,0,1,0,4.333,4.624A4.486,4.486,0,0,0,40.333,30.183Z"></path>{' '}
                  </svg>
                </a>
              </div>
              <div className="icon">
                <a href="https://www.reddit.com" target="blank_">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                    <path
                      id="icon_social_reddit"
                      className="cls-1"
                      d="M56,40.295C56,50.745,44.109,54,34.894,54H29.106C19.89,54,8,50.745,8,40.295c0-.378.008-0.747,0.02-1.113L8,39.2a80.471,80.471,0,0,1,.716-10.356c0.3-1.983,1.3-7.4,4.3-7.4A8.48,8.48,0,0,1,16.741,22.6a8.967,8.967,0,0,0-4.8,5.142,18.045,18.045,0,0,1,6.6-4.062c0.056,0.037.112,0.08,0.168,0.118a39.283,39.283,0,0,1,10.3-1.549L32.358,12.2c0.5-1.553,1.539-2.367,2.866-2.219,0.933,0.1,8.879,2.12,12.831,3.13a3.506,3.506,0,0,1,2.931-1.651,3.738,3.738,0,0,1,3.582,3.875,3.6,3.6,0,0,1-7.054.916l-9.066-1.463c-1.075-.147-1.4.023-1.791,1.479L35,22.247a39.252,39.252,0,0,1,10.283,1.548c0.056-.038.112-0.081,0.168-0.118a18.043,18.043,0,0,1,6.6,4.062,8.965,8.965,0,0,0-4.8-5.142,8.481,8.481,0,0,1,3.727-1.145c3,0,4,5.415,4.3,7.4A80.43,80.43,0,0,1,56,39.2l-0.02-.023C55.992,39.547,56,39.917,56,40.295ZM20.537,33.657c-2.967,0-5.015,2.484-5.015,5.548s2.047,5.548,5.015,5.548,5.015-2.484,5.015-5.548S23.5,33.657,20.537,33.657Zm22.925,0c-2.968,0-5.015,2.484-5.015,5.548s2.047,5.548,5.015,5.548,5.015-2.484,5.015-5.548S46.43,33.657,43.463,33.657Z"></path>{' '}
                  </svg>
                </a>
              </div>
              <div className="icon">
                <a href="https://twitter.com" rel="noopener noreferrer" target="blank_">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                    <path
                      id="icon_social_twitter"
                      className="cls-1"
                      d="M51.047,20.361A17.372,17.372,0,0,0,56.006,19.3a12.382,12.382,0,0,1-4.615,4.532s-0.511,20.6-20.845,25.437A30.2,30.2,0,0,1,8,45.466l0.127-.324c2.222,0.105,9.394.155,13.781-3.219l0.032-.025s-7.852-1.486-8.538-6.924a15.921,15.921,0,0,0,4.056.13s-7.7-2.453-6.889-9.758A9.557,9.557,0,0,0,14.726,26.9s-6.679-4.079-2.272-12.784c0,0,8.421,10.371,19.386,10.787,0,0-1.256-8.214,6.728-10.439,0,0,6.225-2.143,10.539,2.871a34.034,34.034,0,0,0,6.1-1.618S53.618,19.083,51.047,20.361Z"></path>{' '}
                  </svg>
                </a>
              </div>
            </div>
            <div className="texts">
              <div className="title">Not registered?</div>
              <span className="register" onClick={createAccount}>
                Create an account
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path id="icon_arrowRight" className="cls-1" d="M12.523,27L8,22.752,13.64,16,8,9.247,12.523,5,24,16Z"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <FooterView />
    </div>
  );
};

const useHomeHook = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [currentLandIntroduce, setCurrentLandIntroduce] = useState(0);
  const [showPlayBtn, setShowPlayBtn] = useState(true);
  const [activedGameIndex, setActivedGameIndex] = useState(1);

  const gotoMarketplace = () => {
    PageHistory.push('/marketplace');
  };

  const createAccount = () => {
    window.dapp.event.emit('createAccount');
  };

  const playVideo = () => {
    setShowPlayBtn(false);
  };

  const activedGameItem = index => setActivedGameIndex(index);

  return {
    currentQuestion,
    currentLandIntroduce,
    setCurrentQuestion,
    setCurrentLandIntroduce,
    gotoMarketplace,
    createAccount,
    playVideo,
    showPlayBtn,
    activedGameItem,
    activedGameIndex,
  };
};
export default Home;
