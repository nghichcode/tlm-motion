import { useEffect, useState } from 'react';
import { Alert, LogBox, SafeAreaView, ScrollView, View } from 'react-native';

import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { Button, Text, TextField } from "../../components";
import { colors } from "../../theme";
import { LoadingModal } from "../../components/LoadingModal";

const RNFS = require('react-native-fs');

const fileName = '/test.txt';
const path = RNFS.DocumentDirectoryPath + fileName;

setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms
setUpdateIntervalForType(SensorTypes.gyroscope, 400); // defaults to 100ms

LogBox.ignoreLogs([
  "Sensor gyroscope",
  "Sensor accelerometer",
])

interface IMot {
  accelerometer?: string
  gyroscope?: string
}

let outData = []
let motData: IMot[] = []

const getUpdateData = (data: any): string => ([
  Math.floor(data?.x / 9.8 * 16384),
  Math.floor(data?.y / 9.8 * 16384),
  Math.floor(data?.z / 9.8 * 16384),
].join(','))

const AccelerometerDataView = ({isStart}: { isStart: boolean }) => {
  const [accelerometerData, setAccelerometerData] = useState<any>({});
  useEffect(() => {
    let accelerometerSubscription;

    if (isStart) {
      accelerometerSubscription = accelerometer
        .subscribe(
          data => {
            setAccelerometerData(data)
            if (motData.length < 1 || motData[motData.length - 1].accelerometer) motData.push({
              accelerometer: getUpdateData(data),
              gyroscope: null,
            } as IMot)
            else {
              motData[motData.length - 1] = {
                ...motData[motData.length - 1],
                accelerometer: getUpdateData(data)
              } as IMot
            }
          });
    } else {
      accelerometerSubscription && accelerometerSubscription?.unsubscribe();
    }
    return () => {
      accelerometerSubscription && accelerometerSubscription?.unsubscribe();
    }
  }, [isStart])
  return (
    <View>
      <Text style={{fontWeight: "bold"}}>Accelerometer</Text>
      <Text>{`${Number(accelerometerData?.x || 0).toFixed(4)} m/s^2`}</Text>
      <Text>{`${Number(accelerometerData?.y || 0).toFixed(4)} m/s^2`}</Text>
      <Text>{`${Number(accelerometerData?.z || 0).toFixed(4)} m/s^2`}</Text>
    </View>
  )

}
const GyroscopeDataView = ({isStart}: { isStart: boolean }) => {
  const [gyroscopeData, setGyroscopeData] = useState<any>({});
  useEffect(() => {
    let gyroscopeSubscription;

    if (isStart) {
      gyroscopeSubscription = gyroscope
        .subscribe(
          data => {
            setGyroscopeData(data)
            if (motData.length < 1 || motData[motData.length - 1].gyroscope) motData.push({
              gyroscope: getUpdateData(data),
              accelerometer: null,
            } as IMot)
            else {
              motData[motData.length - 1] = {
                ...motData[motData.length - 1],
                gyroscope: getUpdateData(data)
              } as IMot
            }
          });
    } else {
      gyroscopeSubscription && gyroscopeSubscription?.unsubscribe();
    }
    return () => {
      gyroscopeSubscription && gyroscopeSubscription?.unsubscribe();
    }
  }, [isStart])
  return (
    <View>
      <Text style={{fontWeight: "bold"}}>Gyroscope</Text>
      <Text>{`${Number(gyroscopeData?.x || 0).toFixed(4)}`}</Text>
      <Text>{`${Number(gyroscopeData?.y || 0).toFixed(4)}`}</Text>
      <Text>{`${Number(gyroscopeData?.z || 0).toFixed(4)}`}</Text>
    </View>
  )

}
const MotionView = ({isStart}: { isStart: boolean }) => {
  return (
    <View
      style={{paddingHorizontal: 20, paddingTop: 40, flexDirection: 'row', justifyContent: "space-around"}}>
      <AccelerometerDataView isStart={isStart}/>
      <GyroscopeDataView isStart={isStart}/>
    </View>
  )
}

export default function MainScreen() {
  const [isRecord, setIsRecord] = useState(false);
  const [deviceName, setDeviceName] = useState('TALI_50');
  const [outStr, setOutStr] = useState('');
  const [loading, setLoading] = useState(false)

  const onRecord = () => {
    if (isRecord) {
      outData.push(...motData?.filter(item => !!(item?.accelerometer && item?.gyroscope))?.map(item => ([
        item?.accelerometer,
        item?.gyroscope,
        0, 0
      ].join(','))))
      outData.push(Math.floor(new Date().getTime() / 1000))
      setOutStr(outData.join('\n'))
      setIsRecord(false)

    } else {
      setOutStr('')
      outData = [
        Math.floor(new Date().getTime() / 1000),
        'Acc_x,Acc_y,Acc_z,Ang_vx,Ang_vy,Ang_vz,Temp,BPM',
      ]
      setIsRecord(true)
    }
  }

  const handleUpload = async () => {
    try {
      setLoading(true)
      await RNFS.writeFile(path, outData.join('\n'), 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!', success);
        })
        .catch((err) => {
          console.log(err.message);
        });
      const _file = {uri: 'file://' + path, name: fileName, type: 'text/plain'}

      const formData = new FormData()
      formData.append("csv", _file)
      const sessionsRes = await fetch(`https://talisman-api.testbox.com.au/api/devices/${deviceName}/motion-data-upload-process`, {
        "headers": {
          "accept": "*/*",
          "content-type": "multipart/form-data",
        },
        "body": formData,
        "method": "POST",
      });
      const resJson = await sessionsRes.text()
      const success = sessionsRes?.status === 200 || sessionsRes?.status === 204
      Alert.alert(success ? 'Success' : 'Error', `${sessionsRes?.statusText || 'Uploaded'} ${resJson}`)
      if (success) {
        setOutStr('')
      }
    } catch (e) {
      console.log(e)
      Alert.alert('Error', e.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <MotionView isStart={isRecord}/>
      <View style={{paddingHorizontal: 20, paddingTop: 40, flex: 1}}>
        <Text text={'OUTPUT:'}/>
        <View style={{
          borderWidth: 1, borderColor: colors.border,
          paddingHorizontal: 2, paddingVertical: 10, marginTop: 10,
          flex: 1
        }}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <Text text={outStr}/>
          </ScrollView>
        </View>
      </View>
      <View style={{paddingHorizontal: 20, paddingTop: 40}}>
        <TextField
          value={deviceName} onChangeText={setDeviceName}
          placeholder={'Device name'}/>
      </View>
      <View style={{paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10, flexDirection: 'row'}}>
        <View style={{flex: 1,}}>
          <Button
            disabled={loading}
            onPress={onRecord}
            text={!isRecord ? 'RECORD' : 'STOP'} preset={'filledSuccess'}
            style={{backgroundColor: !isRecord ? '#94CA23' : '#C03403'}}/>
        </View>
        <View style={{flex: 1, paddingLeft: 10}}>
          <Button
            onPress={handleUpload}
            disabled={loading} text={'UPLOAD'} preset={'filled'}/>
        </View>
      </View>
      <LoadingModal visible={loading}/>
    </SafeAreaView>
  );
}
