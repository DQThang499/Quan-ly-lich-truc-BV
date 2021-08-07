import { Button, Icon, Modal, Tag, Tooltip } from 'antd';
import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getLichSuDS, toggleLichSuModal } from 'app/shared/reducers/dstruc/lichsuds';
import { chucDanh } from 'app/modules/constants/chucdanh';
import DanhMuc from 'app/modules/component/danhmuc';

const hanhDongRender = {
  THEM: (
    <Tooltip placement="top" title="Đã thêm vào danh sách">
      <Tag color="green">
        <Icon type="user-add" />
      </Tag>
    </Tooltip>
  ),
  XOA: (
    <Tooltip placement="top" title="Xóa khỏi danh sách">
      <Tag color="red">
        <Icon type="user-delete" />
      </Tag>
    </Tooltip>
  )
};

export interface ILichSuDSProps extends StateProps, DispatchProps {}

class LichSuDS extends React.Component<ILichSuDSProps> {
  private columns = [
    {
      title: () => (
        <div>
          <Icon type="clock-circle" className="align-middle" />
          <span className="align-middle p-2">Thời gian</span>
        </div>
      ),
      dataIndex: 'thoiGian',
      width: '30%',
      render: thoiGian => <span>{new Date(thoiGian).toLocaleString()}</span>
    },
    {
      title: () => (
        <div>
          <Icon type="edit" className="align-middle" />
          <span className="align-middle p-2">Nội dung thay đổi</span>
        </div>
      ),
      dataIndex: 'noiDung',
      width: '70%',
      render: noiDung => {
        const arr = noiDung.toString().split('|');
        return (
          <table>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ width: '50px' }}>
                  {hanhDongRender[arr[2]]}
                </td>
                <td>
                  <strong>{arr[0]}</strong>
                </td>
              </tr>
              {/*<tr>*/}
              {/*  <td>{chucDanh[arr[1]].title}</td>*/}
              {/*</tr>*/}
            </tbody>
          </table>
        );
      }
    }
  ];

  render() {
    const { lichsuds } = this.props;
    return (
      <Modal
        title="Lịch sử danh sách"
        visible={lichsuds.modalLS}
        style={{ top: 20 }}
        width="800px"
        footer={
          <div>
            <Button onClick={() => this.props.toggleLichSuModal(false)}>Đóng</Button>
          </div>
        }
        onCancel={() => this.props.toggleLichSuModal(false)}
      >
        {!lichsuds.modalLS ? (
          ''
        ) : (
          <DanhMuc
            columns={this.columns}
            dataSource={lichsuds.duLieu}
            loadDtata={this.props.getLichSuDS}
            loading={lichsuds.loadingLS}
            rowKey="thoiGian"
            totalRow={lichsuds.tongSoDong}
            height="280px"
            width="600px"
          />
        )}
      </Modal>
    );
  }
}
const mapStateToProps = ({ lichsuds }: IRootState) => ({
  lichsuds
});

const mapDispatchToProps = {
  toggleLichSuModal,
  getLichSuDS
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LichSuDS as any);
