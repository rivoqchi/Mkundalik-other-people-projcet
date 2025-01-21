import { API } from '../../config';

export const signup = (user) => {
    return fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};
export const signIn = (user) => {
    return fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};
export const createEmployee = (employee) => {
    return fetch(`${API}/auth/create/newemployee`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employee)
    })
    .then(response => response.json())    
    .catch(err => console.log(err));
};
export const signout = (next) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        next();
        return fetch(`${API}/auth/signout`, {
            method: 'GET'
        })
        .then(response => {
            console.log('signout', response);
        })
        .catch(err => console.log(err));
    }
};
export const isAuthenticated = () => {
    if (typeof window === 'undefined') {
      return false;
    }
    if (localStorage.getItem('jwt')) {
      return JSON.parse(localStorage.getItem('jwt'));
    }
    return false;
  };
  
  export const fetchRole = async () => {
    try {
      const response = await fetch(`${API}/auth`, {
        method: "GET",
        headers: {
          authorization: window.localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      return data.message;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
export const auth = (user) => {
    return fetch(`${API}/auth`, {
        method: "GET",
        headers: {
            authorization: window.localStorage.getItem("token"),
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const newAdmin = (user) => {
    return fetch(`${API}/auth/addnewadmin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};