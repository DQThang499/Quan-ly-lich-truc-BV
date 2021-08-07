import React, { createRef } from 'react';
import { Row, Col, Input, Label, CardBody, CardHeader } from 'reactstrap';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react/react_jqxgrid';
import { IRootState } from 'app/shared/reducers';
import JqxRadioButton from 'jqwidgets-scripts/jqwidgets-react/react_jqxradiobutton.js';
import 'app/modules/danhmuc/nhanvien.scss';
import 'app/shared/layout/theme/darkyellowlis.scss';
import { getDSTenPhongBanDG, getDSDanhGia } from 'app/shared/reducers/danhmuc/danhgia';
import Thongtinchitiet from 'app/modules/danhmuc/thongtinchitiet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

export interface IDanhGiaProp extends StateProps, DispatchProps {}
export interface IDanhGiaState {
  dsDanhGiaInfo: any;
  phongBan: any;
  dstenPBSelect: any;
  disabledField: any;
  disabledThem: any;
  disabledXoa: any;
  disabledSua: any;
  disabledHuy: any;
  disabledLuu: any;
}

class DanhGia extends React.Component<IDanhGiaProp, IDanhGiaState> {
  private refGridDMDanhGia = createRef<JqxGrid>();
  private dataAdapter;
  private columns;
  private source;
  constructor(props) {
    super(props);
    this.state = {
      dsDanhGiaInfo: {
        maDanhGia: '',
        maNhanVien: '',
        tenPhongBan: '',
        Thang: '',
        Nam: '',
        ngayTruc: '',
        moTa: '',
        nhanXet: '',
        chuThich: '',
        maPhongBan: ''
      },
      dstenPBSelect: [],
      phongBan: '',
      disabledField: true,
      disabledThem: false,
      disabledLuu: true,
      disabledSua: true,
      disabledXoa: true,
      disabledHuy: true,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    this.initDataAdapter();
  }

  componentDidMount() {
    this.props.getDSTenPhongBanDG();
    this.props.getDSDanhGia(this.state.dsDanhGiaInfo.maPhongBan);
    this.refGridDMDanhGia.current.on('rowselect', this.onRowSelect);
  }
  componentWillReceiveProps(nextProps: Readonly<IDanhGiaProp>, nextContext: any) {
    if (this.props.danhgia.danhSachPhongBan !== nextProps.danhgia.danhSachPhongBan && nextProps.danhgia.danhSachPhongBan) {
      this.setState({ dstenPBSelect: nextProps.danhgia.danhSachPhongBan });
      // const log = nextProps.danhgia.danhSachPhongBan;
      // console.log(log);
    }
    if (this.props.danhgia.danhSachDanhGia !== nextProps.danhgia.danhSachDanhGia ){
      this.source.localdata = nextProps.danhgia.danhSachDanhGia;
      this.refGridDMDanhGia.current.updatebounddata('cells');
      const index = this.refGridDMDanhGia.current.getselectedrowindex();
      if (index > -1){
        this.refGridDMDanhGia.current.unselectrow(index);
      }
    }
  }

  onRowSelect = event => {
    const index = event.args.rowindex;
    const row = this.refGridDMDanhGia.current.getrowdata(index);
    const entity = {
      ...row
    };
    const temp = { ...this.state.dsDanhGiaInfo };
    temp['maDanhGia'] = entity.maDanhGia;
    temp['tenPhongBan'] = entity.tenPhongBan;
    temp['maPhongBan'] = entity.maPhongBan;
    temp['Thang'] = entity.Thang;
    temp['Nam'] = entity.Nam;
    temp['ngayTruc'] = entity.ngayTruc;
    temp['maNhanVien'] = entity.maNhanVien;
    temp['moTa'] = entity.moTa;
    temp['nhanXet'] = entity.nhanXet;
    temp['chuThich'] = entity.chuThich;

    this.setState({
      dsDanhGiaInfo: { ...temp }
    });

    this.setState({
      dsDanhGiaInfo: { ...temp },
      disabledField: true
    });
  }
  handleInputChange (event) { // target cho từng ô input
    const target = event.target;
    const name = target.name; // mỗi ô input đc phân biệt dựa vào name
    const value = target.value; // mỗi ô input đc phân biệt dựa vào value
    const temp = this.state.dsDanhGiaInfo;
    temp[name] = value;
    this.setState({ dsDanhGiaInfo: temp });
  }
  handlekeyboardnavigation(event) {
    const index = this.refGridDMDanhGia.current.getselectedrowindex();
    if (event.keyCode === 40 && index < this.refGridDMDanhGia.current.getrows().length - 1) {
      event.preventDefault();
      this.refGridDMDanhGia.current.selectrow(index + 1);
      this.refGridDMDanhGia.current.ensurerowvisible(index + 1);
    }
    if (event.keyCode === 38 && index > 0) {
      event.preventDefault();
      this.refGridDMDanhGia.current.selectrow(index - 1);
      this.refGridDMDanhGia.current.ensurerowvisible(index - 1);
    }

    event.stopPropagation();
  }
  public initDataAdapter(){
    const datafields = [
      { name: 'maDanhGia', type: 'integer' },
      { name: 'tenNhanVien', type: 'string' },
      { name: 'maPhongBan', type: 'string' },
      { name: 'tenPhongBan', type :'string' },
      { name: 'Thang', type: 'integer'},
      { name: 'Nam', type: 'integer'},
      { name: 'ngayTruc', type: 'date', format: 'd'},
      { name: 'moTa', type: 'string' },
      { name: 'chuThich' , type: 'string'},
    ];
    this.source = {
      datatype: 'json',
      datafields,
      localdata: {}
    };
    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.columns = [ // tạo dòng
      {        text: 'Mã Đánh Giá',
        datafield: 'maDanhGia',
        align: 'center',
        className: 'font-weight-bold',
        width: '6%'      },
      {        text: 'Tên Nhân Viên',
        datafield: 'tenNhanVien',
        align: 'center',
        className: 'font-weight-bold',
        width: '20%',
        aggregates: [
          {
            'Tổng số dòng'(aggregatedValue, currentValue) {
              if (currentValue) {
                return aggregatedValue + 1;
              }
              return aggregatedValue;
            }
          }
        ]
      },
      { text: 'Tên Phòng Ban',
        datafield: 'tenPhongBan',
        align: 'center', className: 'font-weight-blod', width: '15%'
      },
      {        text: 'Tháng',
        datafield: 'Thang',
        align: 'center',
        className: 'font-weight-bold',
        width: '5%'
      },
      {        text: 'Năm',
        datafield: 'Nam', align: 'center', className: 'font-weight-bold',
        width: '5%'
      },
      {        text: 'Ngày Trực',
        datafield: 'ngayTruc', align: 'center', className: 'font-weight-bold',
        width: '10%',
        cellsformat: 'dd/MM/yyyy'
      },
      { text: 'Mô Tả',
        datafield: 'moTa',
        align: 'center',
        className: 'font-weight-bold',
        width: '20%' },
      { text: 'Chú Thích',
        datafield: 'chuThich',
        align: 'center',
        className: 'font-weight-bold',
        width: '25%' }
    ];
  }

  render() {
    return (
      <div>
        <Row>
          <Col md="8">
            <div className="line-dsxn-dmxn">
              <h6>
                <h4>Test github<h4>
                <FontAwesomeIcon icon={faClipboardList} /> Danh sách xét nghiệm
              </h6>
            </div>
            {/* <div className="height-div-scroll" id="style-1">*/}
            <JqxGrid
              ref={this.refGridDMDanhGia}
              // showtoolbar={true}
              filterable
              showfilterrow
              source={this.dataAdapter}
              columns={this.columns}
              width={'100%'}
              height={450}
              theme="darkyellowlis"
              showgroupaggregates
              showstatusbar
              showaggregates
              statusbarheight={22}
              rowsheight={25}
              columnsheight={20}
              filterrowheight={30}
              // pageable
              // autorowheight
              // autoheight
              enabletooltips
              enablebrowserselection
              keyboardnavigation={false}
              handlekeyboardnavigation={this.handlekeyboardnavigation}
              sortable
            />
            {/* </div>*/}
          </Col>
          <Col md="4">
            <Thongtinchitiet />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (iRootState: IRootState) => ({
  iRootState,
  danhgia : iRootState.danhgia
});

const mapDispatchToProps = {
  getDSTenPhongBanDG,
  getDSDanhGia
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DanhGia);
