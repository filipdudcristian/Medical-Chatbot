import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [role, setRole] = useState({});

  // function logIn(email, password) {
  //   return signInWithEmailAndPassword(auth, email, password);
  // }

  async function logIn(usernameOrEmail, password) {
    const apiRequestBody = {
      usernameOrEmail,
      password
    }

    const response = await fetch("http://localhost:8080/login", {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(apiRequestBody),
   })
   .then((data) => {
    if (!data.ok){
      throw new Error("Userul nu poate fi logat!");
    }
    return data.json();
    })
    .then((data) => {
      console.log(data);
      setUser(data.user)
      setRole(data.role)
      return data;
    });
    return response;
  }

  // function signUp(email, username, name, password) {
  //   return createUserWithEmailAndPassword(auth, email, password);
  // }

  async function signUp(email, username, name, password) {
    const apiRequestBody = {
      email,
      username,
      name,
      password
    }

    const response = await fetch("http://localhost:8080/signup", {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(apiRequestBody),
   })

   return response
  }


  function logOut() {
    setUser(-1)
    setRole(-1)
    fetch("http://localhost:8080/logout", {
     method: "GET",
   })
  }

  return (
    <userAuthContext.Provider
      value={{ user, role, logIn, signUp, logOut }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
