import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Radio } from 'antd';
import DSNhanVien from 'app/modules/dstruc/dsnhanvien';
import { switchChucDanh, themNhanVienVaoDS, toggleModal } from 'app/shared/reducers/dstruc/themnvtruc';
import { IRootState } from 'app/shared/reducers';
import { chucDanh } from 'app/modules/constants/chucdanh';

export interface IThemNVTrucProps extends StateProps, DispatchProps {}

class ThemNVTruc extends Component<IThemNVTrucProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { themnvtruc, dsTruc } = this.props;
    const nonSelectable = dsTruc.chiTietDS.map(row =>
      row.chucDanhTruc.indexOf(themnvtruc.chucDanhTruc) > -1 ? row.nhanVien.maNhanVien : ''
    );
    let renderElement = <div />;
    let trucLanhDao = false;
    if (dsTruc.thongTinDS !== null) {
      trucLanhDao = dsTruc.thongTinDS.tenPhongBan === 'Ban Giám Đốc';
      renderElement = (
        <Modal
          title="Chức danh trực"
          style={{ top: 20 }}
          width="800px"
          visible={themnvtruc.modal}
          onCancel={() => this.props.toggleModal(false)}
          footer={null}
        >
          {!themnvtruc.modal ? (
            ''
          ) : (
            <div className="pb-2 pl-3 pr-3">
              <div className="d-flex justify-content-center pb-2">
                <Radio.Group
                  className="ml-3"
                  onChange={e => this.props.switchChucDanh(e.target.value)}
                  defaultValue={themnvtruc.chucDanhTruc}
                >
                  {Object.keys(chucDanh).map((key, index) => (
                    <Radio key={index} disabled={(key === 'LANH_DAO') !== trucLanhDao } value={key}>
                      {chucDanh[key].title}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
              <DSNhanVien
                dsNhanVien={themnvtruc.dsNhanVien}
                nonSelectable={nonSelectable}
                chucDanhTruc={chucDanh[themnvtruc.chucDanhTruc].title}
                actionButton={{
                  type: 'primary',
                  loading: themnvtruc.saving,
                  icon: 'save',
                  text: 'Lưu',
                  className: 'bg-vnpt',
                  onClick: dsMaNV => this.props.themNhanVienVaoDS(dsMaNV)
                }}
              />
            </div>
          )}
        </Modal>
      );
    }
    return renderElement;
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  dsTruc: storeState.dstruc,
  themnvtruc: storeState.themnvtruc
});

const mapDispatchToProps = {
  toggleModal,
  switchChucDanh,
  themNhanVienVaoDS
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemNVTruc);
