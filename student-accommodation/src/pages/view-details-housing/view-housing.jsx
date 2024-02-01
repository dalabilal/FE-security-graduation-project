import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useNotification from '../../hook/notification.hook';
import './view-housing.css'
import { useUser } from '../../service/UserContext';

const imageUrl="https://th.bing.com/th/id/OIP.OfQ9D-ht_ihNi9sbI7mZlwHaEK?rs=1&pid=ImgDetMain"

const ViewHousing = () => {
    const { id } = useParams();
    const [housingData, setHousingData] = useState(null);
    const { setNotification } = useNotification();
    const username = sessionStorage.getItem('username');
    const navigate = useNavigate();
    const {setIdparam} = useUser();
    
    useEffect(() => {
        const fetchHousingData = async () => {
          try {
            const response = await fetch(`http://localhost:3005/all/housing/${id}`);
            if (response.ok) {
              const data = await response.json();
              setIdparam(id);
              setHousingData(data);
            } else {
              console.error('Failed to fetch housing data:', response.statusText);
              setNotification({ message: 'Failed to fetch housing data', status: 'err' });
            }
          } catch (error) {
            console.error('Error during fetch:', error.message);
            setNotification({ message: 'Error during fetch', status: 'err' });
          }
        };
    
        fetchHousingData();
      }, [id]);
    
      if (!housingData) {
        return <div>Loading...</div>;
      }


  return (
    <div className='view-page-group-buttons'>
    <div className="view-page-group">
            <img className="image-housing" src={imageUrl} alt='housing pic'/>
        <div className="information">
                   <h2>{housingData.name}</h2>
                   <p id='cardItem'>{housingData.description}</p>
                   <p id='cardItem'>Number of room : {housingData.rooms}</p>
                   <p id='cardItem'>{housingData.location}</p>
                   <p id='cardItem'>Added by : {username}</p>
                   <p id='cardItem'>{housingData.phoneNumber}</p>
        </div>
        <div className="payment">
          <button onClick={() =>navigate('/payment')}>Book now</button>
        </div>
    </div>
    <div className="buttons-container">
        <button id='cardB'>Show Rental terms</button>
        <button id='cardB'>Book Now!</button>
      </div>
    </div>
  )
}

export default ViewHousing
