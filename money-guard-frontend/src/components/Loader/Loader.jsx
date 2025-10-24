import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundImage: 'url("/public/dashboardbg.png")',
      backgroundSize: 'cover',
      backgroundColor: 'hsla(0, 0%, 90%, 0.8)', 
    }}>
      <ClipLoader color="var(--color-yellow)" size={100} />
    </div>
  );
};

export default Loader;
