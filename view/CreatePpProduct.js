import React, {useEffect, useState, useMemo, useRef} from 'react';
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
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default CreateProduct= ({route}) => {

    const navigation = useNavigation();
  const [scan, setScan] = useState(false);
  const [MainScan, setMainScan] = useState(false);
  const [cate_main, setcate_main] = useState([]);
  const [cate_mid, setcate_mid] = useState([]);
  const [cate_kid, setcate_kid] = useState([]);

  const [MainMethod, setMainMethod] = useState(false);
  const [productHistory, setproductHistory] = useState([]);
  const [productDetailArray, setproductDetailArray] = useState([]);

  const [productSearch, setproductSearch] = useState([]);
  const [keyword, setkeyword] = useState('');
  const [ean, setEan] = useState('');
  const [productId, setproductId] = useState('');
  const [productName, setProductName] = useState('');
  const [select_main, setselect_main] = useState('');
  const [mainName, setmainName] = useState('');
  const [select_mid, setselect_mid] = useState('');
  const [select_kid, setselect_kid] = useState('');
  const [productDetailId, setproductDetailId] = useState('');
  const [specification, setspecification] = useState('');
  const [unit, setunit] = useState('');
  const [pp, setpp] = useState('');
  const [price, setprice] = useState('');
  const [taxType, settaxType] = useState(1);
  const [inputType, setInputType] = useState(false); //0手動 1掃描
  const MainpickerRef = useRef();
  const MidpickerRef = useRef();
  const KidpickerRef = useRef();

  const [editMode, setEditMode] = useState(false);
  const [editDetailId, setEditDetailId] = useState('');

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

    useEffect(()=>{
    console.log('cameraStatus變',cameraStatus);
    },[cameraStatus])

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
          GetProductHistory();
          // GetDiscardList();
        });
        return unsubscribe;
    }, [navigation, route]);


    //主檔選擇方式
    const changeMainMethod = type => {
        endEdit();
        setmainName('');
        setproductDetailArray([]);
        setselect_main('');
        setMainMethod(type);
        // if (!type) {
        //   GetProductHistory();
        // }
    };

    
  const SubmitCreateProduct = async () => {
    console.log(
      '建子檔',
      `${window.httpMethod}://${window.ip}${window.API_FOLDER}createPpProductpost`,
    );
    if (!select_main || !productName || !ean || !unit || !pp || !price) {
      console.log('格式錯誤');
      alert('格式錯誤!');
      return null;
    }
    console.log('格式正確');
    // console.log(
    //   'ean',
    //   ean,
    //   'productName',
    //   productName,
    //   'productDetailId',
    //   productDetailId,
    //   'specification',
    //   specification,
    //   'unit',
    //   unit,
    //   'pp',
    //   pp,
    //   'price',
    //   price,
    //   'taxType',
    //   taxType,
    //   'cateMainId',
    //   select_main,
    //   'cateMidId',
    //   select_mid,
    //   'cateKidId',
    //   select_kid,
    // );
    let res = await axios
      .post(
        `${window.httpMethod}://${window.ip}${window.API_FOLDER}createPpProductpost`,
        {
          ean: ean,
          productName: productName,
          productId: select_main, //主檔productId
          // productDetailId: productDetailId,
          specification: specification ? specification : '',
          unit: unit,
          pp: pp,
          price: price,
          taxType: taxType,
        },
      )
      .catch(err => {
        console.log('500拉', err);
        alert('不知名錯誤');
      });
    console.log(res);
    console.log(res.data);
    if (res.data.success) {
      alert('建檔成功');
      clearData();
      setkeyword('');
      // setproductDetailId(`${Math.round(new Date().getTime()) * 2}`);
      GetProductHistory();
      // navigation.navigate('Home', {
      //   routeName: 'Home',
      //   transitionStyle: 'horizontal',
      // });
    } else {
      alert('國際碼重複');
    }
  };

  //取的主檔紀錄
  const GetProductHistory = async () => {
    console.log(
      '撈api',
      `${window.httpMethod}://${window.ip}${window.API_FOLDER}GetProductHistory`,
    );
    let res = await axios.get(
      `${window.httpMethod}://${window.ip}${window.API_FOLDER}GetProductHistory`,
    );
    console.log(res.data);
    if (res.data.success) {
      setproductHistory(res.data.history);
      setproductDetailArray(res.data.detail);
      // setproductDetailId(res.data.productDetailId);
      let initProduct = res.data.history[0]; //預設品名跟規格用
      console.log('initProduct', initProduct);
      setselect_main(initProduct.productId);
      // setProductName(initProduct.name);
      // setspecification(initProduct.specification);
    }
  };

  //搜尋主檔
  const GetMainProduct = async () => {
    let res = await axios.post(
      `${window.httpMethod}://${window.ip}${window.API_FOLDER}GetMainProduct`,
      {
        keyword: keyword,
      },
    );
    console.log('搜尋結果', keyword, res.data);
    console.log('搜尋結果detail', res.data.detail);
    if (res.data.success && res.data.product.length>0) {
      console.log('搜尋結果',res);
      setproductSearch(res.data.product);
      setproductDetailArray(res.data.detail);
      SettingMain(res.data.product[0].productId);
      // setproductHistory(res.data.history);
    }
  };

  //設置主檔資料
  const SettingMain = item => {
    endEdit();
    console.log('SettingMain', item);
    if (item) {
      setselect_main(item);
    }
    // setselect_main(item.productId);
  };

    //掃描主檔
    const ScanMainProduct = () => {
        setMainScan(true);
        setkeyword('');
    };

//主檔掃描成功
  const onMainSuccess = async e => {
    //掃描成功
    alert(e.data);
    let str = e.data.toString();
    await setkeyword(str);
    await setMainScan(false);
  };
  
  
  //清除資料
  const clearData = () => {
    setEan('');
    // setProductName('');
    // setspecification('');
    setunit('');
    setpp('');
    setprice('');
    // setselect_main('');
    // setproductDetailId('');
    // GetProductHistory();
  };

  useEffect(() => {
    if (!MainMethod) {
      console.log('切回主檔紀錄');
      // setselect_main('');
      // setmainName('');
      GetProductHistory();
    } else {
      // GetMainProduct();
      setkeyword('');
      // setmainName('');
      setproductSearch([]);
    }
  }, [MainMethod]);

  useEffect(() => {
    if (keyword.length > 0) {
      GetMainProduct();
    }
  }, [keyword]);

  const SearchProductName = () => {
    if (MainMethod == false) {
      //紀錄搜尋
      console.log('查詢紀錄搜尋 產品名稱');
      let product = productHistory.filter(
        item => item.productId == select_main,
      );
      console.log(product);
      if (product && product.length > 0) {
        setmainName(product[0].name);

        setProductName(product[0].name);
        setspecification(product[0].specification);
      } else {
        setmainName('');
        setselect_main('');
      }
    } else {
      //掃描搜尋
      console.log('掃描搜尋 產品名稱');
      let product = productSearch.filter(item => item.productId == select_main);
      console.log(product);
      if (product && product.length > 0) {
        setmainName(product[0].name);
        setProductName(product[0].name);
        setspecification(product[0].specification);
      } else {
        setmainName('');
        setselect_main('');
      }
    }
  };

  // 編輯子檔
  const startEdit = item => {
    console.log(item);
    setEditDetailId(item.productDetailId);
    setEditMode(true);
    setEan(item.ean);
    setProductName(item.productDetailName);
    setspecification(item.specification);
    setunit(item.unit);
    setpp(JSON.stringify(item.pp));
    // let editPrice = Number(item.price);
    let editPrice = Math.floor(item.price);
    setprice(JSON.stringify(editPrice));
  };

  const endEdit = item => {
    setEditDetailId('');
    setEditMode(false);
    setEan('');
    // setProductName('');
    // setspecification('');
    setunit('');
    setpp('');
    setprice('');
  };

  const updateProductDetail = async () => {
    if (!select_main || !productName || !ean || !unit || !pp || !price) {
      console.log('格式錯誤');
      alert('格式錯誤!');
      return null;
    }

    let res = await axios
      .post(
        `${window.httpMethod}://${window.ip}${window.API_FOLDER}updatePpProductpost`,
        {
          ean: ean,
          productName: productName,
          productId: select_main, //主檔productId
          productDetailId: editDetailId,
          specification: specification ? specification : '',
          unit: unit,
          pp: pp,
          price: price,
          taxType: taxType,
        },
      )
      .catch(err => {
        console.log('500拉', err);
        alert('不知名錯誤');
      });
    console.log(res);
    console.log(res.data);
    if (res.data.success) {
      alert('更新成功');
      clearData();
      setkeyword('');
      setEditMode(false);
      GetProductHistory();
      // setproductDetailId(`${Math.round(new Date().getTime()) * 2}`);
      // navigation.navigate('Home', {
      //   routeName: 'Home',
      //   transitionStyle: 'horizontal',
      // });
    } else {
      alert('國際碼重複');
    }
  };

  useEffect(() => {
    console.log('查詢商品名');
    SearchProductName();
  }, [select_main]);

  //掃描、手動切換
  const changeInputMethod = type => {
    endEdit();
    //手動、掃描切換
    if (type) {
      setInputType(true);
      setCameraStatus(true)
    } else {
      setInputType(false);
      setCameraStatus(false)
    }
  };



  return (
    <>
      {cameraStatus || MainScan ? (
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
                MainMethod ? {} : {backgroundColor: '#3dbf47'},
              ]}
              onPress={() => changeMainMethod(false)}>
              <Text style={styles.ScanBtn}>主檔紀錄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ScanBtnContainer,
                MainMethod ? {backgroundColor: '#3dbf47'} : {},
              ]}
              onPress={() => changeMainMethod(true)}>
              <Text style={styles.ScanBtn}>主檔搜尋</Text>
            </TouchableOpacity>
          </View>
          {!MainMethod ? (
            <View>
              <View style={styles.pickerStyle}>
                <Picker
                  ref={MainpickerRef}
                  selectedValue={select_main}
                  onValueChange={(item, itemIndex) => {
                    SettingMain(item);
                  }}>
                  {productHistory
                    ? productHistory.map(item => {
                        return (
                          <Picker.Item
                            label={item.name + '(' + item.specification + ')'}
                            key={item.productId}
                            value={item.productId}
                          />
                        );
                      })
                    : []}
                </Picker>
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  style={[styles.input, {width: '50%'}]}
                  onChangeText={text => setkeyword(text)}
                  value={keyword}
                />
                <TouchableOpacity
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    backgroundColor: '#3fa5ff',
                    marginHorizontal: 2,
                    borderRadius: 3,
                    width: '50%',
                  }}
                  onPress={() => ScanMainProduct()}>
                  <Text style={styles.ScanBtn}>掃描</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.pickerStyle, {marginTop: 5}]}>
                <Picker
                  ref={MidpickerRef}
                  useNativeAndroidPickerStyle={false}
                  selectedValue={select_main}
                  onValueChange={(item, itemIndex) => {
                    SettingMain(item);
                  }}>
                  {productSearch
                    ? productSearch.map(item => {
                        return (
                          <Picker.Item
                            label={item.name + '(' + item.specification + ')'}
                            key={item.productId}
                            value={item.productId}
                          />
                        );
                      })
                    : []}
                </Picker>
              </View>
            </View>
          )}

          <Text style={styles.TextLabel}>主檔名稱：</Text>
          <View>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              value={mainName}
              editable={false}
            />
          </View>

          <View>
            <Text style={styles.TextLabel}>歷史建檔</Text>
            {productDetailArray ? (
              productDetailArray
                .filter(detail => {
                  return detail.productId == select_main;
                })
                .map(item => (
                  <View
                    key={item.productDetailId}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#dadada',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 3,
                    }}>
                    <View
                      style={{
                        width: '33%',
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {editMode && editDetailId == item.productDetailId ? (
                        <TouchableOpacity onPress={() => endEdit(item)}>
                          <Text
                            style={[
                              styles.ScanBtn,
                              {
                                color: 'red',
                                fontSize: 16,
                                paddingRight: 3,
                              },
                            ]}>
                            取消編輯
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => startEdit(item)}>
                          <Text
                            style={[
                              styles.ScanBtn,
                              {
                                color: 'red',
                                fontSize: 16,
                                paddingRight: 3,
                              },
                            ]}>
                            編輯
                          </Text>
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          fontSize: 16,
                        }}>
                        {item.productDetailName}
                      </Text>
                    </View>

                    <Text
                      style={{fontSize: 16, width: '33%', textAlign: 'center'}}>
                      {item.pp}入({item.unit})
                    </Text>
                    <Text
                      style={{fontSize: 16, width: '33%', textAlign: 'right'}}>
                      ${item.price}
                    </Text>
                  </View>
                ))
            ) : (
              <Text>沒有子檔</Text>
            )}
          </View>
          <View style={[styles.FlexContainer, {marginTop: 20}]}>
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
              onPress={() => changeInputMethod(true)}>
              <Text style={styles.ScanBtn}>掃描條碼</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.TextLabel, {marginTop: 0}]}>國際碼：</Text>
          <View>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setEan(text)}
              value={ean}
              keyboardType="number-pad"
            />
          </View>
          <Text style={styles.TextLabel}>產品名稱：</Text>
          <View>
            <TextInput
              style={[styles.input, styles.SearchInput]}
              onChangeText={text => setProductName(text)}
              value={productName}
            />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '49%'}}>
              <Text style={styles.TextLabel}>規格：(非必填)</Text>
              <View>
                <TextInput
                  style={[styles.input, styles.SearchInput]}
                  onChangeText={text => setspecification(text)}
                  value={specification}
                  placeholder="ex:商品容量100ml、規格、公克、公斤"
                />
              </View>
            </View>
            <View style={{width: '49%'}}>
              <Text style={styles.TextLabel}>最小單位：</Text>
              <View>
                <TextInput
                  style={[styles.input, styles.SearchInput]}
                  onChangeText={text => setunit(text)}
                  value={unit}
                  placeholder="請輸入最小單位:個、瓶、灌、包"
                />
              </View>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '49%'}}>
              <Text style={styles.TextLabel}>進銷比例：</Text>
              <View>
                <TextInput
                  keyboardType="number-pad"
                  style={[styles.input, styles.SearchInput]}
                  onChangeText={text => setpp(text)}
                  value={pp}
                />
              </View>
            </View>
            <View style={{width: '49%'}}>
              <Text style={styles.TextLabel}>價格：</Text>
              <View>
                <TextInput
                  keyboardType="number-pad"
                  style={[styles.input, styles.SearchInput]}
                  onChangeText={text => setprice(text)}
                  value={price}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.TextLabel}>稅別：</Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 2,
                    borderRadius: 5,
                    marginHorizontal: 5,
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    borderColor: '#22ca2c',
                  },
                  taxType == 1 ? {backgroundColor: '#22ca2c'} : {},
                ]}
                onPress={() => settaxType(1)}>
                <Text
                  style={[
                    {
                      color: '#22ca2c',
                      fontSize: 18,
                    },
                    taxType == 1 ? {color: 'white'} : {},
                  ]}>
                  含　稅
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 2,
                    borderRadius: 5,
                    marginHorizontal: 5,
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    borderColor: 'red',
                    color: 'red',
                  },
                  taxType == 0 ? {backgroundColor: 'red'} : {},
                ]}
                onPress={() => settaxType(0)}>
                <Text
                  style={[
                    {
                      color: 'red',
                      fontSize: 18,
                    },
                    taxType == 0 ? {color: 'white'} : {},
                  ]}>
                  不含稅
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {editMode ? (
            <TouchableOpacity
              style={[styles.SearchContainer, {backgroundColor: '#ffe000'}]}
              onPress={() => updateProductDetail()}>
              <Text style={[styles.SearchBtn, {color: 'black'}]}>更新</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.SearchContainer}
              onPress={() => SubmitCreateProduct()}>
              <Text style={styles.SearchBtn}>送出</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.SearchContainer, {backgroundColor: '#909090'}]}
            onPress={() => clearData()}>
            <Text style={styles.SearchBtn}>清除</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {cameraStatus ? (
        <>
            <View style={styles.sectionContainer}>
            <Camera style={styles.camera} 
                flashMode={cameraStatus ? "torch" : "no"}
                type={Camera.Constants.Type.back}
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
                }}
                onBarCodeScanned={handleBarCodeScanned}>
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
      {MainScan ? (
        <>
            <View style={styles.sectionContainer}>
            <Camera style={styles.camera} 
                flashMode={MainScan ? "torch" : "no"}
                type={Camera.Constants.Type.back}
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
                }}
                onBarCodeScanned={onMainSuccess}>
            </Camera>
            </View>
        
            <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setMainScan(false)}>
                <Text style={styles.buttonText}>關閉掃描</Text>
            </TouchableOpacity>
        </>
      ) : (
        <Text />
      )}

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
      width: '100%',
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
      marginTop: 20,
      marginBottom: 5,
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
  
      marginVertical: 15,
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
    pickerStyle: {
      borderWidth: 1,
      borderColor: '#ced4da',
    },
    camera: {
        flex: 1,
    },
  });