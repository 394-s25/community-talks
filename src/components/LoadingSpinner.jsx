import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = () => {
    return (
        <div style={{display:'flex', justifyContent:'center',alignItems:'center',alignContent:'center', flexDirection:'column',margin:'auto 0', color:"#007bff"}}>
            <FontAwesomeIcon icon={faSpinner} size="2x" spinPulse/>
            <h3 style={{padding:"0.5rem"}}>Loading</h3>
        </div>
    );
}

export default LoadingSpinner;