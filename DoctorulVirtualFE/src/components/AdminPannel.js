import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import './AdminPannel.css'

const URL = 'https://jsonplaceholder.typicode.com/users'

function useAPi(url) {
  const [data, setData] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const response = await fetch("http://localhost:8080/users", {
     method: "GET",
     headers: {
       "Content-Type": "application/json"
     }
   })
   .then((data) => {
    if (!data.ok){
      throw new Error(data.json());
    }
    return data.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    });
    console.log(response)
    setData(response)
  }

  const removeData = async (id) => {
    const response = await fetch('http://localhost:8080/user/'+id, {
     method: "DELETE",
     headers: {
       "Content-Type": "application/json"
     }
   })
   .then((data) => {
    if (!data.ok){
      throw new Error(data.json());
    }
    return data;
    })

    console.log(response)
    const del = data.filter((item) => id !== item.id)
    setData(del)
  }

  return { data, removeData }
}


const AdminPannel = () => {
    const { data, removeData } = useAPi(URL)
     
    const { logOut, user, role } = useUserAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await logOut();
        navigate("/");
      } catch (error) {
        console.log(error.message);
      }
    };

    const renderHeader = () => {
        let headerElement = ['id', 'name', 'username','email', 'operatiuni']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return data && data.map(({ id, name, username, email }) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td className='operation'>
                        <button className='button' onClick={() => removeData(id)}>Stergere</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
          <div className="big_div">
            <div className="p-4 box mt-3 user_info">
              <div className="text-center user_info_box">
                <h3>Bine ai venit, <br /></h3>
                <h4>{user}</h4>
              </div>
              
              <div className="d-grid gap-2 button_class">
                  <Button className="text-center" variant="primary"  onClick={handleLogout}>
                    Log out
                  </Button>
                  
              </div>
            </div>
            <div className="table_div">
              <h1 id='title'>Utilizatori</h1>
              <table id='employee'>
                  <thead>
                      <tr>{renderHeader()}</tr>
                  </thead>
                  <tbody>
                      {renderBody()}
                  </tbody>
              </table>
            </div>
          </div>
        </>
    )
}


export default AdminPannel;