import React, {useState, useEffect, useMemo, useRef} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner'


export default Inventory_Add = ({route}) => {

    const navigation = useNavigation();
    const [inputType, setInputType] = useState(false); //0手動 1掃描
    const [ean, setEan] = useState('');
    const [area, setArea] = useState([]); //盤點區域
    const [ActiveArea, setActiveArea] = useState(''); //選擇的盤點區域
    const [product, setProduct] = useState([]); //更新盤點商品
    const [productId, setProductId] = useState(''); //
    const [productDetailId, setProductDetailId] = useState(''); //
    const [scan, setScan] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [productDetail, setproductDetail] = useState([]);
    const [freebie, setfreebie] = useState([]);
    const [productName, setproductName] = useState('');
    const [remark, setremark] = useState('');
    const [inTempProduct, setinTempProduct] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const pickerRef = useRef();
    const [cameraStatus,setCameraStatus] = useState(false); //相機開啟狀態
    const [hasPermission, setHasPermission] = useState(null);//相機允許狀態
    const [scanned, setScanned] = useState(false);//相機掃描狀態

    
    // 準備相機
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // 相機掃描動作
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(`成功掃描國際碼 ${data} `);
        // setScanData(data)
        let str = data.toString();
        setEan(str);
        setScanned(false);
        setCameraStatus(false)
            
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log('window.ip,', window.ip);
          GetEmployee();
          console.log('route', route);
          GetInvArea();
          if (route && route.params && route.params.ean) {
            setEan(route.params.ean);
            setProductId(route.params.productId);
            setActiveArea(route.params.areaId);
            setProductDetailId(route.params.productDetailId);
          } else if (
            route &&
            route.params &&
            route.params.productId &&
            route.params.areaId &&
            route.params.productDetailId
          ) {
            setEan(route.params.productDetailId);
            setProductId(route.params.productId);
            setActiveArea(route.params.areaId);
            setProductDetailId(route.params.productDetailId);
          } else {
            setEan('');
            setProductId('');
            setActiveArea('');
            setProductDetailId('');
            setProduct([]);
            setproductName('');
            setinTempProduct(false);
          }
        });
        return unsubscribe;
      }, [navigation, route]);
    

      //切換盤點區域撈資料
      useEffect(() => {
        console.log('切換盤點區域撈資料');
        ActiveArea && ean ? GetProduct() : null; 
      }, [ActiveArea]);
    
      //撈盤點區域
      const GetInvArea = async () => {
        let res = await axios.get(
          `${window.httpMethod}://${window.ip}${window.API_FOLDER}inventoryArea`,
        );
        console.log(res);
        if (res.data.success) {
          setArea(res.data.area);
          setActiveArea(res.data.area[0].id);
        }
      };
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
        console.log('掃描成功撈資料');
        if (inputType && ean) {
          //掃描模式，隨時撈
          console.log('撈資料');
        //   GetProduct();
          //撈商品
        }
      }, [inputType, ean]);
    
      const GetProduct = async () => {
        //撈商品
        let res = null;
        // console.log(
        //   'http://192.168.0.83/dalimarket/public/api/PhonePos/productInfo',
        // );
        res = await axios.post(
          `${window.httpMethod}://${window.ip}${window.API_FOLDER}inventoryInfo`,
          {
            employeeId: employeeId,
            areaId: ActiveArea,
            productId: productId,
            ean: ean,
          },
        );
        console.log('res', res);
    
        if (res.data.success) {
          //有新增過
          if (res.data.repeat) {
            console.log('新增過了', res.data.product);
            let newProduct = res.data.product;
            newProduct.forEach(item => {
              if (item.count) {
                item.count = JSON.stringify(item.count);
              } else {
                item.count = '';
              }
            });
            setinTempProduct(true);
    
            setProduct(newProduct);
            setproductName(res.data.productName);
          } else {
            //沒新增過
            setProduct(res.data.product);
            setproductName(res.data.productName);
            setinTempProduct(false);
          }
        } else {
          alert(res.data.msg);
        }
    
        // console.log(res);
      };
    
  // 計算商品總數(最小pp)
  const arrCount = product.map(item => item.count);
  const CalcCount = (idx, count) => {
    let tempProductDetail = [...product];
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
  const arrProductDetail = product.map(item => item.count);
  //   const arrFreebieDetail = freebie.map(item => item.count);
  const ShowRemark = useMemo(() => {
    let rt = false;
    for (let i = 0; i < product.length; i++) {
      if (Number(product[i].count) > 0) {
        rt = true;
        break;
      }
    }
    return rt;
  }, [arrProductDetail]);

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
  const SubmitInventory = async () => {
    if (!ean) {
      return null;
    }
    let res = await axios
      .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}inventoryTemp`, {
        employeeId: employeeId,
        product: product,
        area: ActiveArea,
      })
      .catch(err => {
        alert('新增錯誤');
      });
    console.log('res', res);
    if (res.data.success) {
      alert('新增成功');
      GetProduct();
      setinTempProduct(false);
    } else {
      alert('新增錯誤');
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
    if (!ean) {
      return null;
    }
    let res = await axios
      .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}update_inventoryTemp`, {
        employeeId: employeeId,
        product: product,
        area: ActiveArea,
      })
      .catch(err => {
        alert('更新錯誤');
      });
    console.log('res', res);
    if (res.data.success) {
      alert('更新成功');
      GetProduct();
      setinTempProduct(false);
    } else {
      alert('更新錯誤');
    }
  };

  const RemoveProduct = async () => {
    let res = await axios
      .post(`${window.httpMethod}://${window.ip}${window.API_FOLDER}delete_inventoryTemp`, {
        employeeId: employeeId,
        area: ActiveArea,
        productId: product[0].productId,
      })
      .catch(err => {
        alert('移除錯誤');
      });
    console.log(res);
    if (res.data.success) {
      GetProduct();
      setinTempProduct(false);
    } else {
      alert('移除錯誤');
    }
  };

  return (
    <>
      {cameraStatus ? (
        <Text />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 5,
            paddingTop: 10,
            paddingBottom: 50,
          }}>
          <View style={styles.FlexContainer}>
            <TouchableOpacity
              style={[
                styles.ScanBtnContainer,
                inputType ? {} : {backgroundColor: '#3dbf47'},
              ]}
              onPress={() => changeInputMethod(false)}>
              <Text style={styles.ScanBtn}>手動輸入</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ScanBtnContainer,
                inputType ? {backgroundColor: '#3dbf47'} : {},
              ]}
              onPress={() => setCameraStatus(true)}>
              <Text style={styles.ScanBtn}>掃描條碼</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.TextLabel}>國際碼：</Text>
          <View>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setEan(text)}
              editable={!inputType}
              value={ean}
              keyboardType="number-pad"
            />
            {!inputType ? (
              <TouchableOpacity
                style={styles.SearchContainer}
                onPress={() => GetProduct()}>
                <Text style={[styles.SearchBtn]}>搜尋</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={{marginVertical: 10}}>
            <View
              style={{
                padding: 5,
                borderWidth: 1,
                borderColor: '#cbcbcb',
                borderRadius: 5,
              }}>
              <Text style={styles.TextLabel}>商品名稱：</Text>
              <TextInput
                style={[styles.input, styles.SearchInput, {color: 'red'}]}
                editable={false}
                value={productName}
              />
            </View>

            <View
              style={{
                marginTop: 10,
                paddingHorizontal: 5,
                borderWidth: 1,
                borderColor: '#cbcbcb',
                borderRadius: 5,
              }}>
              <Text style={[styles.TextLabel]}>商品數量：</Text>
              <View style={{marginBottom: 10}} />
              {product ? (
                product.map((item, idx) => {
                  return (
                    <View style={{paddingVertical: 5}} key={idx}>
                      <Text style={{fontSize: 16}}>
                        ({item.unit} * {item.pp}入)：{productName}
                      </Text>
                      <TextInput
                        style={[styles.input, styles.SearchInput]}
                        onChangeText={text => CalcCount(idx, text)}
                        keyboardType="number-pad"
                        value={item.count ? item.count : ''}
                        placeholder={'數量(' + item.unit + ')'}
                      />
                    </View>
                  );
                })
              ) : (
                <Text />
              )}
              {AllCount ? (
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    paddingVertical: 10,
                  }}>
                  總數 {AllCount}
                  {ProductUnit}
                </Text>
              ) : (
                <Text />
              )}
            </View>
            <View
              style={{
                marginTop: 10,
                paddingHorizontal: 5,
                borderWidth: 1,
                borderColor: '#cbcbcb',
                borderRadius: 5,
              }}>
              <Text style={[styles.TextLabel]}>商品區域：</Text>
              <View style={{marginBottom: 10}} />

              {area ? (
                <>
                  <Picker
                    ref={pickerRef}
                    selectedValue={ActiveArea}
                    onValueChange={(itemValue, itemIndex) =>
                      setActiveArea(itemValue)
                    }>
                    {area.map(item => {
                      return <Picker.Item label={item.area} value={item.id} key={item.id} />;
                    })}
                  </Picker>
                </>
              ) : (
                <Text />
              )}
            </View>
          </View>

          <View style={{marginTop: 10}}>
            {!inTempProduct ? (
              <TouchableOpacity
                style={[
                  styles.SearchContainer,
                  {
                    backgroundColor: 'red',
                    borderRadius: 5,
                    paddingVertical: 15,
                  },
                ]}
                onPress={() => SubmitInventory()}>
                <Text style={[styles.SearchBtn]}>送出</Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[
                    styles.SearchContainer,
                    {
                      backgroundColor: '#fbbf24',
                      borderRadius: 5,
                      paddingVertical: 15,
                      width: '49%',
                    },
                  ]}
                  onPress={() => UpdateProduct()}>
                  <Text style={[styles.SearchBtn, {color: 'black'}]}>編輯</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.SearchContainer,
                    {
                      backgroundColor: '#6b7280',
                      borderRadius: 5,
                      paddingVertical: 15,
                      width: '49%',
                    },
                  ]}
                  onPress={() => RemoveProduct()}>
                  <Text style={[styles.SearchBtn]}>刪除</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
      {cameraStatus ? (
        <>
             <View style={styles.sectionContainer}>
                <Camera style={styles.camera} 
                    flashMode="torch"
                    type={Camera.Constants.Type.back}
                    barCodeScannerSettings={{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
                    }}
                    onBarCodeScanned={handleBarCodeScanned}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setType(type === CameraType.back ? CameraType.front : CameraType.back);
                    }}>
                    <Text style={styles.text}> Flip </Text>
                    </TouchableOpacity>
                </View>
                </Camera>
            </View>
            
            <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setCameraStatus(false)}>
                <Text style={styles.buttonText}>關閉掃描</Text>
            </TouchableOpacity>
        </>
      ) : (
        <Text />
      )}

      {/* 底部連結 */}
      <View style={{flex: 1}}>
        <View style={styles.FixTab}>
          <TouchableOpacity
            style={styles.FixTabBtnContainer}
            onPress={() =>
              navigation.navigate('Home', {
                routeName: 'Home',
                transitionStyle: 'horizontal',
              })
            }>
            <Text style={styles.FixTabBtn}>首頁</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.FixTabBtnContainer}
            onPress={() => {
              setEan('');
              navigation.navigate('Inventory_List', {
                routeName: 'Inventory_List',
                transitionStyle: 'horizontal',
              });
            }}>
            <Text style={styles.FixTabBtn}>盤點紀錄</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        //marginTop: 32,
        flex: 1,
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
    camera: {
        flex: 1,
    },
  });