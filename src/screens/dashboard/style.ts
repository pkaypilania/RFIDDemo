import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f2942',
  },
  mode: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#1565c0',
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    color: '#4e5d6c',
  },
  summary: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 14,
    color: '#1e2d3b',
    fontWeight: '600',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  rowButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: '#1f2f40',
    fontWeight: '600',
  },
  button: {
    flex: 1,
    backgroundColor: '#0b4f8a',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  smallButton: {
    width: 40,
    backgroundColor: '#0b4f8a',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonMuted: {
    backgroundColor: '#4f7ca3',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    marginTop: 12,
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dde3ea',
    padding: 12,
    marginBottom: 8,
  },
  epc: {
    fontWeight: '700',
    color: '#12283d',
    fontSize: 14,
  },
  meta: {
    marginTop: 2,
    color: '#4d5f70',
    fontSize: 12,
  },
});

export default styles;
