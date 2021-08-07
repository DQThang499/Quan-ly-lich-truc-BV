import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Button, Icon, Modal, Tag, Tooltip } from 'antd';
import { getDSThaDoi, toggleXemThayDoi } from 'app/shared/reducers/lichtruc';
import DanhMuc from 'app/modules/component/danhmuc';
import { chucDanh as chucDanhConst } from 'app/modules/constants/chucdanh';

const caTrucConst = {
  FULL: 'Cả ngày',
  NGAY: 'Ngày',
  DEM: 'Đêm'
};

export interface IXemThayDoiProps extends StateProps, DispatchProps {}

class XemThayDoi extends React.Component<IXemThayDoiProps> {
  private columns = [
    {
      title: (
        <div>
          <Icon type="clock-circle" />
          <span className="pl-2">Ngày trực</span>
        </div>
      ),
      width: '20%',
      dataIndex: 'ngay'
    },
    {
      title: 'Chức danh',
      width: '20%',
      dataIndex: 'chucDanh',
      render: chucDanh => (
        <div>
          <Tag color={chucDanhConst[chucDanh].color}>
            <Icon className="align-middle" type={chucDanhConst[chucDanh].icon} />
            <span className="align-middle pl-1">{chucDanhConst[chucDanh].title}</span>
          </Tag>
        </div>
      )
    },
    {
      title: 'Ca trực',
      width: '20%',
      dataIndex: 'caTruc',
      render: caTruc => caTrucConst[caTruc]
    },
    {
      width: '40%',
      title: (
        <div>
          <Icon type="redo" />
          <span className="pl-2">Thay đổi</span>
        </div>
      ),
      render: (text, record, index) => (
        <div>
          <Tooltip title="Đã phân công">{record.nhanVienPhanCong.tenNhanVien}</Tooltip>
          <Icon type="arrow-right" className="align-middle pr-1 pl-1" />
          <Tooltip title="Nhân viên thay thế">{record.nhanVienThucTe.tenNhanVien}</Tooltip>
        </div>
      )
    }
  ];

  render() {
    const { lichtruc } = this.props;
    return (
      <Modal
        title="Thay đổi so với lịch đã duyệt"
        visible={lichtruc.modalXemThayDoi}
        style={{ top: '20px' }}
        width="1000px"
        footer={
          <div>
            <Button onClick={() => this.props.toggleXemThayDoi(false)}>Đóng</Button>
          </div>
        }
        onCancel={() => this.props.toggleXemThayDoi(false)}
      >
        {!lichtruc.modalXemThayDoi ? (
          ''
        ) : (
          <DanhMuc
            columns={this.columns}
            dataSource={lichtruc.dsThayDoi}
            loadDtata={this.props.getDSThaDoi}
            loading={lichtruc.gettingDSThayDoi}
            rowKey="id"
            totalRow={lichtruc.tongSoDongDSThayDoi}
            height="280px"
            width="800px"
          />
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  lichtruc: storeState.lichtruc
});

const mapDispatchToProps = {
  toggleXemThayDoi,
  getDSThaDoi
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(XemThayDoi);
