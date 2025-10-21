import Currency from '../Currency/Currency';
const HomeTab = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Sol taraf - Diğer içerikler */}
      <div style={{ flex: 1 }}>
        {/* Balance, transactions vs. */}
      </div>
      {/* Sağ taraf - Currency */}
      <div>
        <Currency />
      </div>
    </div>
  );
};
export default HomeTab;