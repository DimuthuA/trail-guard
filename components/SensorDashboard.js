import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { detectStep } from '../modules/stepCounter';
import AccelerometerReader from './sensors/AccelerometerReader';
import BarometerReader from './sensors/BarometerReader';
import BatteryReader from './sensors/BatteryReader';
import GyroscopeReader from './sensors/GyroscopeReader';
import LocationReader from './sensors/LocationReader';
import SignalReader from './sensors/SignalReader';

export default function SensorDashboard() {
  const [acc, setAcc] = useState({});
  const [gyro, setGyro] = useState({});
  const [loc, setLoc] = useState({});
  const [steps, setSteps] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [battery, setBattery] = useState(null);
  const [signal, setSignal] = useState(null);

  return (
    <View style={styles.container}>
      <Text>Steps: {steps}</Text>
      <Text>Accel: x={acc.x?.toFixed(2)} y={acc.y?.toFixed(2)}</Text>
      <Text>Gyro:  x={gyro.x?.toFixed(2)} y={gyro.y?.toFixed(2)}</Text>
      <Text>GPS:   {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}</Text>
      <Text>Pressure: {pressure?.toFixed(2)} hPa</Text>
      <Text>Battery: {battery ?? 'N/A'}%</Text>
      <Text>Signal: {signal ?? 'N/A'}</Text>

      {/* Readers */}
      <AccelerometerReader onData={d => {
        setAcc(d);
        if (detectStep(d)) setSteps(s => s + 1);
      }}/>
      <GyroscopeReader onData={setGyro}/>
      <LocationReader    onLocation={setLoc}/>
      <BarometerReader onData={(pressure) => setPressure(pressure)} />
      <BatteryReader onData={setBattery} />
      <SignalReader onData={setSignal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, margin: 10 },
});
