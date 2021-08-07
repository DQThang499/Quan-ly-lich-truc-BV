import React, { createRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Moment from 'moment';
import { getDSTenPhongBan } from 'app/shared/reducers/danhmuc/nhanvien';
import { inDSThongKe, getDSThongKeChiTiet, getDSThongKeTongHop, inDSThongKeTH } from 'app/shared/reducers/baocao/thongkebaocao';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react/react_jqxgrid';
import { Row, Col, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Alert, Button } from 'antd';
import 'app/shared/layout/theme/darkyellowlis.scss';
import 'app/modules/danhmuc/nhanvien.scss';
import 'app/modules/baocao/thongkebaocao.scss';
import JqxTreeGrid from 'jqwidgets-scripts/jqwidgets-react/react_jqxtreegrid';
import Fade from 'react-reveal/Fade';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';

export interface IDsThongKeBaoCaoProp extends StateProps, DispatchProps {}
export interface IDsThongKeBaoCaoState {
  maNhanVien: any;
  tenNhanVien: any;
  maPhongBan: any;
  tenPhongBan: any;
  tenDonVi: any;
  ngayTruc: any;
  tenNguoiDuyet: any;
  soLanTrucTrongThang: any;
  tuNgay: any;
  denNgay: any;
  disabledIn: any;
  phongBan: any;
  disablelLaydulieu: any;
  dstenPhongBanselect: any;
  toggle: any;
}
class ThongKeBaoCao extends React.Component< IDsThongKeBaoCaoProp, IDsThongKeBaoCaoState> {
  private dsPhongBan: any = JSON.parse(EHRSessionStorage.get('dsPhongBan'));
  private height = window.screen.width < 1280 ? window.screen.height : window.screen.height - 350;
  private refGrid = createRef<JqxTreeGrid>();
  private refGridChiTiet = createRef<JqxTreeGrid>();
  private dataAdapter;
  private dataAdapterChiTiet;
  private columns;
  private columnsChiTiet;
  private source;
  private sourceChiTiet;
  private thoiGian = new Date();
  constructor(props) {
    super(props);
    this.state = {
      maNhanVien: '',
      tenNhanVien: '',
      maPhongBan: '',
      tenPhongBan: '',
      tenDonVi: '',
      ngayTruc: '',
      tenNguoiDuyet: '',
      soLanTrucTrongThang: '',
      tuNgay: Moment(this.thoiGian.setHours(0, 0, 0, 0)).format('YYYY-MM-DD\\THH:mm:ss'),
      denNgay: Moment(this.thoiGian.setHours(23, 59, 59, 59)).format('YYYY-MM-DD\\THH:mm:ss'),
      phongBan: '',
      disabledIn: true,
      disablelLaydulieu: true,
      dstenPhongBanselect: [],
      toggle: '1'
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.layDuLieuCT = this.layDuLieuCT.bind(this);
    this.layDuLieuTH = this.layDuLieuTH.bind(this);
    this.INCT = this.INCT.bind(this);
    this.chuyenTab = this.chuyenTab.bind(this);
    this.columnHidenChangeDropDown = this.columnHidenChangeDropDown.bind(this);
    this.INTH = this.INTH.bind(this);
  }
  componentWillMount() {
    this.initDataAdapter();
  }
  public componentDidMount() {
    this.props.getDSTenPhongBan();
    this.props.getDSThongKeChiTiet(this.state.tuNgay, this.state.denNgay, this.state.maPhongBan);
    this.props.getDSThongKeTongHop(this.state.tuNgay, this.state.denNgay, this.state.maPhongBan);
  //   this.refGrid.current.setOptions({
  //     height:
  //       window.screen.width < 1280
  //         ? window.screen.width - document.getElementById('thongkehoatdongkhoaxncls').offsetHeight
  //         : window.screen.height - document.getElementById('thongkehoatdongkhoaxncls').offsetHeight - 350
  //   });
  //   this.refGridChiTiet.current.setOptions({
  //     height:
  //       window.screen.width < 1280
  //         ? window.screen.width - document.getElementById('thongkehoatdongkhoaxncls').offsetHeight
  //         : window.screen.height - document.getElementById('thongkehoatdongkhoaxncls').offsetHeight - 350
  //   });
  //   const localizationObj = {
  //     loadtext: 'Đang tải...'
  //   };
  //   this.refGrid.current.localization(localizationObj);
  //   this.refGridChiTiet.current.localization(localizationObj);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.nhanvien !== nextProps.nhanvien.danhSachPhongBan) {
      this.setState({ dstenPhongBanselect: nextProps.nhanvien.danhSachPhongBan });
    }
    if (this.props.thongkebaocao.thongKeChiTiet !== nextProps.thongkebaocao.thongKeChiTiet) {
      this.sourceChiTiet.localdata = nextProps.thongkebaocao.thongKeChiTiet;
      this.refGridChiTiet.current.beginUpdate();
      this.refGridChiTiet.current.updateBoundData('cells'); // review từ list vào thẻ có values
      this.refGridChiTiet.current.expandAll();
      this.refGridChiTiet.current.endUpdate();
    }
    if (this.props.thongkebaocao.thongKeTongHop !== nextProps.thongkebaocao.thongKeTongHop) {
      this.source.localdata = nextProps.thongkebaocao.thongKeTongHop;
      // this.refGrid.current.beginUpdate();
      this.refGrid.current.updateBoundData('cells');
      this.refGrid.current.expandAll();
      // this.refGrid.current.endUpdate();
    }
  }
  chuyenTab(tab) {
    if (this.state.toggle !== tab) {
      this.setState({
        toggle: tab
      });
      if (tab === '1') {
        this.refGridChiTiet.current.refresh();
      } else {
        this.refGridChiTiet.current.refresh();
      }
    }
  }
  INCT() {
    this.props.inDSThongKe(this.state.tuNgay,
      this.state.denNgay,
      this.state.maPhongBan);
  }
  INTH() {
    this.props.inDSThongKeTH(this.state.tuNgay,
      this.state.denNgay,
      this.state.maPhongBan);
  }
  layDuLieuCT() {
    this.props.getDSThongKeChiTiet(this.state.tuNgay,
      this.state.denNgay,
      this.state.maPhongBan);
  }
  layDuLieuTH() {
    this.props.getDSThongKeTongHop(this.state.tuNgay,
      this.state.denNgay,
      this.state.maPhongBan);
  }
  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if (name === 'tuNgay') {
      this.setState({ tuNgay: value });
    }
    if (name === 'denNgay') {
      this.setState({ denNgay: value });
    }
    if (name === 'maPhongBan') {
      this.setState({ maPhongBan : value });
    }
  }

  public initDataAdapter() {
    const datafields = [
      { name: 'maNhanVien', type: 'string' },
      { name: 'tenNhanVien', type: 'string' },
      { name: 'soLanTrucTrongThang', type: 'string' }
    ];
    this.source = {
      datatype: 'json',
      dataFields: datafields,
      localdata: {}
    };
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.columns = [
      {
        text: 'Mã Nhân Viên',
        datafield: 'maNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '15%'
      },
      {
        text: 'Tên Nhân Viên',
        datafield: 'tenNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '30%'
      },
      {
        text: 'Số Lần Trực ',
        datafield: 'soLanTrucTrongThang',
        align: 'center',
        className: 'font-weight-bold',
        width: '55%'
      }
    ];
    const datafieldsChiTiet = [
      { name: 'maNhanVien', type: 'integer' },
      { name: 'tenNhanVien', type: 'string' },
      { name: 'tenPhongBan', type: 'string' },
      { name: 'maPhongBan', type: 'string' },
      { name: 'tenDonVi', type: 'string' },
      { name: 'ngayTruc', type: 'date', format: 'd' },
      { name: 'tenNguoiDuyet', type: 'string' }
    ];
    this.sourceChiTiet = {
      datatype: 'json',
      dataFields: datafieldsChiTiet,
      localdata: {}
    };
    this.dataAdapterChiTiet = new jqx.dataAdapter(this.sourceChiTiet);
    this.columnsChiTiet = [
      {
        text: 'Mã Nhân Viên',
        datafield: 'maNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '10%'
      },
      {
        text: 'Tên Nhân Viên',
        datafield: 'tenNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '25%',
        aggregates: [
          {
            'Số ca trực trong danh sách'(tonghopgiatri, giatrihientai) {
              if (giatrihientai) {
                return tonghopgiatri + 1;
              }
              return tonghopgiatri;
            }
          }
        ]
      },
      {
        text: 'Tên Đơn Vị',
        datafield: 'tenDonVi',
        align: 'center',
        className: 'font-weight-bold',
        width: '25%'
      },
      {
        text: 'Tên Phòng Ban',
        datafield: 'tenPhongBan',
        align: 'center',
        className: 'font-weight-bold',
        width: '20%'
      },
      {
        text: 'Ngày Trực',
        datafield: 'ngayTruc',
        cellsformat: 'dd/MM/yyyy',
        align: 'center',
        className: 'font-weight-bold',
        width: '12%'
      },
      {
        text: 'Người duyệt',
        datafield: 'tenNguoiDuyet',
        align: 'center',
        className: 'font-weight-bold',
        width: '13%'
      }
    ];
  }
  public columnHidenChangeDropDown(event) {
    this.refGrid.current.beginUpdate();
    if (event.args.checked) {
      this.refGrid.current.showColumn(event.args.value);
    } else {
      this.refGrid.current.hideColumn(event.args.value);
    }
    this.refGrid.current.endUpdate();
  }
  render() {
    const { thongkebaocao, nhanvien } = this.props;
    const chonPhongBan = (
      <div className="d-flex">
        <h5 className="p-2"><strong>THỐNG KÊ BÁO CÁO</strong></h5>
          <Row>
            <Col>
              <Input
                type="select"
                name="maPhongBan"
                style={{ height: 25, width: 'calc(100%)', padding: '0 5px 0 5px', fontSize: '15px', margin: '12px 0 0 0' }}
                onChange={this.handleInputChange}
                className="select-input-hovk"
                value={this.state.maPhongBan}
              >
                <option key={-1} value={''}>
                  --- Tất cả ---
                </option>
                {this.props.nhanvien.danhSachPhongBan
                  ? this.props.nhanvien.danhSachPhongBan.map(c => (
                    <option key={c.maPhongBan} value={c.maPhongBan} selected={this.state.phongBan === c.maPhongBan}>
                      {c.tenPhongBan}
                    </option>
                  ))
                  : ''}
              </Input>
            </Col>
          </Row>
        <div style={{ padding: '0.5rem' }}>
          {/*<Button onClick={() => this.props.initPhongBan(this.state.tuNgay, this.state.denNgay, this.state.maPhongBan)} icon="search" type="primary">*/}
          {/*</Button>*/}
        </div>
      </div>
    );
    const ChuaChonPhongBan = (
      <div className="pt-2 pb-2 pl-5 pr-5">
        <Alert type="info" message="Thông tin" showIcon description="Chọn phòng ban cần xem danh sách và click Xem !" />
      </div>
    );
    const ThongKe = (
      <div>
        <Row>
          <Col>
            <Label style={{ width: 120, fontSize: 14 }}><strong>Từ ngày:</strong></Label>
            <Input
              name="tuNgay"
              id="tuNgay"
              type="date"
              max="9999-01-01"
              style={{ height: 25, width: 'calc(100% - 10px)', padding: '0 5px 0 5px' }}
              className="p-socls"
              defaultValue={
                this.state.tuNgay ? Moment(this.state.tuNgay).format('YYYY-MM-DD') : Moment().format('YYYY-MM-DD')
              }
              onChange={this.handleInputChange}
            />
          </Col>
          <Col>
            <Label style={{ width: 120, fontSize: 14 }}><strong>Đến ngày:</strong></Label>
            <Input
              name="denNgay"
              id="denNgay"
              type="date"
              max="9999-01-01"
              style={{ height: 25, width: 'calc(100% - 10px)', padding: '0 5px 0 5px' }}
              className="p-socls"
              defaultValue={
                this.state.denNgay ? Moment(this.state.denNgay).format('YYYY-MM-DD') : Moment().format('YYYY-MM-DD')
              }
              onChange={this.handleInputChange}
            />
          </Col>
        </Row>
        <Row>
          <div style={{ margin: '10px auto' }}>
            <Button className="bg-vnptin" type="primary" icon="file"
                    loading={thongkebaocao.printting}
                    onClick={this.INCT}
            >
              <span className="align-middle">In DS Chi Tiết</span>
            </Button>
            <Button className="bg-vnptin" type="primary" icon="file"
                    loading={thongkebaocao.printting}
                    onClick={this.INTH}
            >
              <span className="align-middle">In DS Tổng Hợp</span>
            </Button>
            <Button
              className="mr-3 bg-vnptlaydulieu"
              icon="search"
              onClick={this.layDuLieuCT}
            >
              Lấy dữ liệu chi tiết
            </Button>
            <Button
              className="mr-3 bg-vnptlaydulieu"
              icon="search"
              onClick={this.layDuLieuTH}
            >
              Lấy dữ liệu tổng hợp
            </Button>
          </div>
        </Row>
        <Row>
          <Col>
            <Nav tabs style={{ fontSize: 12, backgroundColor: '#1E8AE5', color: 'white', height: 30 }} className="style-tabs">
              <NavItem
                style={{ height: 30, padding: 'auto' }}
                className={this.state.toggle === '1' ? 'style-tabs-bg-1' : 'style-tabs-bg-2'}
              >
                <NavLink
                  style={{ height: 30, padding: 4 }}
                  onClick={() => {
                    this.chuyenTab('1');
                  }}
                >
                  DS thống kê lịch trực tổng hợp
                </NavLink>
              </NavItem>
              <NavItem
                style={{ height: 30, padding: 'auto' }}
                className={this.state.toggle === '2' ? 'style-tabs-bg-1' : 'style-tabs-bg-2'}
              >
                <NavLink
                  style={{ height: 30, padding: 4 }}
                  onClick={() => {
                    this.chuyenTab('2');
                  }}
                >
                  DS thống kê lịch trực chi tiết
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.toggle}>
              <TabPane tabId = "1">
                <JqxTreeGrid
                  ref={this.refGrid}
                  source={this.dataAdapter}
                  columns={this.columns}
                  width={'100%'}
                  height={this.height}
                  pageable
                  showAggregates
                  showSubAggregates
                  aggregatesHeight={20}
                  sortable
                  theme="darkyellowlis"
                  enablebrowserselection
                  columnsHeight={20}
                  pageSize={150}
                  columnsResize
                  enableTooltips
                />
              </TabPane>
              <TabPane tabId = "2">
                <JqxTreeGrid
                  ref={this.refGridChiTiet}
                  width={'100%'}
                  height={this.height}
                  pageable
                  source={this.dataAdapterChiTiet}
                  columns={this.columnsChiTiet}
                  pageSize={150}
                  theme="darkyellowlis"
                  columnsHeight={20}
                  columnsResize
                />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    );
    return (
      <Fade bottom duration={500}>
        <div>
          {chonPhongBan}
          <hr/>
          <Fade bottom duration={1000}>
            <div>
              {ThongKe}
            </div>
          </Fade>
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (iRootState: IRootState) => ({
  thongkebaocao: iRootState.thongkebaocao,
  nhanvien: iRootState.nhanvien
});

const mapDispatchToProps = {
  getDSTenPhongBan,
  getDSThongKeChiTiet,
  getDSThongKeTongHop,
  inDSThongKe,
  inDSThongKeTH
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThongKeBaoCao);
