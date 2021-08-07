import { createStyles, Theme } from '@material-ui/core/styles';

export default ({ palette, spacing, breakpoints }: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    listTable: {
      paddingTop: spacing.unit * 4
    },
    narrowCell: {
      fontSize: '12px'
    },
    narrowCellText: {
      fontSize: '12px'
    },
    footerPrimaryTextColor: {
      color: '#ffffff'
    },
    footerAlignCenter: {
      textAlign: 'center'
    },
    textAlignRight: {
      textAlign: 'right',
      padding: '10px'
    },
    textAlignCenter: {
      textAlign: 'center',
      padding: '10px'
    },
    nameHuman: {
      fontSize: '12px'
    },
    paper: {
      padding: '20px',
      marginTop: '10px'
    },
    girdLuuTru: {
      marginTop: '5px'
    },
    paperTab: {
      padding: '0px',
      marginTop: '10px',
      width: '100%',
      overflowX: 'auto'
    },
    paddingDefault: {
      padding: '0px',
      minWidth: '300px'
    },
    addrHuman: {
      width: '200px'
    },
    tableCell: {
      fontSize: '12px'
    },
    rowCell: {
      width: '80px'
    },
    phongKham: {
      width: '350px'
    },
    nested: {
      paddingLeft: 50
    },
    nestedsub: {
      paddingLeft: 70
    },
    banner: {
      width: '100%',
      height: '600px'
    },
    table: {
      minWidth: '100%'
    },
    tableDanhSach: {
      width: '100%',
      fontSize: '10px !important'
    },
    paperTable: {
      width: '100%',
      overflowX: 'auto',
      marginTop: '10px'
    },
    appbar: {
      width: '100%',
      overflowX: 'auto'
    },
    minwidth: {
      minWidth: '800px'
    },
    numberRight: {
      textAlign: 'right'
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    textField: {
      marginLeft: spacing.unit,
      marginRight: spacing.unit
    },
    dense: {
      marginTop: 16
    },
    menu: {
      width: 200
    },
    mauxanh: {
      backgroundColor: '#33CCFF',
      textAlign: 'center',
      padding: '5px',
      color: 'white',
      borderRadius: '5px'
    },
    maudo: {
      backgroundColor: '#FF3333',
      textAlign: 'center',
      padding: '5px',
      color: 'white',
      borderRadius: '5px'
    },
    maulacay: {
      backgroundColor: '#33FF99',
      textAlign: 'center',
      padding: '5px',
      color: 'white',
      borderRadius: '5px'
    },
    paddingBt: {
      padding: '5px'
    },
    back: {
      padding: '5px',
      marginTop: '10px',
      textAlign: 'right'
    },
    paperTableDv: {
      height: '600px',
      overflowX: 'auto'
    },
    td: {
      fontSize: '12px',
      width: 'auto'
    }
  });
