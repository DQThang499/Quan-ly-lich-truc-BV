import React from 'react';
import Fade from 'react-reveal/Fade';
import { Alert, Button } from 'antd';
import FormXinVang from './formxinvang';
import FormIn from './formin';
import LichSuVang from './lichsuvang';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { toggleModalIn, toggleModalNhap, toggleModaLS } from 'app/shared/reducers/xinvang';

export interface IXinVangProps extends StateProps, DispatchProps {}

class XinVang extends React.Component<IXinVangProps> {
  render() {
    return (
      <Fade bottom duration={500}>
        <div>
          <FormXinVang />
          <FormIn />
          <LichSuVang />
          <h5 className="p-2">XIN VẮNG TRỰC</h5>
          <hr />
          <div className="pt-2 pb-2 pl-5 pr-5">
            <Alert
              type="info"
              message="Thông tin"
              showIcon
              description="Bạn có thể nhập trực tiếp yêu cầu xin vắng trực vào hệ thống hoặc In đơn xin vắnng trực lãnh đạo theo mẫu"
            />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <Button icon="cloud-upload" type="primary" className="m-2" onClick={() => this.props.toggleModalNhap(true)}>
            Nhập đơn
          </Button>
          {/*<Button icon="history" type="default" className="m-2" onClick={() => this.props.toggleModaLS(true)}>*/}
          {/*  Lịch sử xin vắng*/}
          {/*</Button>*/}
          <Button icon="printer" type="dashed" className="m-2" onClick={() => this.props.toggleModalIn(true)}>
            In đơn
          </Button>
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  xinvang: storeState.xinvang
});

const mapDispatchToProps = {
  toggleModalNhap,
  toggleModalIn,
  toggleModaLS
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(XinVang);
