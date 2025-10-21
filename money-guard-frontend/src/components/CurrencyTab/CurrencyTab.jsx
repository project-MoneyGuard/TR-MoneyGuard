import Currency from '../Currency/Currency';
const CurrencyTab = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Currency Rates</h2>
      <Currency />
    </div>
  );
};
const styles = {
  container: {
    padding: '20px',
  },
  title: {
    color: '#fff',
    marginBottom: '20px',
    fontSize: '24px',
  },
};
export default CurrencyTab;