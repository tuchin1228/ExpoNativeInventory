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


export default CreateProduct = ({route}) => {

    const navigation = useNavigation();
    const [scan, setScan] = useState(false);
    const [cate_main, setcate_main] = useState([]);
    const [cate_mid, setcate_mid] = useState([]);
    const [cate_kid, setcate_kid] = useState([]);
    const [RepeatProduct, setRepeatProduct] = useState(false); //檢查重複的商品
    const [ean, setEan] = useState('');
    const [productId, setproductId] = useState('');
    const [productName, setProductName] = useState('');
    const [select_main, setselect_main] = useState('');
    const [select_mid, setselect_mid] = useState('');
    const [select_kid, setselect_kid] = useState('');
    const [productDetailId, setproductDetailId] = useState('');
    const [specification, setspecification] = useState('');
    const [unit, setunit] = useState('');
    const [pp, setpp] = useState('1');
    const [price, setprice] = useState('0');
    const [taxType, settaxType] = useState(1);
    const [inputType, setInputType] = useState(false); //0手動 1掃描
    const MainpickerRef = useRef();
    const MidpickerRef = useRef();
    const KidpickerRef = useRef();
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
        // setproductId(Math.round(new Date().getTime()));
        // setproductDetailId(Math.round(new Date().getTime()) * 2);
        // console.log('撈資料');
        GetCreateProduct();
    }, [navigation, route]);

    
    // watch main_cate
    useEffect(() => {
        if (CateMid && CateMid.length > 0 && CateMid[0]) {
        setselect_mid(CateMid[0].id);
        } else {
        setselect_mid('');
        }
        if (CateKid && CateKid.length > 0 && CateKid[0]) {
        setselect_kid(CateKid[0].id);
        } else {
        setselect_kid('');
        }
    }, [select_main]);

    // computed cateMid
    const CateMid = useMemo(() => {
        return cate_mid.filter(item => item.cateMainId == select_main);
    }, [select_main]);

    // computed cateMid
    const CateKid = useMemo(() => {
        return cate_kid.filter(item => item.cateMainId == select_main);
    }, [select_main]);

    const GetCreateProduct = async () => {
        let res = await axios.get(
          `${window.httpMethod}://${window.ip}${window.API_FOLDER}createProduct`,
        );
        console.log(res.data);
        if (res.data.success) {
          setcate_main(res.data.cate_main);
          setcate_mid(res.data.cate_mid);
          setcate_kid(res.data.cate_kid);
          setselect_main(res.data.cate_main[0].id);
          // setproductId(res.data.productId);
          // setproductDetailId(res.data.productDetailId);
        }
    };


    const SubmitCreateProduct = async () => {
        console.log(
          '建檔',
          `${window.httpMethod}://${window.ip}${window.API_FOLDER}createProductpost`,
        );
        if (!productName || !ean || !unit || !pp || !price) {
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
        //   'productId',
        //   productId,
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
            `${window.httpMethod}://${window.ip}${window.API_FOLDER}createProductpost`,
            {
              ean: ean,
              productName: productName,
              // productId: productId,
              // productDetailId: productDetailId,
              specification: specification ? specification : '',
              unit: unit,
              pp: pp,
              price: price,
              taxType: taxType,
              cateMainId: select_main,
              cateMidId: select_mid,
              cateKidId: select_kid,
            },
          )
          .catch(err => {
            alert('不知名錯誤');
          });
        // .catch(err => {
        //   console.log('500拉', err);
        // });
        console.log('res', res);
        console.log(res.data);
        if (res.data.success) {
          alert('建檔成功');
          setEan('');
          setProductName('');
          setspecification('');
          setunit('');
          setpp('1');
          setprice('0');
          setproductId('');
          setproductDetailId('');
          GetCreateProduct();
    
          // navigation.navigate('Home', {
          //   routeName: 'Home',
          //   transitionStyle: 'horizontal',
          // });
        } else if (res.data.success == false) {
          alert('商品已建立，國際碼重複');
        }
      };
    
      const SubmitUpdateProduct = async () => {
        if (!productName || !ean || !unit || !pp || !price) {
          console.log('格式錯誤');
          alert('格式錯誤!');
          return null;
        }
        console.log('格式正確');
    
        let res = await axios
          .post(
            `${window.httpMethod}://${window.ip}${window.API_FOLDER}updateProductpost`,
            {
              ean: ean,
              productName: productName,
              productId: productId,
              productDetailId: productDetailId,
              specification: specification ? specification : '',
              unit: unit,
              pp: pp,
              price: price,
              taxType: taxType,
              cateMainId: select_main,
              cateMidId: select_mid,
              cateKidId: select_kid,
            },
          )
          .catch(err => {
            console.log(err);
            alert('不知名錯誤');
          });
        console.log(res);
        if (res.data.success) {
          alert('更新成功');
          setEan('');
          setProductName('');
          setspecification('');
          setunit('');
          setpp('');
          setprice('');
          setproductId('');
          setproductDetailId('');
          GetCreateProduct();
          setRepeatProduct(false);
          // navigation.navigate('Home', {
          //   routeName: 'Home',
          //   transitionStyle: 'horizontal',
          // });
        }
      };
    
      const resetEan = () => {
        setEan('');
        setProductName('');
        setspecification('');
        setunit('');
        setpp('');
        setprice('');
        setproductId('');
        setproductDetailId('');
        GetCreateProduct();
        setRepeatProduct(false);
      };
    
      //檢查國際碼重複，要帶資料回來
      const GetProduct = async () => {
        let res = await axios
          .post(
            `${window.httpMethod}://${window.ip}${window.API_FOLDER}GetspecificProduct`,
            {
              ean: ean,
            },
          )
          .catch(err => {
            console.log('不知名錯誤');
          });
    
        if (res.data.success) {
          console.log(res.data.result);
          if (res.data.result == null) {
            setRepeatProduct(false);
            setProductName('');
            setspecification('');
            setunit('');
            setpp('1');
            setprice('0');
            setproductId('');
            setproductDetailId('');
            GetCreateProduct();
            setselect_main(cate_main[0]);
            setselect_mid(cate_mid[0]);
            setselect_kid(cate_kid[0]);
            return null;
          }
          setRepeatProduct(true);
          setEan(res.data.result.ean);
          setProductName(res.data.result.name);
          setspecification(res.data.result.specification);
          setunit(res.data.result.unit);
          setpp(JSON.stringify(res.data.result.pp));
          setprice(res.data.result.price);
          setproductId(res.data.result.productId);
          setproductDetailId(res.data.result.productDetailId);
          setselect_main(res.data.result.cateMainId);
          setselect_mid(res.data.result.cateMidId);
          setselect_kid(res.data.result.cateKidId);
        } else {
          console.log('res fail', res.data.msg);
          setRepeatProduct(false);
          // clearData();
          alert('沒有重複國際碼');
        }
        // console.log(res);
    };

    
    //清除資料
    const clearData = () => {
        setEan('');
        setProductName('');
        setspecification('');
        setunit('');
        setpp('');
        setprice('');
        setproductId('');
        setproductDetailId('');
        GetCreateProduct();
        setRepeatProduct(false)
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
    
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={
                    ([styles.input, styles.SearchInput],
                    {
                      width: '90%',
                      borderColor: '#bebebe',
                      borderWidth: 1,
                      paddingVertical: 7,
                    })
                  }
                  editable={!RepeatProduct}
                  onChangeText={text => setEan(text)}
                  value={ean}
                  keyboardType="number-pad"
                />
    
                <TouchableOpacity
                  onPress={() => {
                    resetEan();
                  }}
                  style={{
                    width: 35,
                    marginHorizontal: 2,
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                      borderColor: '#bebebe',
                      borderWidth: 1,
                      borderRadius: 200,
                      textAlign: 'center',
                    }}>
                    x
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.ScanBtnContainer, {backgroundColor: '#22ca2c'}]}
                onPress={() => GetProduct(ean)}>
                <Text style={[styles.ScanBtn]}>檢查國際碼</Text>
              </TouchableOpacity>
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
                <View style={{width: '33%'}}>
                  <Text style={styles.TextLabel}>主類別：</Text>
                  <View style={styles.pickerStyle}>
                    <Picker
                      ref={MainpickerRef}
                      selectedValue={select_main}
                      onValueChange={(itemValue, itemIndex) =>
                        setselect_main(itemValue)
                      }>
                      {cate_main.map(item => {
                        return (
                          <Picker.Item
                            label={item.cateMainName}
                            key={item.id}
                            value={item.id}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
                <View style={{width: '33%'}}>
                  {CateMid && CateMid.length > 0 ? (
                    <>
                      <Text style={styles.TextLabel}>次類別：</Text>
                      <View style={styles.pickerStyle}>
                        <Picker
                          ref={MidpickerRef}
                          selectedValue={select_mid}
                          onValueChange={itemValue => setselect_mid(itemValue)}>
                          {CateMid.map(item => {
                            return (
                              <Picker.Item
                                label={item.cateMidName}
                                key={item.id}
                                value={item.id}
                              />
                            );
                          })}
                        </Picker>
                      </View>
                    </>
                  ) : (
                    <Text />
                  )}
                </View>
                <View style={{width: '33%'}}>
                  {CateKid && CateKid.length > 0 ? (
                    <>
                      <Text style={styles.TextLabel}>標籤：</Text>
                      <View style={styles.pickerStyle}>
                        <Picker
                          ref={KidpickerRef}
                          selectedValue={select_kid}
                          onValueChange={(itemValue, itemIndex) =>
                            setselect_kid(itemValue)
                          }>
                          {CateKid.map(item => {
                            return (
                              <Picker.Item
                                label={item.cateKidName}
                                key={item.id}
                                value={item.id}
                              />
                            );
                          })}
                        </Picker>
                      </View>
                    </>
                  ) : (
                    <Text />
                  )}
                </View>
              </View>
              <View>
                <TextInput
                  style={[styles.input, styles.SearchInput, {display: 'none'}]}
                  onChangeText={text => setproductDetailId(text)}
                  value={productDetailId}
                  editable={false}
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
              {RepeatProduct ? (
                <TouchableOpacity
                  style={[styles.SearchContainer, {backgroundColor: '#ffe000'}]}
                  onPress={() => SubmitUpdateProduct()}>
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
    
          {/* 底部連結 */}
        
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
        maxHeight:300,
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
  