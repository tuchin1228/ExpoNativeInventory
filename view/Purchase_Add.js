import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    ScrollViewComponent,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import {
    useNavigation
} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default Purchase_Add = ({route}) => {
    
    const navigation = useNavigation();
    const [inputType, setInputType] = useState(false); //0手動 1掃描
    const [ean, setEan] = useState('');
    const [scan, setScan] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [productDetail, setproductDetail] = useState([]);
    const [freebie, setfreebie] = useState([]);
    const [productName, setproductName] = useState('');
    const [remark, setremark] = useState('');
    const [inTempProduct, setinTempProduct] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log('navigation', navigation);
          console.log('window.ip,', window.ip);
          GetEmployee();
          console.log('route', route);
          if (route && route.params && route.params.ean) {
            setEan(route.params.ean);
          } else {
            setproductDetail([]);
            setfreebie([]);
            setproductName('');
            setremark('');
            setinTempProduct(false);
          }
        });
    
        return unsubscribe;
    }, [navigation, route]);

    //edit有ean時撈資料
    useEffect(() => {
        if (ean && route && route.params && route.params.ean) {
        // setproductDetail([]);
        // setfreebie([]);
        // setproductName('');
        // setremark('');
        GetProduct();
        }
    }, [ean]);

    // 取得登入資訊
    const GetEmployee = async () => {
        let supplierId = await AsyncStorage.getItem('supplierId');
        let employeeId = await AsyncStorage.getItem('employeeId');
        setEmployeeId(employeeId);
        setSupplierId(supplierId);
        console.log(supplierId, employeeId);
    };

    //掃描成功撈資料
    useEffect(() => {
        //監控國際碼
        if (inputType && ean) {
        //掃描模式，隨時撈
        console.log('撈資料');
        GetProduct();
        //撈商品
        }
    }, [inputType, ean]);

    const GetProduct = async () => {
        //撈商品
        let res = null;
        console.log(
            'http://192.168.0.83/dalimarket/public/api/PhonePos/productInfo',
        );
        console.log('撈ean', ean);
        console.log(`${window.httpMethod}://${window.ip}${window.API_FOLDER}productInfo`);
        if (employeeId) {
            res = await axios.post(
            `${window.httpMethod}://${window.ip}${window.API_FOLDER}productInfo`,
            {
                ean: ean,
                employeeId: employeeId,
                billTyle: 0,
            },
            );
        } else {
            res = await axios.post(
            `${window.httpMethod}://${window.ip}${window.API_FOLDER}productInfo`,
            {
                ean: ean,
                supplierId: supplierId,
                billTyle: 0,
            },
            );
        }
        console.log(res.data);
        if (res.data.success) {
            //有新增過
            if (
            res.data.repeat &&
            res.data.tempProduct &&
            res.data.tempProduct.productDetail
            ) {
            console.log('新增過了');
            let newProductDetail = res.data.tempProduct.productDetail;
            let newFreebieDetail = res.data.freebie.productDetail;
            newProductDetail.forEach(item => {
                if (item.count) {
                item.count = JSON.stringify(item.count);
                } else {
                item.count = '';
                }
            });
            newFreebieDetail.forEach(item => {
                if (item.count) {
                item.count = JSON.stringify(item.count);
                } else {
                item.count = '';
                }
            });
            setproductDetail(newProductDetail);
            setfreebie(newFreebieDetail);
            setproductName(res.data.tempProduct.name);
            setremark(res.data.tempProduct.remark);
            setinTempProduct(true);
            console.log(
                '新增過productDetail',
                productDetail,
                res.data.freebie.productDetail,
            );
            } else {
            //沒新增過
            res.data.product.forEach(item => {
                item.count = 0;
            });
            setproductDetail(JSON.parse(JSON.stringify(res.data.product)));
            setfreebie(JSON.parse(JSON.stringify(res.data.product)));
            setproductName(res.data.productName);
            setinTempProduct(false);
            }
        } else {
            alert(res.data.msg);
        }

        // console.log(res);
    };

    
    //掃描、手動切換
    const changeInputMethod = type => {
        //手動、掃描切換
        if (type) {
        setInputType(true);
        setScan(true);
        } else {
        setInputType(false);
        setScan(false);
        }
    };

    
  // 計算商品總數(最小pp)
  const arrCount = productDetail.map(item => item.count);
  const CalcCount = (idx, count) => {
    let tempProductDetail = [...productDetail];
    tempProductDetail[idx].count = count;
    setproductDetail(tempProductDetail);
    console.log(productDetail);
  };
  const AllCount = useMemo(() => {
    console.log('算總量');
    let total = 0;
    // return arrCount.reduce((pre, cur) => Number(pre) + Number(cur * ), 0);
    productDetail.forEach(item => {
      if (parseInt(item.count)) {
        total += parseInt(item.count) * parseInt(item.pp);
      }
    });
    return total;
  }, [arrCount]);

  //計算贈品總數
  const arrFreebieCount = freebie.map(item => item.count);
  const CalcFreebieCount = (idx, count) => {
    let tempFreebieDetail = [...freebie];
    tempFreebieDetail[idx].count = count;
    setfreebie(tempFreebieDetail);
    console.log(freebie);
  };
  const AllFreebieCount = useMemo(() => {
    console.log('算總量');
    let total = 0;
    freebie.forEach(item => {
      if (parseInt(item.count)) {
        total += parseInt(item.count) * parseInt(item.pp);
      }
    });
    return total;
  }, [arrFreebieCount]);

  //監控是否顯示備註
  const arrProductDetail = productDetail.map(item => item.count);
  const arrFreebieDetail = freebie.map(item => item.count);
  const ShowRemark = useMemo(() => {
    let rt = false;
    for (let i = 0; i < productDetail.length; i++) {
      if (Number(productDetail[i].count) > 0) {
        rt = true;
        break;
      }
    }
    if (rt) {
      return true;
    }
    for (let i = 0; i < freebie.length; i++) {
      if (Number(freebie[i].count) > 0) {
        rt = true;
        break;
      }
    }
    return rt;
  }, [arrProductDetail, arrFreebieDetail]);

  //取得商品最小pp單位
  const ProductPP = productDetail.map(item => item.pp);
  const ProductUnit = useMemo(() => {
    let pp = null;
    let unit = '';
    productDetail.forEach(item => {
      if (pp == null) {
        pp = item.pp;
        unit = item.unit;
      } else if (pp > item.pp) {
        pp = item.pp;
        unit = item.unit;
      }
    });
    console.log('單位', unit);
    return unit;
  }, [ProductPP]);

  // 送出到暫存
  const SubmitPurchase = async () => {
    let d = formatDate(new Date());
    let res = null;
    if (employeeId) {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}storeTemp`, {
          employeeId: employeeId,
          addtime: d,
          productId: productDetail[0].productId,
          billTyle: 0,
          sell: {
            remark: remark,
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: productDetail[0].unit,
            minPP: productDetail[0].pp,
            minQuity: parseInt(productDetail[0].count, 10),
            maxUnit:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].unit
                : null,
            maxPP:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].pp
                : null,
            maxQuity:
              productDetail &&
              productDetail.length > 1 &&
              productDetail[productDetail.length - 1].count
                ? parseInt(productDetail[productDetail.length - 1].count, 10)
                : null,
            productSupplierId: productDetail[0].supplierId, //員工進貨，要存商品報價廠商
          },
          freebie: {
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: freebie[0].unit,
            minPP: freebie[0].pp,
            minQuity: parseInt(freebie[0].count, 10),
            maxUnit:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].unit
                : null,
            maxPP:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].pp
                : null,
            maxQuity:
              freebie && freebie.length > 1 && freebie[freebie.length - 1].count
                ? parseInt(freebie[freebie.length - 1].count, 10)
                : null,
          },
        })
        .catch(error => {
          alert('新增失敗');
        });
    } else {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}storeTemp`, {
          supplierId: supplierId,
          addtime: d,
          productId: productDetail[0].productId,
          billTyle: 0,
          sell: {
            remark: remark,
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: productDetail[0].unit,
            minPP: productDetail[0].pp,
            minQuity: parseInt(productDetail[0].count, 10),
            maxUnit:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].unit
                : null,
            maxPP:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].pp
                : null,
            maxQuity:
              productDetail &&
              productDetail.length > 1 &&
              productDetail[productDetail.length - 1].count
                ? parseInt(productDetail[productDetail.length - 1].count, 10)
                : null,
          },
          freebie: {
            // quoteMinPrice: 0,
            // quoteMaxPrice: 0,
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: freebie[0].unit,
            minPP: freebie[0].pp,
            minQuity: parseInt(freebie[0].count, 10),
            maxUnit:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].unit
                : null,
            maxPP:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].pp
                : null,
            maxQuity:
              freebie && freebie.length > 1 && freebie[freebie.length - 1].count
                ? parseInt(freebie[freebie.length - 1].count, 10)
                : null,
          },
        })
        .catch(error => {
          alert('新增失敗');
        });
      // console.log('res',res);
    }

    console.log(res);

    if (res.data.success) {
      handleNotification();
      alert('新增成功');
      setEan('');
      setproductDetail([]);
      setfreebie([]);
      setinTempProduct(false);
      setproductName('');
      setremark('');
    }
  };
  
  
  //整理時間格式
  const formatDate = date => {
    var date = new Date(date);
    var YY = date.getFullYear();
    var MM =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hh =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':';
    var ss =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return YY + '-' + MM + '-' + DD + ' ' + hh + mm + ss;
  };

  //更新暫存
  const UpdateProduct = async () => {
    let d = formatDate(new Date());
    let res = null;
    if (employeeId) {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}updateTemp`, {
          employeeId: employeeId,
          addtime: d,
          productId: productDetail[0].productId,
          billTyle: 0,
          sell: {
            quoteMinPrice: productDetail[0].quoteMinPrice,
            quoteMaxPrice: productDetail[0].quoteMaxPrice,
            remark: remark,
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: productDetail[0].unit,
            minPP: productDetail[0].pp,
            minQuity: parseInt(productDetail[0].count, 10),
            maxUnit:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].unit
                : null,
            maxPP:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].pp
                : null,
            maxQuity:
              productDetail &&
              productDetail.length > 1 &&
              productDetail[productDetail.length - 1].count
                ? parseInt(productDetail[productDetail.length - 1].count, 10)
                : null,
            productSupplierId: productDetail[0].supplierId, //員工進貨，要存商品報價廠商
          },
          freebie: {
            quoteMinPrice: 0,
            quoteMaxPrice: 0,
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: freebie[0].unit,
            minPP: freebie[0].pp,
            minQuity: parseInt(freebie[0].count, 10),
            maxUnit:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].unit
                : null,
            maxPP:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].pp
                : null,
            maxQuity:
              freebie && freebie.length > 1 && freebie[freebie.length - 1].count
                ? parseInt(freebie[freebie.length - 1].count, 10)
                : null,
          },
        })
        .catch(error => {
          alert('更新失敗');
        });
    } else {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}updateTemp`, {
          supplierId: supplierId,
          addtime: d,
          productId: productDetail[0].productId,
          billTyle: 0,
          sell: {
            quoteMinPrice: productDetail[0].quoteMinPrice,
            quoteMaxPrice: productDetail[0].quoteMaxPrice,
            remark: remark,
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: productDetail[0].unit,
            minPP: productDetail[0].pp,
            minQuity: parseInt(productDetail[0].count, 10),
            maxUnit:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].unit
                : null,
            maxPP:
              productDetail && productDetail.length > 1
                ? productDetail[productDetail.length - 1].pp
                : null,
            maxQuity:
              productDetail &&
              productDetail.length > 1 &&
              productDetail[productDetail.length - 1].count
                ? parseInt(productDetail[productDetail.length - 1].count, 10)
                : null,
            productSupplierId: productDetail[0].supplierId, //員工進貨，要存商品報價廠商
          },
          freebie: {
            quoteMinPrice: 0,
            quoteMaxPrice: 0,
            billTyle: 0,
            ean: ean,
            name: productName,
            minUnit: freebie[0].unit,
            minPP: freebie[0].pp,
            minQuity: parseInt(freebie[0].count, 10),
            maxUnit:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].unit
                : null,
            maxPP:
              freebie && freebie.length > 1
                ? freebie[freebie.length - 1].pp
                : null,
            maxQuity:
              freebie && freebie.length > 1 && freebie[freebie.length - 1].count
                ? parseInt(freebie[freebie.length - 1].count, 10)
                : null,
          },
        })
        .catch(error => {
          alert('更新失敗');
        });
    }
    console.log(res);
    if (res.data.success) {
      alert('更新成功');
      // const urlSearchParams = new URLSearchParams(window.location.search);
      // const params = Object.fromEntries(urlSearchParams.entries());
      if (route && route.params && route.params.ean) {
        //往只有ean 轉回原本沒ean的
        // location.href = './Purchase.html';
        navigation.navigate('Purchase_List', {
          routeName: 'Purchase_List',
          ean: ean,
          transitionStyle: 'horizontal',
        });
      }
      // barcode = '';
      // productDetail = [];
      // inTempProduct = false;
      // productName = '';
      // remark = '';
      setEan('');
      setproductDetail([]);
      setfreebie([]);
      setinTempProduct(false);
      setproductName('');
      setremark('');
    }
  };

  const RemoveProduct = async () => {
    let res = null;
    if (employeeId) {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}removeTemp`, {
          employeeId: employeeId,
          ean: ean,
          billTyle: 0,
        })
        .catch(error => {
          alert('刪除失敗');
        });
    } else {
      res = await axios
        .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}removeTemp`, {
          supplierId: supplierId,
          ean: ean,
          billTyle: 0,
        })
        .catch(error => {
          alert('刪除失敗');
        });
    }
    console.log(res);
    if (res.data.success) {
      alert('成功刪除');
      setEan('');
      setproductDetail([]);
      setfreebie([]);
      setinTempProduct(false);
      setproductName('');
      setremark('');
    }
  };
  
  
  return (
    <>
    </>
  );
    
};



const styles = StyleSheet.create({
    FlexContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    FixTab: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        alignSelf: 'flex-end',
        flex: 1,
        flexDirection: 'row',
        borderRadius: 0,
    },
    FixTabBtnContainer: {
        width: '50%',
        backgroundColor: '#3dbf47',
        paddingVertical: 10,
    },
    FixTabBtn: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    TextLabel: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        padding: 7,
        fontSize: 15,
        borderColor: '#bebebe',
    },
    SearchInput: {
        width: '100%',
        margin: 0,
    },
    SearchContainer: {
        backgroundColor: '#007eff',

        margin: 0,
        marginBottom: 15,
        width: '100%',
        padding: 10,
    },
    SearchBtn: {
        margin: 0,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ScanBtnContainer: {
        backgroundColor: '#9c9c9c',
        paddingVertical: 10,
        marginTop: 5,
        marginBottom: 15,
        width: '50%',
    },
    ScanBtn: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionContainer: {
        marginTop: 32,
    },
    buttonTouchable: {
        padding: 16,
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    CloseScanButtonSection: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CloseScanButton: {
        backgroundColor: 'red',
        fontSize: 20,
        color: 'white',
        padding: 10,
        borderRadius: 5,
    },
});