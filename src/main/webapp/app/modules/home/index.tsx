import React, { Component } from 'react';
import { Row } from 'reactstrap';
// @ts-ignore
import banner from '../image/phong-chong-covid-19.png';
import Fade from 'react-reveal/Fade';
import { Alert, Icon, List } from 'antd';

class Home extends Component {
  constructor(props) {
    super(props);
  }
// constructor sẽ nhận vào các props xử lý sự kiện hanld
  public render() {
    const info = (
      <div className="pt-2 pb-2 pl-5 pr-5">
        <Alert
          type="info"
          message="TRANG CHỦ : CHÀO MỪNG ĐẾN VỚI HỆ THỐNG QUẢN LÝ TRỰC BỆNH VIỆN"
          showIcon
        />
      </div>
    );
    return (
      <Fade bottom duration={500}>
        <div>
          {/*<h5 className="p-2">TRANG CHỦ : CHÀO MỪNG ĐẾN VỚI HỆ THỐNG QUẢN LÝ TRỰC BỆNH VIỆN</h5>*/}
          {info}
          <Row className="pl-5 pr-5 pt-3 pb-3 ">
            <img src={banner} alt={'banner'} className="w-95" />
          </Row>
        </div>
      </Fade>
    );
  }
}

export default Home;
