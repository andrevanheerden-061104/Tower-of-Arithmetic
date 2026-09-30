import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: '80%',
    aspectRatio: 322 / 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  maskContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  aura: {
    position: 'absolute',
    left: '-7.45%',    // 24 / 322
    right: '-7.45%',
    top: '-35.29%',    // 24 / 68
    bottom: '-35.29%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
  },
});

export default styles;