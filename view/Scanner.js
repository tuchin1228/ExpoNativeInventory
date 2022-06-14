import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Button } from 'react-native';
import React ,{useState , useEffect} from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';



export default function Scanner() {
    const [cameraStatus,setCameraStatus] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scanData,setScanData] = useState()
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      setScanData(data)
      setScanned(false);
      setCameraStatus(false)
      
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>同意相機權限才可使用</Text>;
    }
  
    return (
      <View style={styles.container}>
        {
          cameraStatus ? (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          ): (
            <>
              <Button title='開相機' onPress={()=>setCameraStatus(true)}></Button>
              <Text>{scanData ? scanData : null}</Text>
            </>
          )
        }
        
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      marginTop:50,
      flex: 1,
      justifyContent:'center',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bigBlue: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: 30,
    }
  });
  