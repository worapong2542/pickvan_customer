import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import Card from './Card';

function Status({navigation, route}) {
  const {item} = route.params;
  const data = item.item[0];

  const [text, setText] = useState('');
  const [seconds, setSeconds] = useState(0);
  let status = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      getStatus();
      setSeconds(seconds => seconds + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getStatus();
  }, []);

  async function getStatus() {
    await axios
      .get('http://10.0.2.2:3001/customer/get_Status/' + item.ticket_id)
      .then(res => checkStatus(res.data));
  }

  function checkStatus(value) {
    status = value;
    if (value == 0) {
      setText('ยังไม่ชำระเงิน กดเพื่อชำระเงิน');
    } else if (value == 1) {
      setText('รอตรวจสอบ');
    } else if (value == 2) {
      setText('ชำระเงินเรียบร้อยแล้ว');
    } else {
      setText('ตั๋วของคุณถูกยกเลิก');
    }
  }

  function checkPaid() {
    if (status == 0) {
      navigation.navigate('Payment', {item: item});
    } else if (status == 1) {
      setText('รอตรวจสอบ');
    } else if (status == 2) {
      setText('ชำระเงินเรียบร้อยแล้ว');
    } else {
      setText('ตั๋วของคุณถูกยกเลิก');
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Card>
        <Text style={styles.textTime}>{data.vandata.time.substring(0, 5)}</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <Text style={styles.textDefault}>{data.vandata.name}</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.textDefault}>{data.vandata.license}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <Text style={styles.textDefault}>หมายเลขตั๋ว</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.textDefault}>{item.item[1].ticketid}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <Text style={styles.textDefault}>จำนวน {data.seat_select} ที่</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.textDefault}>
              {data.vandata.price * data.seat_select} บาท
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => checkPaid()}>
          <Text style={styles.textStatus}>{text}</Text>
        </TouchableOpacity>
      </Card>

      <Card>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <Text style={styles.textDefault}>จุดขึ้น : </Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.textDefault}>{data.point_up_select}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <Text style={styles.textDefault}>จุดลง : </Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.textDefault}>{data.point_down_select}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={
            (() => navigation.navigate('Map'),
            {ticket_id: item.item[1].ticketid})
          }>
          <View>
            <Text style={styles.textMap}>กดเพื่อดูตำแหน่งรถตู้</Text>
          </View>
        </TouchableOpacity>
      </Card>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View style={styles.btnConfirm}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
            กลับหน้าหลัก
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Status;

const styles = StyleSheet.create({
  textBold: {
    color: '#5660B3',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  textDefault: {
    color: '#5660B3',
    fontSize: 17,
    marginBottom: 10,
  },
  btnConfirm: {
    marginTop: 150,
    margin: 20,
    backgroundColor: 'rgba(254, 181, 166, 1)',
    borderRadius: 40,
    height: 45,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textTime: {
    color: '#5660B3',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  textStatus: {
    marginTop: 15,
    color: '#5660B3',
    fontSize: 20,
    textAlign: 'center',
  },
  textMap: {
    marginTop: 15,
    color: '#5660B3',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});
